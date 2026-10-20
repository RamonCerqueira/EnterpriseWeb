"use client";

import * as React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
  }, []);

  return <>{children}</>;
}
