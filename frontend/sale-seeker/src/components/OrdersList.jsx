import { useQuery } from "@tanstack/react-query";
import { fetchAllOrders } from "./util/http";
import LoadingIndicator from "./UI/LoadingIndicator";
import ErrorBlock from "./UI/ErrorBlock";
import { useState } from "react";
import { currencyFormatter, dateFormating } from "./util/formating";
import Pager from "./UI/Pager";

export default function OrdersList() {
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchAllOrders,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 5;

  let totalPages = 0;
  let currentOrders = [];

  if (orders) {
    totalPages = Math.ceil(orders.length / ordersPerPage);
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  }

  return (
    <>
      {isLoading && (
        <div className="flex justify-center">
          <LoadingIndicator />
        </div>
      )}

      {isError && (
        <div className="flex justify-center">
          <ErrorBlock
            title="An error occurred while fetching orders"
            message={error.message || "Failed to fetch orders"}
          />
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col align-center justify-content-center items-center">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer username</th>
                <th className="px-4 py-2">Order Date</th>
                <th className="px-4 py-2">Ordered Items</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{order.username}</td>
                  <td className="px-4 py-2">
                    {dateFormating.format(order.createdAt)}
                  </td>
                  <td className="px-4 py-2">
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.title} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{currencyFormatter.format(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-5">
            <Pager
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      )}
    </>
  );
}
