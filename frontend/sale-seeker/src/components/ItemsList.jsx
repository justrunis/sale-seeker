import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingIndicator from "./UI/LoadingIndicator";
import ErrorBlock from "./UI/ErrorBlock";
import {
  fetchItemsByPage,
  queryClient,
  deleteItem,
  editItem,
  addItem,
} from "./util/http";
import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "./UI/Modal";
import ItemForm from "./ItemForm";
import Pager from "./UI/Pager";
import { currencyFormatter } from "./util/formating";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { getUserRole, getToken, getUserId } from "../auth/auth";

export default function ItemsList() {
  const role = getUserRole(getToken());
  const id = getUserId(getToken());

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const itemsPerPage = 3;
  const staleTime = 1000 * 60 * 5; // 5 minutes

  const {
    data: items,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "items",
      { page: currentPage, searchQuery: debouncedSearchQuery },
    ],
    queryFn: ({ signal }) => {
      if (role === "admin") {
        return fetchItemsByPage({
          signal,
          page: currentPage,
          itemsPerPage,
          searchQuery: debouncedSearchQuery,
        });
      } else {
        navigate("/login");
      }
    },
    staleTime: staleTime,
  });

  function handleItemEdit(item, id) {
    editItemMutation({ id, item });
  }

  function handleItemAdd(item) {
    addItemMutation({ item });
  }

  function handleStartEdit(item) {
    setIsEditing(true);
    setEditedItem(item);
  }

  function handleStopEdit() {
    setIsEditing(false);
  }

  function handleItemDelete(id) {
    deleteItemMutation({ id });
  }

  function handleStartDelete(id) {
    setIsDeleting(true);
    setDeleteId(id);
  }

  function handleStopDelete() {
    setIsDeleting(false);
  }

  function handleAddItem() {
    setIsEditing(true);
    setEditedItem(null);
  }

  const {
    mutate: deleteItemMutation,
    isPending: isPendingDelete,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"],
      });
      setIsDeleting(false);
      toast.success("Item deleted successfully.");
    },
  });

  const {
    mutate: editItemMutation,
    isPending: isPendingEdit,
    isError: isEditError,
    error: editError,
  } = useMutation({
    mutationFn: editItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"],
      });
      setIsEditing(false);
      toast.success("Item edited successfully.");
    },
  });

  const {
    mutate: addItemMutation,
    isPending: isPendingAdd,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"],
      });
      setIsEditing(false);
      toast.success("Item added successfully.");
    },
  });

  let totalPages = 0;
  let currentItems = [];

  if (items) {
    totalPages = Math.ceil(items.totalCount / itemsPerPage);

    currentItems = items?.items?.slice(0, itemsPerPage);
  }

  return (
    <>
      <div className="my-2 flex gap-5">
        <button onClick={handleAddItem} className="btn btn-primary ml-5">
          Add Item
        </button>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-[50rem] w-full md:w-auto">
        {isEditing && (
          <Modal key="item-edit" onClose={handleStopEdit} open={isEditing}>
            <ItemForm
              item={editedItem}
              onClose={handleStopEdit}
              isPending={editedItem ? isPendingEdit : isPendingAdd}
              isError={editedItem ? isEditError : isAddError}
              error={editedItem ? editError : addError}
              onSubmit={(item, id) =>
                id ? handleItemEdit(item, id) : handleItemAdd(item)
              }
            />
          </Modal>
        )}

        {isDeleting && (
          <Modal key="item-delete" onClose={handleStopDelete} open={isDeleting}>
            <div className="p-10">
              <h2 className="text-2xl font-bold text-red-500">Are you sure?</h2>
              <p className="text-red-500 my-5">
                Do you really want to delete this user? This action cannot be
                undone.
              </p>
              {isDeleteError && (
                <ErrorBlock
                  title="An error occurred!"
                  message={
                    deleteError.info?.message || "Failed to delete item."
                  }
                />
              )}
              {isPendingDelete ? (
                <>
                  <div className="flex items-center justify-center justify-center">
                    <LoadingIndicator />
                  </div>
                </>
              ) : (
                <div className="flex gap-5">
                  <button
                    onClick={handleStopDelete}
                    className="text-white bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-dark dark:hover:bg-primary-darker dark:focus:ring-primary-lighter"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleItemDelete(deleteId)}
                    className="text-white bg-red-400 hover:bg-red-300 focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-dark dark:hover:bg-primary-darker dark:focus:ring-primary-lighter"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </Modal>
        )}

        {isError && (
          <div className="flex justify-center">
            <ErrorBlock
              title="An error occurred!"
              message={error.info?.message || "Failed to fetch items."}
            />
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center">
            <LoadingIndicator />
          </div>
        )}
        {!isLoading && !isError && (
          <div className="overflow-x-auto overflow-y-auto max-h-[50rem] w-full md:w-auto flex flex-col">
            <table className="table">
              <thead>
                <tr>
                  <th className="px-4 py-2">Id</th>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    key={item.id}
                  >
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.title}</td>

                    <td className="px-4 py-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-10 w-10 lg:h-20 lg:w-20"
                      />
                    </td>
                    <td className="px-4 py-2">
                      {currencyFormatter.format(item.price)}
                    </td>
                    <td className="px-4 py-2">{item.category}</td>
                    <td className="px-4 py-2 flex gap-5">
                      <Link
                        to={`/item/${item.id}`}
                        className="btn btn-secondary"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="btn btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleStartDelete(item.id)}
                        className="btn btn-accent"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <div className="my-5 self-center">
              <Pager
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
