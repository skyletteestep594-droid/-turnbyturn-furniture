'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type OrderItem = {
  product_name: string
  price: number
  quantity: number
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }
      const supabase = createClient()
      const { data: order } = await supabase.from('orders').select('total').eq('id', orderId).single()
      const { data: items } = await supabase.from('order_items').select('product_name, price, quantity').eq('order_id', orderId)
      if (order) setTotal(Number(order.total))
      if (items) setOrderItems(items)
      setLoading(false)
    }
    loadOrder()
  }, [orderId])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8]">
      <header className="flex items-center justify-between px-8 py-6 border-b border-[#c9a24b]/20">
        <Link href="/" className="font-display text-xl tracking-widest text-[#c9a24b]">TURNBYTURN</Link>
      </header>

      <section className="px-8 py-24 max-w-xl mx-auto text-center">
        <p className="text-[#c9a24b] text-sm tracking-[0.3em] mb-4">ORDER PLACED</p>
        <h1 className="font-display text-4xl mb-6">Thank you for your order</h1>
        <p className="text-[#9a9a9a] mb-12">
          We've received your order and will reach out shortly to confirm delivery details.
        </p>

        {!loading && orderItems.length > 0 && (
          <div className="border border-[#c9a24b]/20 mb-8 text-left">
            {orderItems.map((item, i) => (
              <div key={i} className="flex justify-between p-4 border-b border-[#c9a24b]/10 last:border-b-0">
                <p>{item.product_name} × {item.quantity}</p>
                <p className="text-[#c9a24b]">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
            <div className="flex justify-between p-4 font-medium">
              <p>Total</p>
              <p className="text-[#c9a24b]">₦{total.toLocaleString()}</p>
            </div>
          </div>
        )}

        <Link href="/shop" className="inline-block bg-[#c9a24b] text-black px-8 py-3 text-sm font-medium hover:bg-[#dab868] transition-colors">Continue Shopping</Link>
      </section>
    </div>
  );
}

export default function OrderConfirmation() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <OrderConfirmationContent />
    </Suspense>
  )
}