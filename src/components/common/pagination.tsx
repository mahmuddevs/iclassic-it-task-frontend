import { CaretLeft, CaretRight } from "@phosphor-icons/react"

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  // If there's 1 or fewer pages, hide the pagination component completely
  if (totalPages <= 1) return null

  const getPagesRange = () => {
    const totalNumbers = siblingCount * 2 + 3 // current + siblings + first + last + dots

    if (totalPages <= totalNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const showLeftDots = leftSiblingIndex > 2
    const showRightDots = rightSiblingIndex < totalPages - 1

    const firstPageIndex = 1
    const lastPageIndex = totalPages

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
      return [...leftRange, "...", lastPageIndex]
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      )
      return [firstPageIndex, "...", ...rightRange]
    }

    if (showLeftDots && showRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      )
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex]
    }

    return []
  }

  const pages = getPagesRange()

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-8 select-none" aria-label="Pagination Navigation">
      {/* Previous Button */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background-card text-foreground hover:bg-hover disabled:opacity-40 disabled:hover:bg-background-card disabled:cursor-not-allowed transition-all cursor-pointer"
        aria-label="Go to previous page"
      >
        <CaretLeft size={16} weight="bold" />
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`dots-${index}`}
              className="flex items-center justify-center w-9 h-9 text-sm font-semibold text-secondary"
            >
              &bull;&bull;&bull;
            </span>
          )
        }

        const isCurrent = page === currentPage

        return (
          <button
            key={`page-${page}`}
            type="button"
            onClick={() => onPageChange(page as number)}
            className={`flex items-center justify-center w-9 h-9 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              isCurrent
                ? "bg-primary text-white border border-primary font-bold shadow-sm"
                : "border border-border bg-background-card text-foreground hover:bg-hover"
            }`}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        )
      })}

      {/* Next Button */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background-card text-foreground hover:bg-hover disabled:opacity-40 disabled:hover:bg-background-card disabled:cursor-not-allowed transition-all cursor-pointer"
        aria-label="Go to next page"
      >
        <CaretRight size={16} weight="bold" />
      </button>
    </nav>
  )
}