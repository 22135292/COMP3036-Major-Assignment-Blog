import type { PropsWithChildren } from "react";

export function Content({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[#f6f3ed] text-slate-950 dark:bg-[#0d1117] dark:text-slate-50">
      {children}
    </div>
  );
}
