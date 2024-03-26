import { currencyFormatter } from "./util/formating.js";
export default function CartItem({ item, onIncrease, onDecrease }) {
  return (
    <li className="cart-item">
      <p>
        {item.title}
        <span className="mx-5">
          {currencyFormatter.format(item.totalPrice)}
        </span>
      </p>
      <p></p>
      <p className="cart-item-actions">
        <button onClick={() => onDecrease(item.id)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => onIncrease(item.id)}>+</button>
      </p>
    </li>
  );
}
