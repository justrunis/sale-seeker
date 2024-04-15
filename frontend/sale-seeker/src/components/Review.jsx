import Rating from "@mui/material/Rating";
export default function Review({ review }) {
  console.log(review);
  return (
    <>
      <div key={review.id} className="mt-5 border-b pb-5">
        <div className="flex items-center">
          <Rating
            name="half-rating-read"
            defaultValue={review.rating}
            precision={0.1}
            readOnly
          />
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
            {review.rating}
          </span>
        </div>
        <p className="mt-2 text-accent font-semibold">{review.user}</p>
        <p className="mt-2 text-accent">{review.description}</p>
      </div>
    </>
  );
}
