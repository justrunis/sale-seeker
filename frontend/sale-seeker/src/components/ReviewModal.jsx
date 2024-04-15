import Modal from "./UI/Modal";
import Input from "./UI/Input";
import { Rating } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { addReview, queryClient } from "./util/http";
import { getToken, getUserId } from "../auth/auth";
import { toast } from "react-toastify";

export default function ReviewModal({ close, isOpen, item }) {
  const inputClasses =
    "mt-1 p-2 block w-full border border-secondary rounded-md shadow-sm focus:outline-none mb-5";

  const id = item.id;
  const userId = getUserId(getToken());

  const {
    mutate: mutateReview,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      queryClient.invalidateQueries("reviews");
      toast.success("Review added successfully.");
      close();
    },
  });

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const item = Object.fromEntries(fd.entries());

    if (!item.comment) {
      toast.error("Please enter a comment.");
      return;
    }

    if (!item.rating) {
      toast.error("Please enter a rating.");
      return;
    }

    // add the id to the item object
    item.id = id;

    mutateReview({ item, userId });
  }

  return (
    <>
      <Modal onClose={close} open={isOpen}>
        <form onSubmit={handleSubmit} className="p-10">
          <h1 className="text-center text-3xl font-bold my-2 break-words">
            Review for {item.title}
          </h1>

          <Input
            label="Comment"
            type="text"
            required
            name="comment"
            isTextArea={true}
            className={inputClasses}
          />
          <Rating name="rating" defaultValue={0} precision={0.5} />
          <div className="flex justify-end gap-5">
            <button className="btn btn-primary">Submit</button>
            <button onClick={close} className="btn btn-accent">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
