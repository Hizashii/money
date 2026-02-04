export default function PrivacyPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
      <div className="rounded-2xl bg-white border border-slate-100 p-4 sm:p-6 md:p-8 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Privacy</h1>
        <p className="text-slate-600 mb-4">
          Money is built to respect your data.
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
          <li>Your PDF files are sent to our server only to extract text and invoice fields. They are not stored after the request finishes.</li>
          <li>Extracted data (vendor, date, total, VAT) is shown in your browser. You can optionally save the last extraction locally (localStorage) so you can re-export without re-uploading.</li>
          <li>We do not use your invoices for advertising or sell your data.</li>
          <li>We do not set tracking cookies for advertising.</li>
        </ul>
        <p className="mt-6 text-slate-500 text-sm">
          If you have questions, contact the operator of this site.
        </p>
        <a href="/" className="inline-block mt-6 text-blue-600 hover:underline text-sm">← Back to Money</a>
      </div>
    </div>
  );
}
