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
      className="overflow-x-auto overflow-y-auto max-h-[400px] w-full md:w-auto"
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
        <div className="overflow-x-auto overflow-y-auto max-h-[400px] w-full md:w-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Order Date</th>
                <th className="px-4 py-2">Order Status</th>
                <th className="px-4 py-2">Total Price</th>
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
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
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
