import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="w-full h-14 shrink-0 bg-white border-b border-slate-200/60 flex items-center shadow-sm">
      <div className="w-full px-6 flex items-center">
        <Link
          href="/"
          className="font-bold text-slate-900 tracking-tight text-lg hover:text-slate-700 transition"
        >
          MONEY
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
