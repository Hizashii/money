import React from "react";

const Navbar = () => {
  return (
    <header className="w-full h-16 bg-white border-b border-slate-100 flex items-center">
      <div className="w-full px-5 flex items-center justify-between">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-slate-900 hover:opacity-90"
        >
          <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 grid place-items-center text-sm leading-none">
            ●
          </span>
          <span className="font-extrabold tracking-tight text-[15px]">
            Money
          </span>
        </a>
      </div>
    </header>
  );
};

export default Navbar;
