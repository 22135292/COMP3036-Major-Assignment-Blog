"use client";

import { Check, Clock3, Link2 } from "lucide-react";
import { useEffect, useState } from "react";

type ArticleToolsProps = {
  content: string;
};

export function ArticleTools({
  content,
}: ArticleToolsProps) {
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const words = content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const readingMinutes = Math.max(
    1,
    Math.ceil(words / 220),
  );

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const nextProgress =
        scrollableHeight <= 0
          ? 100
          : Math.min(
              100,
              Math.max(
                0,
                (window.scrollY / scrollableHeight) * 100,
              ),
            );

      setProgress(nextProgress);
    };

    updateProgress();

    window.addEventListener(
      "scroll",
      updateProgress,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      updateProgress,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateProgress,
      );

      window.removeEventListener(
        "resize",
        updateProgress,
      );
    };
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <div
        aria-label="Reading progress"
        className="fixed inset-x-0 top-0 z-50 h-1 bg-slate-200/70 dark:bg-slate-800"
      >
        <div
          data-test-id="reading-progress"
          className="h-full bg-[#a31631] transition-[width] duration-150"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-300">
        <span
          data-test-id="reading-time"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <Clock3
            className="size-4"
            aria-hidden="true"
          />

          {readingMinutes} min read
        </span>

        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-medium shadow-sm transition hover:border-[#a31631] hover:text-[#a31631] dark:border-slate-700 dark:bg-slate-900"
        >
          {copied ? (
            <Check
              className="size-4"
              aria-hidden="true"
            />
          ) : (
            <Link2
              className="size-4"
              aria-hidden="true"
            />
          )}

          {copied ? "Link copied" : "Copy link"}
        </button>
      </div>
    </>
  );
}