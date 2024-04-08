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

  const itemsPerPage = 3;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const buttonClass = `px-3 py-1 rounded-md mx-1 text-white focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-4 py-3 text-center dark:bg-primary-dark dark:hover:bg-primary-darker dark:focus:ring-primary-lighter`;

  const activeButtonClass = `${buttonClass} bg-secondary hover:bg-accent`;
  const inactiveButtonClass = `${buttonClass} bg-primary hover:bg-accent`;

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
        <div className="flex justify-center my-4">
          <nav className="inline-flex">
            <ul className="flex items-center">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index}>
                  <button
                    className={
                      currentPage === index + 1
                        ? activeButtonClass
                        : inactiveButtonClass
                    }
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
