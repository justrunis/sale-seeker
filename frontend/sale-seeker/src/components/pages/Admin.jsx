import Header from "../Header";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchUsers, deleteUser, editUser, queryClient } from "../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import { getUserRole } from "../../auth/auth";
import { useState } from "react";
import Modal from "../UI/Modal";
import { toast } from "react-toastify";
import { Pagination } from "@mui/material";
import UserModal from "../UserModal";
import ItemsList from "../ItemsList";

export default function Admin({ token }) {
  let content;

  if (getUserRole(token) !== "admin") {
    return (
      <>
        <Header />
        <div className="flex justify-center">
          <ErrorBlock
            title="Unauthorized"
            message="You are not authorized to view this page."
          />
        </div>
      </>
    );
  }

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [editedUser, setEditedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  function handleDeleteUser() {
    deleteUserMutation({ id: deleteId });
  }

  function handleStartDelete(id) {
    setDeleteId(id);
    setIsDeleting(true);
  }

  function handleStopDelete() {
    setIsDeleting(false);
  }

  function handleEditUser(user) {
    editUserMutation({ user });
    setIsEditing(false);
  }

  function handleStartEdit(user) {
    setEditedUser(user);
    setIsEditing(true);
  }

  function handleStopEdit() {
    setIsEditing(false);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: ({ signal }) => fetchUsers({ signal }),
  });

  const {
    mutate: deleteUserMutation,
    isPending: isPendingDelete,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      setIsDeleting(false);
      toast.success("User deleted successfully.");
    },
  });

  const {
    mutate: editUserMutation,
    isPending: isPendingEdit,
    isError: isEditError,
    error: editError,
  } = useMutation({
    mutationFn: editUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      setIsEditing(false);
      toast.success("User edited successfully.");
    },
  });

  if (isLoading) {
    content = (
      <div className="flex justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <div className="flex justify-center">
        <ErrorBlock
          title="An error occurred!"
          message={error.info?.message || "Failed to fetch items."}
        />
      </div>
    );
  }

  if (data) {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    content = (
      <>
        <table className="table w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Id</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleStartEdit(user)}
                    className="btn btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleStartDelete(user.id)}
                    className="btn btn-accent"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-5">
          <Pagination
            count={totalPages}
            color="secondary"
            page={currentPage}
            onChange={(event, page) => handlePageChange(page)}
            className="flex justify-center"
            classes={{
              root: "flex justify-center bg-white p-4",
              ul: "flex gap-2",
              page: "bg-secondary text-base-900 px-4 py-2 rounded-md hover:bg-accent",
              pageActive: "bg-primary text-white px-4 py-2 rounded-md",
              icon: "bg-secondary text-base-900 px-4 py-2 rounded-full hover:bg-accent",
            }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      {isDeleting && (
        <Modal onClose={handleStopDelete} open={isDeleting}>
          <div className="p-10">
            <h2 className="text-2xl font-bold text-red-500">Are you sure?</h2>
            <p className="text-red-500 my-5">
              Do you really want to delete this user? This action cannot be
              undone.
            </p>
            {isDeleteError && (
              <ErrorBlock
                title="An error occurred!"
                message={deleteError.info?.message || "Failed to delete user."}
              />
            )}
            {isPendingDelete ? (
              <>
                <div className="flex items-center justify-center justify-center">
                  <LoadingIndicator />
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-5">
                  <button
                    onClick={handleStopDelete}
                    className="btn btn-primary"
                  >
                    Cancel
                  </button>
                  <button onClick={handleDeleteUser} className="btn btn-accent">
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
      {isEditing && (
        <UserModal
          open={isEditing}
          user={editedUser}
          onClose={handleStopEdit}
          handleEditUser={handleEditUser}
          isPending={isPendingEdit}
          isError={isEditError}
          error={editError}
        />
      )}
      <div className="container mx-auto p-10 bg-secondary h-100">
        <div className="menu bg-base-100 w-100 rounded-box py-8">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-10">Users</h2>
            {content}
          </div>
        </div>

        <div className="menu bg-base-100 w-100 rounded-box py-8 mt-5">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Items</h2>
            <ItemsList />
          </div>
        </div>
      </div>
    </>
  );
}
