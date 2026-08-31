'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8]">
      <header className="flex items-center justify-between px-8 py-6 border-b border-[#c9a24b]/20">
        <Link href="/" className="font-display text-xl tracking-widest text-[#c9a24b]">TURNBYTURN</Link>
        <nav className="hidden md:flex gap-8 text-sm tracking-wide text-[#f5f1e8]/80">
          <Link href="/" className="hover:text-[#c9a24b] transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-[#c9a24b] transition-colors">Shop</Link>
        </nav>
      </header>

      <section className="px-8 py-16 max-w-3xl mx-auto">
        <h1 className="font-display text-3xl mb-10">Your Cart</h1>

        {items.length === 0 ? (
          <div>
            <p className="text-[#9a9a9a] mb-6">Your cart is empty.</p>
            <Link href="/shop" className="inline-block bg-[#c9a24b] text-black px-6 py-3 text-sm font-medium hover:bg-[#dab868] transition-colors">Continue Shopping</Link>
          </div>
        ) : (
          <>
            <div className="border border-[#c9a24b]/20 mb-8">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border-b border-[#c9a24b]/10 last:border-b-0">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover" />
                  ) : (
                    <div className="w-20 h-20 bg-[#141414]" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-[#c9a24b]">₦{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 border border-[#c9a24b]/30 hover:border-[#c9a24b]">-</button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border border-[#c9a24b]/30 hover:border-[#c9a24b]">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 text-sm hover:underline ml-4">Remove</button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-8">
              <p className="text-xl">Total</p>
              <p className="text-xl text-[#c9a24b] font-medium">₦{total.toLocaleString()}</p>
            </div>

            <Link href="/checkout" className="inline-block bg-[#c9a24b] text-black px-8 py-3 text-sm font-medium hover:bg-[#dab868] transition-colors">Proceed to Checkout</Link>
          </>
        )}
      </section>
    </div>
  );
}