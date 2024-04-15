import Modal from "./UI/Modal";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../store/slices/cartSlice";
import CartItem from "./CartItem";
import { currencyFormatter } from "./util/formating";
import { checkoutActions } from "../store/slices/checkoutSlice";
import { toast } from "react-toastify";

export default function Cart() {
  const dispatch = useDispatch();

  function handleCloseCart() {
    dispatch(cartActions.hideCart());
  }

  const allItems = useSelector((state) => state.cart.items);

  function decreaseItemHandler(id) {
    dispatch(cartActions.removeItemFromCart(id));
  }

  function increaseItemHandler(id) {
    dispatch(cartActions.addItemToCart(allItems.find((i) => i.id === id)));
  }

  function handleShowCheckout() {
    dispatch(cartActions.hideCart());
    if (allItems.length < 1) {
      toast.error("Your cart is empty.");
      return;
    }
    dispatch(checkoutActions.showCheckout());
  }

  return (
    <Modal
      open={useSelector((state) => state.cart.show)}
      onClose={handleCloseCart}
      className="w-100 p-4 rounded-lg shadow-lg dark:shadow-primary-dark"
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold">Cart</h2>
        {allItems.length === 0 ? (
          <p className="my-4">Your cart is empty.</p>
        ) : (
          <>
            <ul className="my-4 flex flex-col items-between justify-center content-center">
              {allItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onDecrease={(id) => decreaseItemHandler(id)}
                  onIncrease={(id) => increaseItemHandler(id)}
                />
              ))}
            </ul>
            <p className="my-4">
              Total:{" "}
              <span className="font-bold">
                {currencyFormatter.format(
                  allItems.reduce((acc, item) => acc + item.totalPrice, 0)
                )}
              </span>
            </p>
          </>
        )}
        <div className="flex justify-center gap-5">
          <button className="btn btn-secondary" onClick={handleCloseCart}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleShowCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </Modal>
  );
}
