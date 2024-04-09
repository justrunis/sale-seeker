import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "./UI/LoadingIndicator";
import ErrorBlock from "./UI/ErrorBlock";
import { fetchItems } from "./util/http";
import { Pagination } from "@mui/material";
import { useState } from "react";

export default function ItemsList() {
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

  const itemsPerPage = 5;

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  let totalPages = 0;
  let currentItems = [];

  if (items) {
    totalPages = Math.ceil(items.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  }

  return (
    <div className="menu bg-base-100 w-100 rounded-box py-8">
      {isError && (
        <div className="flex justify-center">
          <ErrorBlock
            title="An error occurred!"
            message={error.info?.message || "Failed to fetch items."}
          />
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center">
          <LoadingIndicator />
        </div>
      ) : (
        <div className="flex flex-col align-center justify-content-center items-center">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Id</th>
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.title}</td>

                  <td className="px-4 py-2">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-20 w-20"
                    />
                  </td>
                  <td className="px-4 py-2">{item.price}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2 flex gap-5">
                    <button className="text-white bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-dark dark:hover:bg-primary-darker dark:focus:ring-primary-lighter">
                      Edit
                    </button>
                    <button className="text-white bg-red-400 hover:bg-red-300 focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-dark dark:hover:bg-primary-darker dark:focus:ring-primary-lighter">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-5">
            <Pagination
              count={totalPages}
              color="secondary"
              page={currentPage}
              onChange={(event, page) => handlePageChange(page)}
              className="flex justify-center"
              classes={{
                root: "flex justify-center bg-white p-4",
                ul: "flex gap-2",
                page: "bg-secondary text-base-900 px-4 py-2 rounded-md hover:bg-accent",
                pageActive: "bg-primary text-white px-4 py-2 rounded-md",
                icon: "bg-secondary text-base-900 px-4 py-2 rounded-full hover:bg-accent",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
