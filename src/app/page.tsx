import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 overflow-auto">
      <div className="max-w-4xl">
        <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome to Money - your invoice extraction and review tool.
        </p>

        <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Quick action: Upload */}
          <Link
            href="/upload"
            className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:border-slate-300 hover:shadow transition"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 grid place-items-center mb-3 group-hover:bg-slate-200 transition">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>
            <h2 className="font-semibold text-slate-900">Upload invoices</h2>
            <p className="mt-1 text-sm text-slate-500">
              Upload PDF invoices to extract data and review legitimacy.
            </p>
          </Link>

          {/* Quick action: Exports */}
          <Link
            href="/exports"
            className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:border-slate-300 hover:shadow transition"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 grid place-items-center mb-3 group-hover:bg-slate-200 transition">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <h2 className="font-semibold text-slate-900">Export data</h2>
            <p className="mt-1 text-sm text-slate-500">
              Download extracted invoice data as Excel or CSV.
            </p>
          </Link>

          {/* Quick action: Settings */}
          <Link
            href="/settings"
            className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:border-slate-300 hover:shadow transition"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 grid place-items-center mb-3 group-hover:bg-slate-200 transition">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="font-semibold text-slate-900">Settings</h2>
            <p className="mt-1 text-sm text-slate-500">
              Preferences, privacy policy, and terms of use.
            </p>
          </Link>
        </div>

        {/* How it works */}
        <div className="mt-6 sm:mt-8">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">How it works</h2>
          <div className="mt-3 sm:mt-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-medium grid place-items-center">1</span>
              <div>
                <p className="font-medium text-slate-900">Upload PDF invoices</p>
                <p className="text-sm text-slate-500">Drag and drop or select files to upload.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-medium grid place-items-center">2</span>
              <div>
                <p className="font-medium text-slate-900">Review extracted data</p>
                <p className="text-sm text-slate-500">Check vendor, amounts, payment details, and legitimacy scores.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-medium grid place-items-center">3</span>
              <div>
                <p className="font-medium text-slate-900">Export to Excel or CSV</p>
                <p className="text-sm text-slate-500">Download structured data for your accounting workflow.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
