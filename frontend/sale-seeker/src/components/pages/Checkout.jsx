import Header from "../Header";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CheckoutForm from "../CheckoutForm";

export default function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);

  const finalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <>
      <Header />
      <div className="container mx-auto p-10 bg-secondary h-100">
        <h1 className="text-2xl font-bold my-5 text-center">Checkout</h1>
        <div className="menu bg-base-100 w-100 rounded-box py-8">
          <div className="flex flex-col">
            {cartItems.length === 0 ? (
              <div className="flex justify-center items-center flex-col w-full h-100">
                <h2 className="text-xl font-bold text-center">
                  Your cart is empty.
                </h2>
                <Link to="/home" className="btn btn-primary mt-5">
                  Go to items
                </Link>
              </div>
            ) : (
              <>
                <div className="flex justify-start m-5 mt-0">
                  <Link to="/home" className="btn btn-primary mt-5">
                    Continue shopping
                  </Link>
                </div>
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="py-2">Title</th>
                      <th className="py-2">Quantity</th>
                      <th className="py-2">Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2">{item.title}</td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">{item.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-5 mr-5">
                  <p className="text-xl font-bold">Total: {finalPrice}</p>
                </div>
                <CheckoutForm cartItems={cartItems} totalPrice={finalPrice} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
