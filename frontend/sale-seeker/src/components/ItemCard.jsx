import Rating from "@mui/material/Rating";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { currencyFormatter } from "./util/formating";
import { IoIosCart } from "react-icons/io";

export default function ItemCard({ item }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function addItemToCartHandler() {
    dispatch(cartActions.addItemToCart(item));
  }

  function handleItemPage(event) {
    event.preventDefault();
    navigate(`/item/${item.id}`);
  }

  return (
    <>
      <div className="w-full max-w-sm bg-base border border-base-900 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
        <img
          className="w-full h-80 object-contain p-8"
          src={!item.image ? "https://via.placeholder.com/1080" : item.image}
          alt="product image"
        />
        <div className="px-5 pb-5">
          <h5 className="text-xl font-semibold tracking-tight text-base-900 dark:text-white">
            {item.title}
          </h5>
          <div className="flex items-center mt-2.5 mb-5">
            <Rating
              name="half-rating-read"
              defaultValue={item.rating}
              precision={0.1}
              readOnly
            />
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
              {item.rating}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-3xl font-bold text-base-900 dark:text-white">
              {currencyFormatter.format(item.price)}
            </span>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleItemPage}
                className="text-white bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-dark dark:hover:bg-primary-darker dark:focus:ring-primary-lighter"
              >
                View
              </button>
              <button
                onClick={addItemToCartHandler}
                className="text-white bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-dark dark:hover:bg-primary-darker dark:focus:ring-primary-lighter flex items-center"
              >
                Add to cart
                <IoIosCart className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
