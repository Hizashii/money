import React from "react";
import { CardProps } from "@/interface/card";

export function Cards({
  title,
  description,
  imageUrl,
  buttonText,
  onClick,
  icon,
  badge,
  children,
}: CardProps & {
  onClick?: () => void;
  icon?: React.ReactNode;
  badge?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500/70 via-sky-400/60 to-transparent" />

      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
            {icon}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">
              {title}
            </h3>

            {badge && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {badge}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {imageUrl && (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
          <img
            src={imageUrl}
            alt={title}
            className="h-32 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </div>
      )}

      {children && <div className="mt-4">{children}</div>}

      {buttonText && (
        <button
          onClick={onClick}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          {buttonText}
          <span className="text-white/70">→</span>
        </button>
      )}
    </div>
  );
}
