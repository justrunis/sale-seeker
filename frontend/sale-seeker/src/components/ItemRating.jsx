import { Rating } from "@mui/material";
import { round } from "./util/formating";

export default function ItemRating({ id, rating: averageRating }) {
  return (
    <>
      <h2 className="text-l font-semibold">Rating</h2>
      <>
        <div className="flex items-center mt-2.5 mb-5">
          <Rating
            name="half-rating-read"
            value={averageRating}
            precision={0.1}
            readOnly
          />
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
            {round(averageRating, 1)}
          </span>
        </div>
      </>
      <div className="flex items-center mt-2.5 mb-5">
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
          No rating
        </span>
      </div>
    </>
  );
}
