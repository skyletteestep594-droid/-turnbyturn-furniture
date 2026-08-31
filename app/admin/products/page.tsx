import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import DeleteButton from './DeleteButton'

export default async function AdminProducts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8] p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">All Products</h1>
        <Link href="/admin/products/new" className="bg-[#c9a24b] text-black px-5 py-2 text-sm font-medium hover:bg-[#dab868] transition-colors">+ Add New Product</Link>
      </div>

      <div className="border border-[#c9a24b]/20">
        {products?.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-4 border-b border-[#c9a24b]/10 last:border-b-0">
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-[#9a9a9a]">₦{Number(product.price).toLocaleString()} · {product.stock_quantity} in stock · {product.status}</p>
            </div>
            <div className="flex gap-3">
              <Link href={`/admin/products/${product.id}/edit`} className="text-[#c9a24b] text-sm hover:underline">Edit</Link>
              <DeleteButton productId={product.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}