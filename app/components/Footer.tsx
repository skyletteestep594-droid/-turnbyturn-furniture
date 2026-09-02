export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-[var(--muted)]">
        <div>
          <p className="font-display text-lg text-[var(--ivory)] mb-3">
            TURNBYTURN <span className="text-[var(--gold)]">FURNITURE</span>
          </p>
          <p>Premium chairs, crafted for those who notice the details.</p>
        </div>
        <div>
          <p className="text-[var(--ivory)] mb-3">Shop</p>
          <ul className="space-y-2">
            <li><a href="/shop" className="hover:text-[var(--gold)]">All chairs</a></li>
            <li><a href="/shop" className="hover:text-[var(--gold)]">Categories</a></li>
          </ul>
        </div>
        <div>
          <p className="text-[var(--ivory)] mb-3">Get in touch</p>
          <ul className="space-y-2">
            <li><a href="/contact" className="hover:text-[var(--gold)]">Contact us</a></li>
            <li><a href="https://wa.me/2349135473864" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold)]">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-[var(--muted)]">
        © 2026 TurnByTurn Furniture. All rights reserved.
      </div>
    </footer>
  );
}