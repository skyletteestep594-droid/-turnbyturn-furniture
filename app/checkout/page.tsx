'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useCart } from '@/lib/cart-context'
import { createClient } from '@/lib/supabase/client'

const PaystackButton = dynamic(() => import('@/components/PaystackButton'), { ssr: false })

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [orderReady, setOrderReady] = useState<{ id: string; customer_name: string; customer_phone: string; delivery_address: string; city: string; state: string; total: number } | null>(null)

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const supabase = createClient()

    const { data: order, error: orderError } = await supabase.from('orders').insert({
      customer_name: fullName,
      customer_phone: phone,
      customer_email: email || null,
      delivery_address: address,
      city,
      state,
      delivery_notes: notes,
      subtotal: total,
      total: total,
      payment_status: 'pending',
    }).select().single()

    if (orderError || !order) {
      setError(orderError?.message ?? 'Something went wrong. Please try again.')
      setSubmitting(false)
      return
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) {
      setError(itemsError.message)
      setSubmitting(false)
      return
    }

    setOrderReady(order)
    setSubmitting(false)
  }

  const handlePaymentSuccess = async (reference: string) => {
    if (!orderReady) return
    setSubmitting(true)

    const verifyRes = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, orderId: orderReady.id }),
    })
    const verifyData = await verifyRes.json()

    if (!verifyData.success) {
      setError('Payment could not be verified. Please contact us.')
      setSubmitting(false)
      return
    }

    fetch('/api/notify-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: orderReady.customer_name,
        customer_phone: orderReady.customer_phone,
        delivery_address: orderReady.delivery_address,
        city: orderReady.city,
        state: orderReady.state,
        total: orderReady.total,
        orderId: orderReady.id,
      }),
    }).catch((err) => console.error('Notification failed:', err))

    clearCart()
    router.push(`/order-confirmation?order=${orderReady.id}`)
  }

  const handlePaymentClose = () => {
    setSubmitting(false)
    setError('Payment was not completed.')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8] p-10 text-center">
        <p className="text-[#9a9a9a] mb-6">Your cart is empty.</p>
        <Link href="/shop" className="inline-block bg-[#c9a24b] text-black px-6 py-3 text-sm font-medium hover:bg-[#dab868] transition-colors">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8]">
      <header className="flex items-center justify-between px-8 py-6 border-b border-[#c9a24b]/20">
        <Link href="/" className="font-display text-xl tracking-widest text-[#c9a24b]">TURNBYTURN</Link>
      </header>

      <section className="px-8 py-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <form onSubmit={handleCreateOrder} className="flex flex-col gap-4">
          <h1 className="font-display text-2xl mb-2">Delivery Details</h1>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <label className="block text-sm text-[#9a9a9a] mb-1">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#141414] border border-[#c9a24b]/20 px-3 py-2 text-white" required disabled={!!orderReady} />
          </div>
          <div>
            <label className="block text-sm text-[#9a9a9a] mb-1">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#141414] border border-[#c9a24b]/20 px-3 py-2 text-white" required disabled={!!orderReady} />
          </div>
          <div>
            <label className="block text-sm text-[#9a9a9a] mb-1">Email (optional)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#141414] border border-[#c9a24b]/20 px-3 py-2 text-white" disabled={!!orderReady} />
          </div>
          <div>
            <label className="block text-sm text-[#9a9a9a] mb-1">Delivery Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-[#141414] border border-[#c9a24b]/20 px-3 py-2 text-white" required disabled={!!orderReady} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#9a9a9a] mb-1">City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-[#141414] border border-[#c9a24b]/20 px-3 py-2 text-white" disabled={!!orderReady} />
            </div>
            <div>
              <label className="block text-sm text-[#9a9a9a] mb-1">State</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-[#141414] border border-[#c9a24b]/20 px-3 py-2 text-white" disabled={!!orderReady} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#9a9a9a] mb-1">Delivery Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-[#141414] border border-[#c9a24b]/20 px-3 py-2 text-white" rows={2} disabled={!!orderReady} />
          </div>

          {!orderReady ? (
            <button type="submit" disabled={submitting} className="bg-[#c9a24b] text-black py-3 font-medium hover:bg-[#dab868] transition-colors mt-2 disabled:opacity-50">
              {submitting ? 'Saving...' : 'Continue to Payment'}
            </button>
          ) : (
            <PaystackButton
              email={email || `${phone}@turnbyturn.com`}
              amount={Math.round(total * 100)}
              publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''}
              disabled={submitting}
              label={submitting ? 'Processing...' : `Pay ₦${total.toLocaleString()}`}
              onSuccess={handlePaymentSuccess}
              onClose={handlePaymentClose}
            />
          )}
        </form>

        <div>
          <h2 className="font-display text-2xl mb-6">Order Summary</h2>
          <div className="border border-[#c9a24b]/20 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between p-4 border-b border-[#c9a24b]/10 last:border-b-0">
                <p>{item.name} × {item.quantity}</p>
                <p className="text-[#c9a24b]">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xl">
            <p>Total</p>
            <p className="text-[#c9a24b] font-medium">₦{total.toLocaleString()}</p>
          </div>
        </div>
      </section>
    </div>
  );
}