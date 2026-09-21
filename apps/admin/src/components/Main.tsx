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
    <main className={className + " mx-auto w-full max-w-[1500px] p-5 lg:p-8"}>
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
