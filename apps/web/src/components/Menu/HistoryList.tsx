import { history } from "@/functions/history";
import { cn } from "@/lib/utils";
import { type Post } from "@repo/db/data";
import Link from "next/link";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function handleDate(month: number, year: number): string {
  // "December, 2024"
  const monthName = new Date(year, month - 1).toLocaleString("en-US", {
    month: "long",
  });
  return `${monthName}, ${year}`;
}

export async function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  const historyItems = history(posts);
  return (
    <div>
      {historyItems.map((item) => (
        <Link
          href={`/history/${item.year}/${item.month}`}
          key={`${item.year}-${item.month}`}
          title={`History / ${handleDate(item.month, item.year)}`}
          className={cn(
            "flex items-center justify-between rounded-lg px-2 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
            `/history/${selectedYear}/${selectedMonth}` ===
              `/history/${item.year}/${item.month}` &&
              "bg-gray-200 text-blue-600",
          )}
        >
          {handleDate(item.month, item.year)}
          <span
            data-test-id="post-count"
            className="order-first mr-3 flex size-6 items-center justify-center rounded-lg border border-slate-200 bg-white text-[11px] text-slate-500 dark:border-slate-700 dark:bg-slate-900"
          >
            {item.count}
          </span>
        </Link>
      ))}
    </div>
  );
}
