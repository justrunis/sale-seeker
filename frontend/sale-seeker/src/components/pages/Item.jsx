import React, { useState } from "react";
import Header from "../Header";
import { useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Review from "../Review";
import { currencyFormatter } from "../util/formating";
import { IoIosCart } from "react-icons/io";
import { dummyReviews } from "../../tempdata";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/slices/cartSlice";

import { fetchItem, fetchReviews } from "../util/http";
import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import Pager from "../UI/Pager";
import Modal from "../UI/Modal";
import ReviewModal from "../ReviewModal";

export default function Item() {
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const {
    data: item,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["item", { id }],
    queryFn: ({ signal }) => fetchItem({ id, signal }),
  });

  const {
    data: reviews,
    isLoading: reviewsLoading,
    isError: isReviewError,
    error: reviewsError,
  } = useQuery({
    queryKey: ["reviews", { id }],
    queryFn: ({ signal }) => fetchReviews({ id, signal }),
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
        <ErrorBlock error={error} />
      </div>
    );
  }

  if (item) {
    content = (
      <div className="flex flex-col md:flex-row justify-around content-center">
        <div className="justify-self-center self-center">
          <img
            className="w-100 h-80 object-cover rounded-lg bg-base-100"
            src={!item.image ? "https://via.placeholder.com/1080" : item.image}
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
                defaultValue={Number(item.rating)}
                precision={0.1}
                readOnly
              />
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                {Number(item.rating)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 bg-base-100 p-10 h-25 rounded justify-self-center self-center shadow-2xl">
          <span className="text-3xl font-bold dark:text-white">
            {currencyFormatter.format(item.price)}
          </span>
          <button onClick={addItemToCartHandler} className="btn btn-primary">
            Add to cart
            <IoIosCart className="inline-block ml-2" />
          </button>
        </div>
      </div>
    );
  }

  function addItemToCartHandler() {
    dispatch(cartActions.addItemToCart(item));
  }

  function handleReviewModal() {
    console.log("Review modal");
    setIsReviewModalOpen(true);
  }

  function handleStopReviewModal() {
    setIsReviewModalOpen(false);
  }

  // Calculate the index of the first review on the current page
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  let currentReviews = [];

  if (reviews) {
    currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  }

  return (
    <>
      <Header />
      <ReviewModal
        close={handleStopReviewModal}
        isOpen={isReviewModalOpen}
        item={item || ""}
      />
      <div className="container mx-auto p-10 bg-secondary h-100">
        {content}
        <h2 className="text-xl font-semibold mb-5">Reviews</h2>

        <div className="menu bg-base-100 w-100 rounded-box py-8">
          <div className="mb-5">
            <button onClick={handleReviewModal} className="btn btn-primary">
              Write a review
            </button>
          </div>
          {reviewsLoading && (
            <div className="flex justify-center">
              <LoadingIndicator />
            </div>
          )}
          {isReviewError ? (
            <div className="flex justify-center">
              <ErrorBlock error={reviewsError} />
            </div>
          ) : (
            <>
              {reviews && reviews.length === 0 ? (
                <div className="flex justify-center items-center flex-col">
                  <h2 className="text-xl font-bold mb-5">No reviews found.</h2>
                  <p>
                    Be the first to write a review for this item. Click the
                    button above.
                  </p>
                </div>
              ) : (
                <>
                  {" "}
                  {currentReviews.map((review) => (
                    <Review key={review.id} review={review} />
                  ))}
                  <div className="mt-5 flex justify-center">
                    <Pager
                      totalPages={Math.ceil(reviews?.length / reviewsPerPage)}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
