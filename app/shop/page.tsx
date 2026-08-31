import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Shop() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('*').eq('status', 'published').order('created_at', { ascending: false })

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-8 py-6 border-b border-[#c9a24b]/20">
        <Link href="/" className="font-display text-xl tracking-widest text-[#c9a24b]">TURNBYTURN</Link>
        <nav className="hidden md:flex gap-8 text-sm tracking-wide text-[#f5f1e8]/80">
          <Link href="/" className="hover:text-[#c9a24b] transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-[#c9a24b] transition-colors">Shop</Link>
        </nav>
      </header>

      <section className="px-8 py-16">
        <h1 className="font-display text-4xl text-center mb-16">Our Collection</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {products?.map((product) => (
            <Link href={`/shop/${product.slug}`} key={product.id} className="bg-[#141414] border border-[#c9a24b]/20 hover:border-[#c9a24b]/60 transition-colors block">
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image_url} alt={product.name} className="h-56 w-full object-cover" />
              ) : (
                <div className="h-56 bg-[#1a1a1a]" />
              )}
              <div className="p-6">
                <h2 className="font-display text-xl mb-2">{product.name}</h2>
                <p className="text-[#9a9a9a] text-sm mb-4">{product.short_description}</p>
                <p className="text-[#c9a24b] font-medium">₦{Number(product.price).toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}