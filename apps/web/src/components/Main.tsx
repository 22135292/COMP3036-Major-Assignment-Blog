import type { Post } from "@repo/db/data";
import BlogList from "./Blog/List";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export function Main({
  posts,
  className,
  currentPage = 1,
  totalPages = 1,
  limit = 5,
}: {
  posts: Post[];
  className?: string;
  currentPage?: number;
  totalPages?: number;
  limit?: number;
}) {
  const createPageURL = (pageNumber: number | string) => {
    return `/?page=${pageNumber}&limit=${limit}`;
  };

  return (
    <main className={className + " mx-auto w-full max-w-7xl px-5 py-10 lg:px-10 lg:py-14"}>
      <section className="relative mb-12 overflow-hidden rounded-[2.25rem] bg-[#111827] px-7 py-11 text-white shadow-[0_30px_80px_-35px_rgba(15,23,42,.8)] md:px-12 md:py-16">
        <div className="absolute -right-20 -top-24 size-80 rounded-full bg-[#a31631]/35 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 size-72 rounded-full bg-[#f0b45c]/10 blur-3xl" />
        <div className="relative grid items-end gap-10 lg:grid-cols-[1fr_240px]">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#f0b45c]">The developer edit · Vol. 01</p>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.055em] md:text-6xl lg:text-7xl">Code with clarity.<br />Build with purpose.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">Practical perspectives on engineering, design and the ideas shaping a more thoughtful web.</p>
          </div>
          <div className="hidden border-l border-white/15 pl-7 lg:block">
            <p className="text-4xl font-black tracking-tight">{posts.length}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">Stories on this page</p>
            <div className="mt-7 h-px bg-white/15" />
            <p className="mt-7 text-sm leading-6 text-slate-400">Fresh thinking for developers who care about the details.</p>
          </div>
        </div>
      </section>
      <div className="mb-6 flex items-end justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a31631]">Curated reading</p><h2 className="mt-1 text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-white">Latest stories</h2></div>
        <p className="hidden text-sm text-slate-500 sm:block">Ideas worth saving for later.</p>
      </div>
      <BlogList posts={posts} />
      
      {totalPages > 1 && (
        <div className="py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 ? (
                   <PaginationPrevious href={createPageURL(currentPage - 1)} />
                ) : (
                    <span className="flex h-9 items-center justify-center px-4 text-sm font-medium text-muted-foreground opacity-50">
                        <span className="mr-1 h-4 w-4">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                        </span>
                        Previous
                    </span>
                )}
              </PaginationItem>

              {/* Simple pagination logic: show all if <= 5, otherwise simplistic view */}
              {/* For time constraints, just showing current, prev, next and ellipsis if needed could be complex. 
                  Let's implement a simple version: 1 ... prev current next ... last */}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first, last, current, and neighbors
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href={createPageURL(page)}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  
                   if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                      return <PaginationItem key={page}><PaginationEllipsis /></PaginationItem>
                  }

                  return null;
              })}

              <PaginationItem>
                 {currentPage < totalPages ? (
                    <PaginationNext href={createPageURL(currentPage + 1)} />
                 ) : (
                    <span className="flex h-9 items-center justify-center px-4 text-sm font-medium text-muted-foreground opacity-50">
                        Next
                        <span className="ml-1 h-4 w-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                        </span>
                    </span>
                 )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </main>
  );
}
