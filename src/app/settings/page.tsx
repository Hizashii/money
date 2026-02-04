import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          App preferences and legal information.
        </p>

        {/* About */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">About</h2>
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-medium text-slate-900">Money</p>
            <p className="mt-1 text-sm text-slate-500">
              Invoice PDF extraction and legitimacy review tool. Upload invoices, extract data, check for issues, and export to Excel or CSV.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Your files are processed locally. We do not store your data.
            </p>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Legal</h2>
          <div className="mt-3 space-y-2">
            <Link
              href="/privacy"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:bg-slate-50 transition"
            >
              <div>
                <p className="font-medium text-slate-900">Privacy Policy</p>
                <p className="text-sm text-slate-500">How we handle your data</p>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/terms"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:bg-slate-50 transition"
            >
              <div>
                <p className="font-medium text-slate-900">Terms of Use</p>
                <p className="text-sm text-slate-500">Service terms and conditions</p>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
