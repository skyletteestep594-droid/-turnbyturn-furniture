import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('created_at')

  return (
    <div>
      <header className="flex items-center justify-between px-8 py-6 border-b border-[#c9a24b]/20">
        <div className="font-display text-xl tracking-widest text-[#c9a24b]">
          TURNBYTURN
        </div>
        <nav className="hidden md:flex gap-8 text-sm tracking-wide text-[#f5f1e8]/80">
          <a href="/" className="hover:text-[#c9a24b] transition-colors">Home</a>
          <a href="/shop" className="hover:text-[#c9a24b] transition-colors">Shop</a>
          <a href="#" className="hover:text-[#c9a24b] transition-colors">About</a>
          <a href="#" className="hover:text-[#c9a24b] transition-colors">Contact</a>
        </nav>
        <a href="/shop" className="border border-[#c9a24b] text-[#c9a24b] px-5 py-2 text-sm tracking-wide hover:bg-[#c9a24b] hover:text-black transition-colors">
          Shop Now
        </a>
      </header>

      <section className="flex flex-col items-center text-center px-8 py-32 border-b border-[#c9a24b]/20">
        <p className="text-[#c9a24b] text-sm tracking-[0.3em] mb-4">
          CRAFTED FOR COMFORT
        </p>
        <h1 className="font-display text-5xl md:text-6xl leading-tight max-w-2xl mb-6">
          Chairs built to hold your best moments
        </h1>
        <p className="text-[#9a9a9a] max-w-md mb-10">
          Executive, dining, and lounge chairs finished by hand — designed for homes and offices that don't settle for ordinary.
        </p>
        <a href="/shop" className="bg-[#c9a24b] text-black px-8 py-3 text-sm tracking-wide font-medium hover:bg-[#dab868] transition-colors">
          Shop the Collection
        </a>
      </section>

      <section className="px-8 py-24">
        <h2 className="font-display text-3xl text-center mb-4">
          Shop by Category
        </h2>
        <p className="text-[#9a9a9a] text-center mb-16">
          Find the right chair for every room
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {categories?.map((cat) => (
            <div key={cat.id} className="relative bg-[#141414] border border-[#c9a24b]/20 h-64 flex items-end p-6 hover:border-[#c9a24b]/60 transition-colors overflow-hidden">
              {cat.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cat.image_url} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
              )}
              <span className="relative font-display text-xl">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-20 border-t border-[#c9a24b]/20 text-center">
        <h2 className="font-display text-2xl mb-4">
          Have a question about a chair?
        </h2>
        <p className="text-[#9a9a9a] mb-8">
          Chat with us directly on WhatsApp — we reply fast.
        </p>
        <a href="https://wa.me/2349135473864" target="_blank" rel="noopener noreferrer" className="inline-block border border-[#c9a24b] text-[#c9a24b] px-8 py-3 text-sm tracking-wide hover:bg-[#c9a24b] hover:text-black transition-colors">
          Message us on WhatsApp
        </a>
      </section>

      <footer className="px-8 py-10 border-t border-[#c9a24b]/20 text-center text-[#9a9a9a] text-sm">
        © {new Date().getFullYear()} TurnByTurn Furniture. All rights reserved.
      </footer>
    </div>
  );
}