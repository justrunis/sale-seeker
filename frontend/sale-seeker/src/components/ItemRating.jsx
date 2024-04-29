import { Rating } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchAverageRating } from "./util/http";
import { round } from "./util/formating";
import { useState } from "react";
import { useEffect } from "react";
import LoadingIndicator from "./UI/LoadingIndicator";
import ErrorBlock from "./UI/ErrorBlock";

export default function ItemRating({ id }) {
  const {
    data: averageRating,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["averageRating", { id }],
    queryFn: ({ signal }) => fetchAverageRating({ id, signal }),
  });

  const [ratingValue, setRatingValue] = useState(0);

  // Update the rating value when averageRating changes
  useEffect(() => {
    if (averageRating) {
      setRatingValue(Number(round(averageRating, 1)));
    }
  }, [averageRating]);

  return (
    <>
      <h2 className="text-l font-semibold">Rating</h2>
      {isLoading ? (
        <div className="flex justify-center">
          <LoadingIndicator />
        </div>
      ) : isError ? (
        <div className="flex justify-center">
          <ErrorBlock title="An error has occurred" message={error.message} />
        </div>
      ) : ratingValue > 0 ? (
        <>
          <div className="flex items-center mt-2.5 mb-5">
            <Rating
              name="half-rating-read"
              value={ratingValue}
              precision={0.1}
              readOnly
            />
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
              {round(averageRating, 1)}
            </span>
          </div>
        </>
      ) : (
        <div className="flex items-center mt-2.5 mb-5">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
            No rating
          </span>
        </div>
      )}
    </>
  );
}
