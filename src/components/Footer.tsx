import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-gray-900 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" fill="#F59E0B" />
                <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="1" x2="12" y2="4" />
                  <line x1="12" y1="20" x2="12" y2="23" />
                  <line x1="1" y1="12" x2="4" y2="12" />
                  <line x1="20" y1="12" x2="23" y2="12" />
                </g>
              </svg>
              Sun Score
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              A 0-100 sunshine score for every neighborhood in San Francisco.
              Open source and free to use.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Explore</h3>
            <div className="space-y-2 text-sm text-gray-500">
              <Link href="/methodology" className="block hover:text-gray-900">How It Works</Link>
              <Link href="/map" className="block hover:text-gray-900">Sun Map</Link>
              <Link href="/rankings" className="block hover:text-gray-900">Neighborhood Rankings</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Data Sources</h3>
            <div className="space-y-2 text-sm text-gray-500">
              <p>NREL Satellite Solar Data</p>
              <p>NOAA Weather Stations</p>
              <p>USGS Elevation Data</p>
              <p>OpenStreetMap</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>
            Open source - built with public data from NOAA, NREL, USGS, and OpenStreetMap.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/embed" className="hover:text-gray-600">Embed</Link>
            <Link href="/api-docs" className="hover:text-gray-600">API</Link>
            <a href="https://github.com/flo-flo-lenormand/sf-sunscore" className="hover:text-gray-600 flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
