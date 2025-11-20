export default function Home() {
  // Redirect disabilitato - vai manualmente su /dashboard
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Gestionale Commercialista</h1>
        <p className="text-gray-600 mb-8">Benvenuto nel gestionale</p>
        <a 
          href="/dashboard" 
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Vai alla Dashboard
        </a>
      </div>
    </div>
  );
}

