'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useCart } from '@/lib/cart-context'

type Product = {
  id: string
  name: string
  price: number
  short_description: string | null
  stock_quantity: number
  image_url: string | null
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    const loadProduct = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('products').select('*').eq('slug', params.slug).eq('status', 'published').single()
      setProduct(data)
      setLoading(false)
    }
    loadProduct()
  }, [params.slug])

  const handleAddToCart = () => {
    if (!product) return
    addItem({ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8] p-10">Loading...</div>
  }

  if (!product) {
    return <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8] p-10">Product not found.</div>
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-8 py-6 border-b border-[#c9a24b]/20">
        <Link href="/" className="font-display text-xl tracking-widest text-[#c9a24b]">TURNBYTURN</Link>
        <nav className="hidden md:flex gap-8 text-sm tracking-wide text-[#f5f1e8]/80">
          <Link href="/" className="hover:text-[#c9a24b] transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-[#c9a24b] transition-colors">Shop</Link>
          <Link href="/cart" className="hover:text-[#c9a24b] transition-colors">Cart</Link>
        </nav>
      </header>

      <section className="px-8 py-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="h-96 w-full object-cover border border-[#c9a24b]/20" />
        ) : (
          <div className="h-96 bg-[#141414] border border-[#c9a24b]/20" />
        )}

        <div>
          <h1 className="font-display text-4xl mb-4">{product.name}</h1>
          <p className="text-[#c9a24b] text-2xl font-medium mb-6">₦{Number(product.price).toLocaleString()}</p>
          <p className="text-[#9a9a9a] mb-8">{product.short_description}</p>
          <p className="text-sm text-[#9a9a9a] mb-8">{product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}</p>
          <button onClick={handleAddToCart} disabled={product.stock_quantity === 0} className="inline-block bg-[#c9a24b] text-black px-8 py-3 text-sm tracking-wide font-medium hover:bg-[#dab868] transition-colors disabled:opacity-50">
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </section>
    </div>
  );
}