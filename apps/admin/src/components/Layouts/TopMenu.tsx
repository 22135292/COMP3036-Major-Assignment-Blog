"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  let timeoutId: any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

type FilterKey = "q" | "tag" | "date" | "active";

export function TopMenu({
  query,
  tag,
  date,
  active,
}: {
  query?: string;
  tag?: string;
  date?: string;
  active?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = React.useMemo(
    () =>
      debounce((key: FilterKey, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const trimmed = value.trim();
        if (trimmed.length === 0) {
          params.delete(key);
        } else {
          params.set(key, trimmed);
        }

        // nếu không còn param nào -> quay về /
        const hasAny =
          params.get("q") || params.get("tag") || params.get("date") || params.get("active");

        if (!hasAny) {
          router.push("/");
          return;
        }

        // Nếu đang ở / thì chuyển sang /filter, còn nếu đã ở /filter thì chỉ update params
        router.push(`/search?${params.toString()}`);
      }, 300),
    [router, searchParams],
  );

  return (
    <div className="border-b border-slate-200 bg-white px-5 py-5 lg:px-8">
      <div className="mb-5 flex items-center gap-4">
        <SidebarTrigger className="rounded-lg border border-slate-200" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a31631]">Content management</p>
          <h1 className="text-2xl font-black tracking-tight text-slate-950">Posts dashboard</h1>
        </div>
      </div>

      <form action="#" method="GET" className="grid flex-1 gap-3 lg:grid-cols-[minmax(280px,1.5fr)_1fr_1fr_180px]">
        <Input
          aria-label="Filter by Content:"
          onChange={(e) => updateFilter("q", e.target.value)}
          defaultValue={query}
          placeholder="Search title or content"
          className="h-11 rounded-xl bg-slate-50"
        />

        <div className="contents">
          <Input
            aria-label="Filter by Tag:"
            onChange={(e) => updateFilter("tag", e.target.value)}
            defaultValue={tag}
            placeholder="Filter by tag"
            className="h-11 rounded-xl bg-slate-50"
          />
          <Input
            aria-label="Filter by Date Created:"
            onChange={(e) => updateFilter("date", e.target.value)}
            defaultValue={date}
            type="date"
            placeholder="Filter by date created"
            className="h-11 rounded-xl bg-slate-50"
          />
          <select
            aria-label="Filter by Visibility:"
            defaultValue={active ?? ""}
            onChange={(e) => updateFilter("active", e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
          >
            <option value="">All visibility</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </form>
    </div>
  );
}
