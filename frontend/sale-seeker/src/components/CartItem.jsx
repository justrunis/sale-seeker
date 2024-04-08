import { currencyFormatter } from "./util/formating.js";
export default function CartItem({ item, onIncrease, onDecrease }) {
  console.log(item);
  return (
    <li className="cart-item flex items-center justify-between">
      <span className="flex-grow">{item.title}</span>
      <span className="mx-5">{currencyFormatter.format(item.totalPrice)}</span>
      <p className="cart-item-actions flex items-center">
        <button onClick={() => onDecrease(item.id)} className="mr-1">
          -
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => onIncrease(item.id)} className="ml-1">
          +
        </button>
      </p>
    </li>
  );
}
