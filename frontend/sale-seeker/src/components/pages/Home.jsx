import Header from "../Header";
import ItemCard from "../ItemCard";
import { useSelector, useDispatch } from "react-redux";
import { itemsActions } from "../../store/slices/itemsSlice";
import { useEffect } from "react";
import { currencyFormatter } from "../util/formating";
import { useState } from "react";
import { dummyItems } from "../../tempdata";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function getAllItems() {
      dispatch(itemsActions.setItems(dummyItems));
    }
    getAllItems();
  }, []);

  const items = useSelector((state) => state.items.items);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-auto">
        <h1 className="text-3xl font-bold text-center mt-10">Home</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 justify-items-center align-items-center">
          {currentItems.map((item, index) => (
            <ItemCard key={index} item={item} />
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <nav className="inline-flex">
            <ul className="flex items-center">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index}>
                  <button
                    className={`px-3 py-1 rounded-md mx-1 ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
