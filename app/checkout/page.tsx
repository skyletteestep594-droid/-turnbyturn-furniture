'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCart } from '@/lib/cart-context';
import { createClient } from '@/lib/supabase/client';

const PaystackCheckoutButton = dynamic(
  () => import('@/app/components/PaystackCheckoutButton'),
  { ssr: false }
);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const createOrder = async (paymentReference: string, paid: boolean) => {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        delivery_address: address,
        subtotal: total,
        total: total,
        payment_status: paid ? 'paid' : 'pending',
        payment_reference: paymentReference,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Order creation failed:', orderError);
      alert('Something went wrong saving your order. Please try again.');
      setLoading(false);
      return;
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items failed:', itemsError);
    }

    try {
      await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });
    } catch (e) {
      console.error('Email notification failed:', e);
    }

    clearCart();
    router.push(`/order-confirmation?orderId=${order.id}`);
  };

  const handlePaystackSuccess = async (reference: any) => {
    const res = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference: reference.reference }),
    });
    const result = await res.json();

    if (result.verified) {
      await createOrder(reference.reference, true);
    } else {
      alert('Payment verification failed. Please contact support.');
      setLoading(false);
    }
  };

  const handlePaystackClose = () => {
    setLoading(false);
  };

  const formFilled = Boolean(name && email && phone && address);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-serif mb-8">Checkout</h1>

      <section className="space-y-4 mb-8">
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border border-[#c9a24b] rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-[#c9a24b] rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-transparent border border-[#c9a24b] rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-transparent border border-[#c9a24b] rounded px-4 py-2"
            rows={3}
          />
        </div>
      </section>

      <section className="border-t border-[#c9a24b]/40 pt-6 mb-8">
        {items.map((item: any) => (
          <div key={item.id} className="flex justify-between text-sm mb-2">
            <p>{item.name} x{item.quantity}</p>
            <p>₦{(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}
        <div className="flex justify-between text-xl mt-4">
          <p>Total</p>
          <p className="text-[#c9a24b] font-medium">₦{total.toLocaleString()}</p>
        </div>
      </section>

      {formFilled ? (
        <PaystackCheckoutButton
          email={email}
          amount={Math.round(total * 100)}
          publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!}
          disabled={loading}
          loading={loading}
          onSuccess={handlePaystackSuccess}
          onClose={handlePaystackClose}
        />
      ) : (
        <button
          onClick={() => alert('Please fill in all delivery details.')}
          className="w-full bg-[#c9a24b]/50 text-black font-semibold py-3 rounded"
        >
          Pay Now
        </button>
      )}
    </div>
  );
}