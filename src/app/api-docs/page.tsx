export const metadata = {
  title: "API Documentation - Sun Score",
  description: "Sun Score REST API documentation. Query any SF address for its Sun Score.",
};

export default function ApiDocsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">API Documentation</h1>
      <p className="text-gray-500 mb-10 text-lg">
        Query Sun Score programmatically. Self-host or use the public instance.
      </p>

      {/* Base URL */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Base URL</h2>
        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-amber-400">
          http://localhost:3000/api
        </div>
        <p className="text-xs text-gray-400 mt-2">Replace with your deployed domain when hosting publicly.</p>
      </section>

      {/* Endpoints */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Endpoints</h2>

        {/* GET /api/compute */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">GET</span>
            <code className="text-sm font-mono text-gray-800">/api/compute</code>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Computes and returns the Sun Score for a given latitude/longitude.
            </p>

            <h4 className="font-semibold text-gray-900 text-sm mb-2">Parameters</h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Name</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Type</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Required</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-3 font-mono text-xs">lat</td>
                    <td className="py-2 px-3">number</td>
                    <td className="py-2 px-3">Yes</td>
                    <td className="py-2 px-3">Latitude (must be within SF bounds)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-3 font-mono text-xs">lng</td>
                    <td className="py-2 px-3">number</td>
                    <td className="py-2 px-3">Yes</td>
                    <td className="py-2 px-3">Longitude (must be within SF bounds)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-3 font-mono text-xs">elevation</td>
                    <td className="py-2 px-3">number</td>
                    <td className="py-2 px-3">No</td>
                    <td className="py-2 px-3">Elevation in meters (default: 0)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-3 font-mono text-xs">address</td>
                    <td className="py-2 px-3">string</td>
                    <td className="py-2 px-3">No</td>
                    <td className="py-2 px-3">Display address (passed through to response)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono text-xs">neighborhood</td>
                    <td className="py-2 px-3">string</td>
                    <td className="py-2 px-3">No</td>
                    <td className="py-2 px-3">Neighborhood name (passed through to response)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="font-semibold text-gray-900 text-sm mb-2">Example Request</h4>
            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-300 overflow-x-auto mb-4">
              <pre>{`curl "http://localhost:3000/api/compute?lat=37.7599&lng=-122.4148&elevation=25"`}</pre>
            </div>

            <h4 className="font-semibold text-gray-900 text-sm mb-2">Example Response</h4>
            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-300 overflow-x-auto">
              <pre>{`{
  "score": 82,
  "label": "Sunny",
  "percentile": 85,
  "address": "37.7599, -122.4148",
  "neighborhood": "San Francisco",
  "lat": 37.7599,
  "lng": -122.4148,
  "elevation": 25,
  "scoreRange": { "low": 76, "high": 88, "margin": 6 },
  "components": {
    "sunHours": { "value": 2890, "weight": 0.35, "score": 69 },
    "fogFrequency": { "value": 32, "weight": 0.25, "score": 93 },
    "windExposure": { "value": 8.1, "weight": 0.15, "score": 93 },
    "temperatureStability": { "value": 12.3, "weight": 0.15, "score": 52 },
    "seasonalConsistency": { "value": 18, "weight": 0.10, "score": 77 }
  },
  "seasonal": {
    "jan": 72, "feb": 74, "mar": 78, "apr": 82,
    "may": 85, "jun": 82, "jul": 78, "aug": 80,
    "sep": 88, "oct": 90, "nov": 80, "dec": 72
  },
  "confidence": {
    "level": "high",
    "margin": 6,
    "nearestStationKm": 15,
    "note": "Close to weather stations with direct observations"
  },
  "dataSources": { "measured": [...], "modeled": [...], "limitations": [...] }
}`}</pre>
            </div>
          </div>
        </div>

        {/* GET /api/neighborhoods */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">GET</span>
            <code className="text-sm font-mono text-gray-800">/api/neighborhoods</code>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Returns all SF neighborhoods ranked by Sun Score, including polygon coordinates for map rendering.
            </p>

            <h4 className="font-semibold text-gray-900 text-sm mb-2">Example Request</h4>
            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-300 overflow-x-auto mb-4">
              <pre>{`curl "http://localhost:3000/api/neighborhoods"`}</pre>
            </div>

            <h4 className="font-semibold text-gray-900 text-sm mb-2">Example Response</h4>
            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-300 overflow-x-auto">
              <pre>{`[
  {
    "name": "Potrero Hill",
    "slug": "potrero-hill",
    "lat": 37.761,
    "lng": -122.4,
    "polygon": [[37.77, -122.41], ...],
    "score": 84,
    "label": "Sunny",
    "sunHours": 2950,
    "fogDays": 28,
    "windMph": 8.1
  },
  ...
]`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Self-hosting note */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Self-Hosting</h2>
        <p className="text-sm text-gray-600 mb-3">
          Sun Score is open source. Clone the repo, install dependencies, and you have a fully functional API.
          No API keys required for the core scoring engine - all data is bundled.
        </p>
        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-300 overflow-x-auto">
          <pre>{`git clone https://github.com/YOUR_USERNAME/sunscore.git
cd sunscore && npm install && npm run dev`}</pre>
        </div>
      </section>

      <div className="text-center text-xs text-gray-400 pt-8 border-t border-gray-100">
        Sun Score is MIT licensed. See the README for contribution guidelines.
      </div>
    </div>
  );
}
