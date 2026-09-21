import { cn } from "@/lib/utils";
import Link from "next/link";

export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  return (
    <Link
      href={link}
      title={title}
      className={cn(
        "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white",
        isSelected &&
          "selected bg-[#a31631] text-white shadow-lg shadow-rose-950/20",
      )}
    >
      <span>{name}</span>

      <span data-test-id="post-count" className="sr-only">
        {count}
      </span>
    </Link>
  );
}
