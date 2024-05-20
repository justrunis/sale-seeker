import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchAllOrders,
  fetchOrdersByPage,
  deleteOrder,
  changeOrderStatus,
  queryClient,
} from "./util/http";
import LoadingIndicator from "./UI/LoadingIndicator";
import ErrorBlock from "./UI/ErrorBlock";
import { useState } from "react";
import { currencyFormatter, dateFormating } from "./util/formating";
import Pager from "./UI/Pager";
import Modal from "./UI/Modal";
import { toast } from "react-toastify";
import Select from "./UI/Select";
import { makeFirstLetterUpperCase } from "./util/formating";
import { motion } from "framer-motion";
import { getUserRole, getToken } from "../auth/auth";
import { useNavigate } from "react-router-dom";

export default function OrdersList() {
  const role = getUserRole(getToken());

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [isEditingOrderStatus, setIsEditingOrderStatus] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);

  const [isDeletingOrder, setIsDeletingOrder] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const ordersPerPage = 3;
  const staleTime = 1000 * 60 * 5; // 5 minutes

  let totalPages = 0;
  let currentOrders = [];

  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "orders",
      { page: currentPage, searchQuery: debouncedSearchQuery },
    ],
    queryFn: ({ signal }) => {
      if (role === "admin") {
        return fetchOrdersByPage({
          signal,
          page: currentPage,
          ordersPerPage,
          searchQuery: debouncedSearchQuery,
        });
      } else {
        navigate("/login");
      }
    },
    staleTime: staleTime,
  });

  const {
    mutate: deleteOrderMutation,
    isPending: isPendingDelete,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      setIsDeletingOrder(false);
      setDeleteId(null);
      toast.success("Order deleted successfully.");
    },
  });

  const {
    mutate: changeOrderStatusMutation,
    isPending: isPendingChange,
    isError: isChangeError,
    error: changeError,
  } = useMutation({
    mutationFn: changeOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      toast.success("Order status changed successfully.");
      setIsEditingOrderStatus(false);
    },
  });

  // DELETING
  function handleStartDelete(id) {
    setDeleteId(id);
    setIsDeletingOrder(true);
  }

  function handleStopDelete() {
    setIsDeletingOrder(false);
  }

  function handleOrderDelete() {
    deleteOrderMutation({ id: deleteId });
  }

  // EDITING
  function handleStartOrderStatusChange(order) {
    setIsEditingOrderStatus(true);
    setEditedOrder(order);
  }

  function handleStopOrderStatusChange() {
    setIsEditingOrderStatus(false);
  }

  function handleOrderStatusChange(order) {
    changeOrderStatusMutation({ id: order.id, status: order.status });
  }

  if (orders) {
    totalPages = Math.ceil(orders.totalCount / ordersPerPage);

    currentOrders = orders?.orders?.slice(0, ordersPerPage);
    console.log(orders);
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
            message={error.info?.message || "Failed to fetch orders"}
          />
        </div>
      )}

      {isDeletingOrder && (
        <Modal
          key="order-delete"
          onClose={handleStopDelete}
          open={isDeletingOrder}
        >
          <div className="p-10">
            <h2 className="text-2xl font-bold text-red-500">Are you sure?</h2>
            <p className="text-red-500 my-5">
              Do you really want to delete this order? This action cannot be
              undone.
            </p>
            {isDeleteError && (
              <ErrorBlock
                title="An error occurred!"
                message={
                  deleteError?.info?.message || "Failed to delete order."
                }
              />
            )}
            {isPendingDelete ? (
              <div className="flex items-center justify-center justify-center">
                <LoadingIndicator />
              </div>
            ) : (
              <div className="flex gap-5">
                <button className="btn btn-primary" onClick={handleOrderDelete}>
                  Yes
                </button>
                <button className="btn btn-accent" onClick={handleStopDelete}>
                  No
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {isEditingOrderStatus && (
        <Modal
          key="order-status-edit"
          onClose={handleStopOrderStatusChange}
          open={isEditingOrderStatus}
        >
          <h2 className="text-2xl font-bold text-center">
            Change order status
          </h2>
          <div className="flex flex-col justify-center p-5">
            <div className="flex justify-center">
              <div className="flex flex-col w-96 gap-2">
                <Select
                  label="Status"
                  id="status"
                  error={isChangeError}
                  options={[
                    { value: "pending", label: "Pending" },
                    { value: "processing", label: "Processing" },
                    { value: "confirmed", label: "Confirmed" },
                    { value: "shipped", label: "Shipped" },
                    { value: "on-hold", label: "On hold" },
                    { value: "cancelled", label: "Cancelled" },
                    { value: "returned", label: "Returned" },
                    { value: "refunded", label: "Refunded" },
                    { value: "completed", label: "Completed" },
                  ]}
                  value={editedOrder.status}
                  onChange={(e) =>
                    setEditedOrder({ ...editedOrder, status: e.target.value })
                  }
                  className="mt-1 p-2 block w-96 border border-secondary rounded-md shadow-sm focus:outline-none"
                />
              </div>
            </div>
            {isChangeError && (
              <ErrorBlock
                title="An error occurred!"
                message={
                  changeError?.info?.message || "Failed to change order status."
                }
              />
            )}
            {isPendingChange ? (
              <div className="flex items-center justify-center justify-center">
                <LoadingIndicator />
              </div>
            ) : (
              <div className="flex justify-center mt-2">
                <div className="flex flex-col w-96 gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleOrderStatusChange(editedOrder)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-accent"
                    onClick={handleStopOrderStatusChange}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {!isLoading && !isError && (
        <div className="overflow-x-auto overflow-y-auto max-h-[400px] w-full md:w-auto flex flex-col">
          <table className="table">
            <thead>
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer username</th>
                <th className="px-4 py-2">Order Date</th>
                <th className="px-4 py-2">Ordered Items</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders?.map((order, index) => (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  key={order.id}
                >
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
                  <td>{makeFirstLetterUpperCase(order.status)}</td>
                  <td className="flex justify-center items-center">
                    <button
                      onClick={() => handleStartOrderStatusChange(order)}
                      className="btn btn-primary mr-2"
                    >
                      Change status
                    </button>
                    <button
                      onClick={() => handleStartDelete(order.id)}
                      className="btn btn-accent"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <div className="mt-5 self-center">
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
