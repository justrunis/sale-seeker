import React, { useState } from "react";
import Header from "../Header";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import Reviews from "../Reviews";
import { currencyFormatter } from "../util/formating";
import { IoIosCart } from "react-icons/io";
import { dummyReviews } from "../../tempdata";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/slices/cartSlice";
import { dummyItems } from "../../tempdata";
import { itemsActions } from "../../store/slices/itemsSlice";
import Pagination from "@mui/material/Pagination";

export default function Item() {
  const id = useParams().id;
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  const item = useSelector((state) =>
    state.items.items.find((item) => item.id === Number(id))
  );

  // dispatch dummy items for now
  if (!item) {
    dispatch(itemsActions.setItems(dummyItems));
  }

  if (!item) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-auto">
          <h1 className="text-3xl text-red-500 font-bold text-center mt-10">
            Item with id {id} not found.
          </h1>
        </div>
      </>
    );
  }

  function addItemToCartHandler() {
    dispatch(cartActions.addItemToCart(item));
  }

  // Calculate the index of the first review on the current page
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = dummyReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  return (
    <>
      <Header />
      <div className="container mx-auto p-10 bg-secondary h-100">
        <div className="flex flex-col md:flex-row justify-around content-center">
          <div className="justify-self-center self-center">
            <img
              className="w-100 h-80 object-cover rounded-lg bg-base-100"
              src={
                !item.image ? "https://via.placeholder.com/1080" : item.image
              }
              alt="product image"
            />
          </div>
          <div className="flex flex-col max-w-96">
            <div className="mt-5">
              <h1 className="text-3xl font-bold mt-10">{item.title}</h1>
            </div>
            <div className="mt-5">
              <h2 className="text-l font-semibold">Description</h2>
              <p className="mt-2 text-sm">{item.description}</p>
            </div>
            <div className="mt-5">
              <h2 className="text-l font-semibold">Item id</h2>
              <p className="mt-2 text-sm">{item.id}</p>
            </div>
            <div className="mt-5">
              <h2 className="text-l font-semibold">Category</h2>
              <p className="mt-2 text-sm">{item.category}</p>
            </div>
            <div className="mt-5">
              <h2 className="text-l font-semibold">Rating</h2>
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
            </div>
          </div>
          <div className="flex items-center justify-between gap-5 bg-base-100 p-10 h-25 rounded justify-self-center self-center shadow-2xl">
            <span className="text-3xl font-bold dark:text-white">
              {currencyFormatter.format(item.price)}
            </span>
            <button
              onClick={addItemToCartHandler}
              className="text-white bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-dark dark:hover:bg-primary-darker dark:focus:ring-primary-lighter"
            >
              Add to cart
              <IoIosCart className="inline-block ml-2" />
            </button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-5">Reviews</h2>

        <div className="menu bg-base-100 w-100 rounded-box py-8">
          {currentReviews.map((review) => (
            <Reviews key={review.id} review={review} />
          ))}
          <div className="mt-5">
            <Pagination
              count={Math.ceil(dummyReviews.length / reviewsPerPage)}
              color="secondary"
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              className="flex justify-center"
              classes={{
                root: "flex justify-center",
                ul: "flex gap-2",
                page: "bg-secondary text-base-900 px-4 py-2 rounded-md hover:bg-accent",
                pageActive: "bg-primary text-white px-4 py-2 rounded-md",
                icon: "bg-secondary text-base-900 px-4 py-2 rounded-full hover:bg-accent",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
