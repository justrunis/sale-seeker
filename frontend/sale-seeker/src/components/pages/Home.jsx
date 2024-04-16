import Header from "../Header";
import ItemCard from "../ItemCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchItems } from "../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import Pager from "../UI/Pager";

export default function Home() {
  const {
    data: items,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["items"],
    queryFn: ({ signal }) => fetchItems({ signal }),
  });

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(items?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  let content;

  if (isLoading) {
    content = (
      <>
        <div className="flex justify-center">
          <LoadingIndicator />
        </div>
      </>
    );
  }

  if (isError) {
    content = (
      <>
        <div className="flex justify-center">
          <ErrorBlock
            title="An error occurred!"
            message={error.info?.message || "Failed to fetch items."}
          />
        </div>
      </>
    );
  }

  if (items) {
    content = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 justify-items-center align-items-center">
          {currentItems?.map((item, index) => (
            <ItemCard key={index} item={item} />
          ))}
        </div>
        <div className="my-5 flex justify-center">
          <Pager
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-auto">
        <h1 className="text-3xl font-bold text-center mt-10">Home</h1>
        {content}
      </div>
    </>
  );
}
