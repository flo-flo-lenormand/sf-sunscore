import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 hover:text-amber-600 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" fill="#F59E0B" />
            <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="1" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
              <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
            </g>
          </svg>
          Sun Score
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-500">
          <Link href="/methodology" className="hover:text-gray-900 transition-colors font-medium text-amber-600">How It Works</Link>
          <Link href="/map" className="hover:text-gray-900 transition-colors">Map</Link>
          <Link href="/rankings" className="hover:text-gray-900 transition-colors">Rankings</Link>
        </nav>
      </div>
    </header>
  );
}
