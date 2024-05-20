import Header from "../Header";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchUsers,
  fetchUsersByPage,
  deleteUser,
  editUser,
  queryClient,
} from "../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import { getUserRole } from "../../auth/auth";
import { useState } from "react";
import Modal from "../UI/Modal";
import { toast } from "react-toastify";
import UserModal from "../UserModal";
import ItemsList from "../ItemsList";
import { useSelector } from "react-redux";
import Pager from "../UI/Pager";
import { makeFirstLetterUpperCase } from "../util/formating";
import OrdersList from "../OrdersList";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  let content;
  const token = useSelector((state) => state.login.user).token;
  const navigate = useNavigate();

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

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const usersPerPage = 3;
  const staleTime = 1000 * 60 * 5; // 5 minutes

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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", { page: currentPage }],
    queryFn: ({ signal }) => {
      if (getUserRole(token) === "admin") {
        console.log("fetching users");
        return fetchUsersByPage({ signal, page: currentPage, usersPerPage });
      } else {
        navigate("/login");
      }
    },
    staleTime: staleTime,
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
          message={error.info?.message || "Failed to fetch users."}
        />
      </div>
    );
  }

  if (data) {
    const totalPages = Math.ceil(data.totalCount / usersPerPage);

    const currentItems = data?.users?.slice(0, usersPerPage);

    content = (
      <>
        <div className="overflow-x-auto overflow-y-auto max-h-[400px] w-full md:w-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="px-4 py-2">Id</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Created at</th>
                <th className="px-4 py-2">Refresh token</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  key={user.id}
                >
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    {new Date(user.created_at).toDateString()}
                  </td>
                  <td className="px-4 py-2">{user.reset_token}</td>
                  <td className="px-4 py-2">
                    {makeFirstLetterUpperCase(user.role)}
                  </td>
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
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex justify-center">
          <Pager
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {isDeleting && (
        <Modal key="delete-user" onClose={handleStopDelete} open={isDeleting}>
          <div className="p-10">
            <h2 className="text-2xl font-bold text-red-500">Are you sure?</h2>
            <p className="text-red-500 my-5">
              Do you really want to delete this user? All users orders, items
              and reviews will be deleted as well.
            </p>
            <p className="text-red-500 my-5">This action cannot be undone.</p>
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
      <div className="container mx-auto p-10 bg-secondary h-100 flex-grow">
        <h1 className="text-3xl font-bold uppercase mb-10 text-center">
          Admin panel
        </h1>

        <Tabs onSelect={(index) => setSelectedTabIndex(index)}>
          <TabList className="flex bg-base-100 p-2 rounded-t-md gap-5">
            <Tab
              className={
                selectedTabIndex === 0 ? "btn btn-primary" : "btn btn-secondary"
              }
            >
              Users
            </Tab>
            <Tab
              className={
                selectedTabIndex === 1 ? "btn btn-primary" : "btn btn-secondary"
              }
            >
              Items
            </Tab>
            <Tab
              className={
                selectedTabIndex === 2 ? "btn btn-primary" : "btn btn-secondary"
              }
            >
              Orders
            </Tab>
          </TabList>
          <hr />

          <TabPanel>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="menu bg-base-100 w-100 rounded-b-box py-8"
            >
              <h2 className="text-xl font-semibold mb-10">Users</h2>
              {content}
            </motion.div>
          </TabPanel>
          <TabPanel>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="menu bg-base-100 w-100 rounded-b-box py-8"
            >
              <h2 className="text-xl font-semibold ml-5">Items</h2>
              <ItemsList />
            </motion.div>
          </TabPanel>
          <TabPanel>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="menu bg-base-100 w-full rounded-b-box py-8"
            >
              <h2 className="text-xl font-semibold">Orders</h2>
              <OrdersList />
            </motion.div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
