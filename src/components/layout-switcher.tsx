"use client";

import { usePathname } from "next/navigation";
import AppShell from "./app-shell";

export default function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return <>{children}</>;
  }
  return <AppShell>{children}</AppShell>;
}
