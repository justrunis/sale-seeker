import { Button } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

function PageButton({ children, className, ...props }) {
  return (
    <Button
      className={`btn flex justify-center items-center ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}

export default function Pager({ totalPages, currentPage, setCurrentPage }) {
  const getItemProps = (index) => ({
    variant: currentPage === index ? "filled" : "text",
    className: "btn btn-primary bg-accent-400 px-2 min-h-0 h-[2rem]",
    onClick: () => setCurrentPage(index),
  });

  const next = () => {
    if (currentPage === totalPages) return;
    setCurrentPage(currentPage + 1);
  };

  const prev = () => {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  };

  const getPagerButtons = () => {
    const firstPage = 1;
    const lastPage = totalPages;
    const maxButtons = 6; // Number of buttons to display

    let startPage, endPage;

    if (totalPages <= maxButtons) {
      // Less than or equal to maxButtons, display all buttons
      startPage = firstPage;
      endPage = lastPage;
    } else {
      // More than maxButtons, calculate start and end pages
      const maxVisibleButtons = maxButtons - 2; // Subtract 2 for first and last buttons

      if (currentPage <= maxVisibleButtons / 2) {
        // Current page is near the start
        startPage = firstPage;
        endPage = maxVisibleButtons;
      } else if (currentPage + maxVisibleButtons / 2 >= totalPages) {
        // Current page is near the end
        startPage = totalPages - maxVisibleButtons + 1;
        endPage = lastPage;
      } else {
        // Current page is in the middle
        startPage = currentPage - Math.floor(maxVisibleButtons / 2);
        endPage = currentPage + Math.ceil(maxVisibleButtons / 2);
      }
    }

    // Adjust startPage and endPage if they are out of bounds
    if (startPage < firstPage) {
      startPage = firstPage;
    }
    if (endPage > lastPage) {
      endPage = lastPage;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  };

  return (
    <div className="flex items-center gap-4">
      <button
        variant="text"
        className="btn btn-primary px-2 min-h-0 h-[2rem]"
        onClick={prev}
        disabled={currentPage === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
      </button>
      <div className="flex items-center gap-2">
        {currentPage > 4 && (
          <>
            <PageButton {...getItemProps(1)}>1</PageButton>
          </>
        )}
        {currentPage > 4 && <span className="text-gray-500">...</span>}
        {getPagerButtons().map((page) => (
          <PageButton key={page} {...getItemProps(page)}>
            {page}
          </PageButton>
        ))}
        {currentPage < totalPages - 3 && (
          <span className="text-gray-500">...</span>
        )}
        {currentPage < totalPages - 3 && (
          <PageButton {...getItemProps(totalPages)}>{totalPages}</PageButton>
        )}
      </div>
      <button
        variant="text"
        className="btn btn-primary px-2 min-h-0 h-[2rem]"
        onClick={next}
        disabled={currentPage === totalPages}
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </button>
    </div>
  );
}
