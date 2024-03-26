import Header from "../Header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import Reviews from "../Reviews";

export default function Item() {
  const id = useParams().id;
  const dispatch = useDispatch();

  const item = useSelector((state) =>
    state.items.items.find((item) => item.id === Number(id))
  );

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

  const dummyReviews = [
    {
      id: 1,
      user: "John Doe",
      itemId: 1,
      rating: 4.5,
      comment: "This item exceeded my expectations!",
    },
    {
      id: 2,
      user: "Jane Smith",
      itemId: 1,
      rating: 3.8,
      comment: "Decent item, but could be better.",
    },
    {
      id: 3,
      user: "Alex Johnson",
      itemId: 1,
      rating: 4.2,
      comment: "I highly recommend this item!",
    },
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto p-10 bg-secondary my-5 rounded">
        <h1 className="text-3xl font-bold text-center mt-10 text-accent">
          {item.title}
        </h1>
        <div className="flex justify-center mt-5">
          <img
            className="w-100 h-80 object-cover rounded-lg"
            src={!item.image ? "https://via.placeholder.com/1080" : item.image}
            alt="product image"
          />
        </div>
        <div className="mt-5">
          <h2 className="text-xl font-semibold text-accent">Description</h2>
          <p className="mt-2 text-accent">{item.description}</p>
        </div>
        <div className="mt-5">
          <h2 className="text-xl font-semibold text-accent">Price</h2>
          <p className="mt-2 text-accent">{item.price}€</p>
        </div>
        <div className="mt-5">
          <h2 className="text-xl font-semibold text-accent">Rating</h2>
          <div className="flex items-center mt-2.5 mb-5 text-accent">
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
        <h2 className="text-xl font-semibold mb-5 text-accent">Reviews</h2>
        <div className="menu bg-base-100 w-100 rounded-box">
          {dummyReviews.map((review) => (
            <Reviews key={review.id} review={review} />
          ))}
        </div>
      </div>
    </>
  );
}
