import Header from "../Header";
import ItemCard from "../ItemCard";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchItemsByPage } from "../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import Pager from "../UI/Pager";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../SearchBar";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const delay = 500; // delay in ms
  const itemsPerPage = 3;
  const staleTime = 1000 * 60 * 5; // 5 minutes

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const {
    data: items,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "items",
      { page: currentPage, searchQuery: debouncedSearchQuery },
    ],
    queryFn: ({ signal }) =>
      fetchItemsByPage({
        signal,
        page: currentPage,
        itemsPerPage,
        searchQuery: debouncedSearchQuery,
      }),
    staleTime: staleTime,
  });

  let content;

  if (isLoading) {
    content = (
      <div className="flex justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <div className="flex justify-center">
        <ErrorBlock
          title="An error occurred!"
          message={error.info?.message || "Failed to fetch items."}
        />
      </div>
    );
  }

  if (items) {
    const filteredItems = items?.items?.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalPages = Math.ceil(items?.totalCount / itemsPerPage);
    const currentItems = filteredItems?.slice(0, itemsPerPage);

    content = (
      <motion.div
        key={currentPage} // Add key to reset animation on page change
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 justify-items-center align-items-center">
          <AnimatePresence>
            {currentItems?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ItemCard item={item} rating={item.average_rating} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="my-5 flex justify-center">
          <Pager
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </motion.div>
    );
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset pagination when search query changes
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <SearchBar handleSearch={handleSearch} />
      <div className="container mx-auto px-auto flex-grow">
        <h1 className="text-3xl font-bold text-center mt-10">Home</h1>
        {content}
      </div>
    </div>
  );
}
