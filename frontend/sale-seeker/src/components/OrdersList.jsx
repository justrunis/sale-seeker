import { useQuery } from "@tanstack/react-query";
import { fetchAllOrders } from "./util/http";
import LoadingIndicator from "./UI/LoadingIndicator";
import ErrorBlock from "./UI/ErrorBlock";
import { useState } from "react";
import { dateFormating } from "./util/formating";

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
          <ErrorBlock error={error} />
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col align-center justify-content-center items-center">
          {console.log(orders)}
          <table className="table w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer username</th>
                <th className="px-4 py-2">Order Date</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{order.customerName}</td>
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
                  <td>{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
