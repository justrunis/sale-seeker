import Rating from "@mui/material/Rating";
import { useDispatch } from "react-redux";
import { cartActions } from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { currencyFormatter } from "./util/formating";
import { IoIosCart } from "react-icons/io";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getUserRole, getToken } from "../auth/auth";

export default function ItemCard({ item, rating }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRole = getUserRole(getToken());

  function addItemToCartHandler() {
    dispatch(cartActions.addItemToCart(item));
    toast.success(`${item.title} added to cart!`);
  }

  function handleItemPage(event) {
    event.preventDefault();
    navigate(`/item/${item.id}`);
  }

  const ratingValue = Number(rating).toFixed(2);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-base border border-base-900 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between"
      >
        <img
          className="w-full h-80 object-contain p-8"
          src={!item.image ? "https://via.placeholder.com/1080" : item.image}
          alt="product image"
        />
        <div className="px-5 pb-5">
          <h5 className="text-xl font-semibold tracking-tight text-base-900 dark:text-white">
            {item.title}
          </h5>
          {ratingValue > 0 ? (
            <div className="flex items-center mt-2.5 mb-5">
              <Rating
                name="half-rating-read"
                value={Number(ratingValue) || 0}
                precision={0.1}
                readOnly
              />
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                {ratingValue || 0}
              </span>
            </div>
          ) : (
            <div className="flex items-center mt-2.5 mb-5">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                No rating
              </span>
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="text-3xl font-bold text-base-900 dark:text-white">
              {currencyFormatter.format(item.price)}
            </span>
            <div className="flex items-center justify-center gap-3">
              <button onClick={handleItemPage} className="btn btn-secondary">
                View
              </button>
              {userRole !== undefined && (
                <button
                  onClick={addItemToCartHandler}
                  className="btn btn-primary"
                >
                  Add to cart
                  <IoIosCart className="ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
