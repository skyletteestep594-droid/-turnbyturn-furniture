import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default async function AdminOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false })

  const grouped = STATUS_ORDER.map((status) => ({
    status,
    orders: orders?.filter((order) => order.status === status) ?? [],
  })).filter((group) => group.orders.length > 0)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8] p-10">
      <h1 className="font-display text-3xl mb-8">Orders</h1>

      {orders?.length === 0 && (
        <p className="p-6 border border-[#c9a24b]/20 text-[#9a9a9a]">No orders yet.</p>
      )}

      {grouped.map((group) => (
        <div key={group.status} className="mb-8">
          <h2 className="text-sm uppercase tracking-wide text-[#c9a24b] mb-3">
            {group.status} ({group.orders.length})
          </h2>
          <div className="border border-[#c9a24b]/20">
            {group.orders.map((order) => (
              <Link href={`/admin/orders/${order.id}`} key={order.id} className="flex items-center justify-between p-4 border-b border-[#c9a24b]/10 last:border-b-0 hover:bg-[#141414] transition-colors">
                <div>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm text-[#9a9a9a]">{order.customer_phone} · {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-6">
                  <p className="text-[#c9a24b]">₦{Number(order.total).toLocaleString()}</p>
                  <span className="text-xs uppercase tracking-wide px-3 py-1 border border-[#c9a24b]/30 text-[#c9a24b]">{order.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}