export default function TermsPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
      <div className="rounded-2xl bg-white border border-slate-100 p-4 sm:p-6 md:p-8 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Terms of use</h1>
        <p className="text-slate-600 mb-4">
          By using Money you agree to use it responsibly and in line with applicable laws.
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
          <li>You may upload only invoice documents you are allowed to process.</li>
          <li>Extraction is provided “as is”; we do not guarantee accuracy. Always check results before relying on them.</li>
          <li>We are not liable for any loss resulting from use of this tool.</li>
        </ul>
        <p className="mt-6 text-slate-500 text-sm">
          These terms may change. Continued use after changes means you accept them.
        </p>
        <a href="/" className="inline-block mt-6 text-blue-600 hover:underline text-sm">← Back to Money</a>
      </div>
    </div>
  );
}
