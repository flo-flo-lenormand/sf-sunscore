export const metadata = {
  title: "Embed Widget - Sun Score",
  description: "Add Sun Score to your website with a simple embed widget.",
};

export default function EmbedPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Embed Sun Score</h1>
      <p className="text-gray-500 mb-10 text-lg">
        Add climate intelligence to your website or real estate listings. Free and open source.
      </p>

      {/* Preview */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Widget Preview</h2>
        <div className="bg-gray-100 rounded-xl p-8 flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 w-[320px]">
            <div className="flex items-center gap-3 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" fill="#F59E0B" />
                <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="1" x2="12" y2="4" />
                  <line x1="12" y1="20" x2="12" y2="23" />
                  <line x1="1" y1="12" x2="4" y2="12" />
                  <line x1="20" y1="12" x2="23" y2="12" />
                </g>
              </svg>
              <span className="text-sm font-bold text-gray-900">Sun Score</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-amber-500">82</div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Sunny</div>
                <div className="text-xs text-gray-500">Sunnier than 85% of SF</div>
                <div className="text-xs text-gray-400 mt-1">Peak: 91 (Oct) / Low: 73 (Jul)</div>
              </div>
            </div>
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-amber-400" style={{ width: "82%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Integration options */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Integration Options</h2>

        <div className="space-y-6">
          {/* Option 1: iframe */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-1">Option 1: iframe Embed</h3>
            <p className="text-sm text-gray-500 mb-3">Simplest integration. Drop this into any HTML page. Replace YOUR_DOMAIN with wherever you deploy Sun Score.</p>
            <div className="bg-gray-900 rounded-xl p-4 text-sm font-mono text-gray-300 overflow-x-auto">
              <pre>{`<iframe
  src="https://YOUR_DOMAIN/widget?address=850+Guerrero+St,+SF"
  width="320"
  height="180"
  frameborder="0"
  style="border-radius: 16px;"
></iframe>`}</pre>
            </div>
          </div>

          {/* Option 2: API */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-1">Option 2: REST API</h3>
            <p className="text-sm text-gray-500 mb-3">Full control. Query the API and render your own UI.</p>
            <div className="bg-gray-900 rounded-xl p-4 text-sm font-mono text-gray-300 overflow-x-auto">
              <pre>{`GET /api/compute?lat=37.7599&lng=-122.4148&elevation=25

{
  "score": 82,
  "label": "Sunny",
  "percentile": 85,
  "neighborhood": "Mission District",
  "components": { ... },
  "seasonal": { ... }
}`}</pre>
            </div>
            <a href="/api-docs" className="inline-block mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium">
              View full API documentation &rarr;
            </a>
          </div>

          {/* Option 3: Self-host */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-1">Option 3: Self-Host</h3>
            <p className="text-sm text-gray-500 mb-3">Sun Score is open source. Fork, customize, and deploy your own instance.</p>
            <div className="bg-gray-900 rounded-xl p-4 text-sm font-mono text-gray-300 overflow-x-auto">
              <pre>{`git clone https://github.com/YOUR_USERNAME/sunscore.git
cd sunscore
npm install
npm run build
npm start`}</pre>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
        <h3 className="font-bold text-amber-900 mb-2">Open Source</h3>
        <p className="text-sm text-amber-800">
          Sun Score is MIT licensed. Use it freely in personal or commercial projects.
          Contributions to improve the model are welcome.
        </p>
      </div>
    </div>
  );
}
