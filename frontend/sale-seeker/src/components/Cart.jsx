import Modal from "./UI/Modal";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../store/slices/cartSlice";
import CartItem from "./CartItem";

export default function Cart() {
  const dispatch = useDispatch();

  function handleCloseCart() {
    dispatch(cartActions.hideCart());
  }

  const allItems = useSelector((state) => state.cart.items);

  function decreaseItemHandler(id) {
    console.log("Decreasing item with id:", id);
    dispatch(cartActions.removeItemFromCart(id));
  }

  function increaseItemHandler(id) {
    console.log("Increasing item with id:", id);
    dispatch(cartActions.addItemToCart(allItems.find((i) => i.id === id)));
  }

  return (
    <Modal
      open={useSelector((state) => state.cart.show)}
      onClose={useSelector((state) =>
        state.cart.show ? handleCloseCart : null
      )}
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold">Cart</h2>
        {allItems.length === 0 ? (
          <p className="mt-4">Your cart is empty.</p>
        ) : (
          <ul className="mt-4">
            {allItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onDecrease={(id) => decreaseItemHandler(id)}
                onIncrease={(id) => increaseItemHandler(id)}
              />
            ))}
          </ul>
        )}
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCloseCart}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
