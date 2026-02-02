"use client";

import React from "react";
import Link from "next/link";
import "@/app/sidenav.css";

const navItems = [
  { label: "Dashboard", href: "/", icon: "home" },
  { label: "Upload PDF", href: "/upload", icon: "upload" },
];

const Icon = ({ name }: { name: string }) => {
  switch (name) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 3 10v11h6v-7h6v7h6V10L12 3z" />
        </svg>
      );
    case "upload":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3l5 5h-3v6h-4V8H7l5-5z" />
          <path d="M5 19h14v2H5z" />
        </svg>
      );
    case "invoices":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 4v4h5V7H4zm0 6v4h5v-4H4zm7-6v4h9V7h-9zm0 6v4h9v-4h-9z" />
        </svg>
      );
    default:
      return null;
  }
};

const Sidenav = ({ active = "Home" }) => {
  return (
    <aside className="sidenav">
      <div className="sidenav__inner">
        <div className="sidenav__section">
          <div className="sidenav__title">Menu</div>

          <nav className="sidenav__nav">
            {navItems.map((item) => {
              const isActive = item.label === active;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`sidenav__link ${isActive ? "is-active" : ""}`}
                >
                  <span className="sidenav__left">
                    <span className="sidenav__icon">
                      <Icon name={item.icon} />
                    </span>
                    <span className="sidenav__label">{item.label}</span>
                  </span>

                  <span className="sidenav__chev" aria-hidden="true">
                    ›
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidenav;
