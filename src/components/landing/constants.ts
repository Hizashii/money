export const SECTIONS = [
  { id: "product", label: "Product" },
  { id: "invoices", label: "Examples" },
  { id: "how-it-works", label: "How it works" },
  { id: "reviews", label: "Reviews" },
] as const;

export const PRODUCT_FEATURES = [
  {
    title: "Upload & extract",
    desc: "Drag and drop PDF invoices. We extract vendor, dates, amounts, VAT, and payment details using a 3-layer pipeline.",
    gradient: "from-slate-100 to-slate-50",
    iconKey: "upload",
  },
  {
    title: "Legitimacy check",
    desc: "We validate math, IBAN checksums, and beneficiary matching. We flag issues so you can fix them before paying.",
    gradient: "from-rose-50 to-white",
    iconKey: "warning",
  },
  {
    title: "Export to Excel",
    desc: "Download structured data with all extracted fields. No AI, no API keys—runs locally in your browser.",
    gradient: "from-emerald-50 to-white",
    iconKey: "check",
  },
] as const;

export const INVOICE_TYPES = [
  { title: "Professional invoices", desc: "Line items, totals, payment terms", icon: "📄" },
  { title: "Full payment details", desc: "IBAN, SWIFT, beneficiary info", icon: "🏦" },
  { title: "Service & hourly", desc: "Hours, rates, subtotals", icon: "⏱️" },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Upload PDFs",
    desc: "Drag and drop or select invoice PDFs. We extract text and normalize it for reliable parsing.",
  },
  {
    step: "2",
    title: "Review & fix",
    desc: "Check extracted data, legitimacy scores, and fix any wrong fields before export.",
  },
  {
    step: "3",
    title: "Export",
    desc: "Download Excel or CSV with all fields. Use it in your accounting workflow.",
  },
] as const;

export const REVIEWS = [
  {
    quote:
      "Finally, a simple way to get invoice data into a spreadsheet without manual typing.",
    author: "Finance team lead",
    role: "SMB",
  },
  {
    quote:
      "The legitimacy check caught a mismatch we would have missed. Saved us from a potential fraud.",
    author: "Operations manager",
    role: "Startup",
  },
  {
    quote: "Clean export to Excel. No AI, no subscriptions—just works.",
    author: "Freelancer",
    role: "Solo",
  },
] as const;
