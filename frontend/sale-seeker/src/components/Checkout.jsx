import Modal from "./UI/Modal";
import checkoutSlice from "../store/slices/checkoutSlice";
import { checkoutActions } from "../store/slices/checkoutSlice";
import { useSelector } from "react-redux";
import Input from "./UI/Input";
import { useDispatch } from "react-redux";

export default function Checkout() {
  const dispatch = useDispatch();
  function handleCloseCheckout() {
    dispatch(checkoutActions.hideCheckout());
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <Modal
      open={useSelector((state) => state.checkout.show)}
      onClose={handleCloseCheckout}
      className="w-100 p-4 rounded-lg shadow-lg dark:shadow-primary-dark"
    >
      <h2 className="text-2xl font-bold">Checkout</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Name" id="name" />
        <Input label="Address" id="address" />
        <Input label="City" id="city" />
        <Input label="Zip" id="zip" />
        <Input label="Country" id="country" />
        <Input label="Email" id="email" />
        <Input label="Phone" id="phone" />
        <Input label="Credit Card" id="creditCard" />
        <Input label="CVV" id="cvv" />
        <Input label="Expiration Date" id="expirationDate" />
        <div className="flex items-center gap-5">
          <button
            className="text-white bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-dark dark:hover:bg-primary-darker dark:focus:ring-primary-lighter flex items-center"
            type="submit"
          >
            Submit
          </button>
          <button
            type="button"
            className="text-white bg-red-500 hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-dark dark:hover:bg-primary-darker dark:focus:ring-primary-lighter flex items-center"
            onClick={handleCloseCheckout}
          >
            Close
          </button>
        </div>
      </form>
    </Modal>
  );
}
