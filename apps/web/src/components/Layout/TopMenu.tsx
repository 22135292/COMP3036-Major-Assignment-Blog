"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300,
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  const debounced = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };

  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced;
}

export function TopMenu({ query }: { query?: string }) {
  const router = useRouter();

  const handleSearch = useMemo(
    () =>
      debounce((search: string) => {
        const cleanedSearch = search.trim();

        if (cleanedSearch.length === 0) {
          router.push("/");
          return;
        }

        router.push(
          `/search?q=${encodeURIComponent(cleanedSearch)}`,
        );
      }),
    [router],
  );

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  return (
    <div className="sticky top-0 z-20 border-b border-black/5 bg-[#f6f3ed]/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1117]/90">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center gap-3 px-4 sm:px-5 lg:px-10">
        {/* Mobile navigation trigger */}
        <SidebarTrigger
          type="button"
          className="shrink-0 md:hidden"
          aria-label="Open navigation menu"
        />

        {/* Search icon */}
        <Search className="size-4 shrink-0 text-slate-500" />

        {/* Search input */}
        <Input
          type="search"
          className="h-10 min-w-0 flex-1 border-0 bg-transparent px-0 text-sm shadow-none placeholder:text-slate-400 focus-visible:ring-0 sm:text-base"
          onChange={(event) => {
            handleSearch(event.target.value);
          }}
          defaultValue={query}
          placeholder="Search stories, topics and ideas..."
          aria-label="Search stories"
        />

        {/* Theme switcher */}
        <div className="shrink-0">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
}