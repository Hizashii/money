import React from "react";

function Footer() {
  return (
    <footer className="w-full border-t border-slate-100 bg-white">
      <div className="h-12 px-5 flex items-center justify-between text-sm text-slate-500">
        <span>© {new Date().getFullYear()} Money. All rights reserved.</span>

        <div className="flex items-center gap-4">
          <a
            href="/privacy"
            className="hover:text-slate-700 transition"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="hover:text-slate-700 transition"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
