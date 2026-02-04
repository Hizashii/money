import Link from "next/link";

export default function ExportsPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 overflow-auto">
      <div className="max-w-2xl">
        <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Exports</h1>
        <p className="mt-1 text-sm text-slate-500">
          Download your extracted invoice data.
        </p>

        <div className="mt-4 sm:mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-100 grid place-items-center shrink-0">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Export from Invoices</h2>
              <p className="mt-1 text-sm text-slate-500">
                After uploading and extracting invoice PDFs, use the &quot;Export Excel&quot; or &quot;Export CSV&quot; buttons to download your data.
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
              >
                Go to Invoices
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Export formats</h2>
          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-100 grid place-items-center shrink-0">
                  <span className="text-emerald-700 text-xs font-bold">XLS</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Excel (.xlsx)</p>
                  <p className="text-sm text-slate-500">Full data with multiple sheets including summary and details.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-100 grid place-items-center shrink-0">
                  <span className="text-slate-600 text-xs font-bold">CSV</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">CSV (.csv)</p>
                  <p className="text-sm text-slate-500">Simple format compatible with any spreadsheet app.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
