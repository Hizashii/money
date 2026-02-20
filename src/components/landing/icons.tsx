import React from "react";

const iconClass = "w-12 h-12";

export function UploadIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  );
}

export function WarningIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

export function CheckIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export function ProductIcon({
  iconKey,
  className = iconClass,
}: {
  iconKey: "upload" | "warning" | "check";
  className?: string;
}) {
  switch (iconKey) {
    case "upload":
      return <UploadIcon className={`${className} text-slate-600`} />;
    case "warning":
      return <WarningIcon className={`${className} text-rose-500`} />;
    case "check":
      return <CheckIcon className={`${className} text-emerald-600`} />;
  }
}
