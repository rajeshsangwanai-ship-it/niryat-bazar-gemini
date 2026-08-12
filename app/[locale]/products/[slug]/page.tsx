import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-8 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-blue-500">
          NIRYAT BAZAR <span className="text-sm font-normal text-slate-400">| B2B Export Platform</span>
        </h1>
        <div className="space-x-4">
          <Link href="/api/rfq" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm rounded-lg border border-slate-700 transition">
            RFQ API Status
          </Link>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm font-semibold rounded-lg shadow-lg transition">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="my-auto text-center py-20 max-w-4xl mx-auto">
        <span className="bg-blue-900/50 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-800">
          Global B2B Trade & Export Engine Live
        </span>
        <h2 className="text-5xl font-black mt-6 mb-4 leading-tight">
          Empowering Exporters & International Buyers Worldwide
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
          Manage RFQs, HS Code Cataloging, Incoterms pricing, and Instant Supplier Verification directly through Niryat Bazar system.
        </p>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12">
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-800">
            <h3 className="font-bold text-blue-400 mb-2">Verified Exporters</h3>
            <p className="text-sm text-slate-400">KYC verification, GSTIN & IEC code integration for secure cross-border trade.</p>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-800">
            <h3 className="font-bold text-blue-400 mb-2">Dynamic RFQs & Quotes</h3>
            <p className="text-sm text-slate-400">Real-time quote requests, port selection, and automated Incoterms handling.</p>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-800">
            <h3 className="font-bold text-blue-400 mb-2">Real-time Architecture</h3>
            <p className="text-sm text-slate-400">Powered by Next.js, Prisma ORM, PostgreSQL, and Socket server connectivity.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-600 border-t border-slate-800 pt-6">
        © 2026 Niryat Bazar. All rights reserved.
      </footer>
    </div>
  );
}