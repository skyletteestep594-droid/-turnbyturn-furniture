'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Order = {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_address: string
  city: string | null
  state: string | null
  delivery_notes: string | null
  total: number
  status: string
  created_at: string
}

type OrderItem = {
  product_name: string
  price: number
  quantity: number
}

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrderDetail() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const loadOrder = async () => {
      const supabase = createClient()
      const { data: orderData } = await supabase.from('orders').select('*').eq('id', params.id).single()
      const { data: itemsData } = await supabase.from('order_items').select('product_name, price, quantity').eq('order_id', params.id)
      setOrder(orderData)
      setItems(itemsData ?? [])
      setLoading(false)
    }
    loadOrder()
  }, [params.id])

  const updateStatus = async (newStatus: string) => {
    setUpdating(true)
    const supabase = createClient()
    await supabase.from('orders').update({ status: newStatus }).eq('id', params.id)
    setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev))
    setUpdating(false)
    router.refresh()
  }

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8] p-10">Loading...</div>
  }

  if (!order) {
    return <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8] p-10">Order not found.</div>
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8] p-10">
      <Link href="/admin/orders" className="text-[#c9a24b] text-sm hover:underline mb-6 inline-block">← Back to Orders</Link>
      <h1 className="font-display text-3xl mb-8">Order Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
        <div>
          <h2 className="text-[#c9a24b] text-sm uppercase tracking-wide mb-3">Customer</h2>
          <p className="mb-1">{order.customer_name}</p>
          <p className="mb-1 text-[#9a9a9a]">{order.customer_phone}</p>
          {order.customer_email && <p className="mb-4 text-[#9a9a9a]">{order.customer_email}</p>}

          <h2 className="text-[#c9a24b] text-sm uppercase tracking-wide mb-3 mt-6">Delivery Address</h2>
          <p className="text-[#9a9a9a]">{order.delivery_address}</p>
          <p className="text-[#9a9a9a]">{order.city}{order.city && order.state ? ', ' : ''}{order.state}</p>
          {order.delivery_notes && <p className="text-[#9a9a9a] mt-2 italic">Note: {order.delivery_notes}</p>}

          <h2 className="text-[#c9a24b] text-sm uppercase tracking-wide mb-3 mt-6">Status</h2>
          <select value={order.status} onChange={(e) => updateStatus(e.target.value)} disabled={updating} className="bg-[#141414] border border-[#c9a24b]/20 px-3 py-2 text-white">
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="text-[#c9a24b] text-sm uppercase tracking-wide mb-3">Items</h2>
          <div className="border border-[#c9a24b]/20">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between p-4 border-b border-[#c9a24b]/10 last:border-b-0">
                <p>{item.product_name} × {item.quantity}</p>
                <p className="text-[#c9a24b]">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
            <div className="flex justify-between p-4 font-medium">
              <p>Total</p>
              <p className="text-[#c9a24b]">₦{Number(order.total).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}