import { useQuery } from "@tanstack/react-query";
import { fetchUserOrders } from "./util/http";
import LoadingIndicator from "./UI/LoadingIndicator";
import ErrorBlock from "./UI/ErrorBlock";
import {
  dateFormating,
  currencyFormatter,
  makeFirstLetterUpperCase,
} from "./util/formating";
import { motion } from "framer-motion";

export default function UserOrders({ userId }) {
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders", { userId }],
    queryFn: ({ signal }) => fetchUserOrders({ signal, userId }),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="menu bg-base-100 w-100 rounded-b-box py-8"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">My Orders</h2>
      {isError && (
        <div className="flex justify-center">
          <ErrorBlock
            title="An error occurred"
            message={
              error.message || "An error occurred while fetching the orders."
            }
          />
        </div>
      )}
      {isLoading && (
        <div className="mt-8 flex justify-center">
          <LoadingIndicator />
        </div>
      )}
      {!isError && !isLoading && (
        <div className="flex flex-col align-center justify-content-center items-center">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Order date</th>
                <th className="px-4 py-2">Order status</th>
                <th className="px-4 py-2">Total price</th>
                <th className="px-4 py-2">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    key={order.id}
                  >
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">
                      {dateFormating.format(order.date)}
                    </td>
                    <td className="px-4 py-2">
                      {makeFirstLetterUpperCase(order.status)}
                    </td>
                    <td className="px-4 py-2">
                      {currencyFormatter.format(order.total)}
                    </td>
                    <td className="px-4 py-2">
                      <ul>
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.title} - {item.quantity}x{" "}
                            {currencyFormatter.format(item.price)}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
