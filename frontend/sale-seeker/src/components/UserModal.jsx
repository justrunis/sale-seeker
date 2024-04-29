import Modal from "./UI/Modal";
import Input from "./UI/Input";
import { useState } from "react";
import LoadingIndicator from "./UI/LoadingIndicator";
import ErrorBlock from "./UI/ErrorBlock";

export default function UserModal({
  open,
  user,
  onClose,
  handleEditUser,
  isPending,
  isError,
  error,
}) {
  const [currentUser, setUser] = useState({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  });

  function editUser(event) {
    event.preventDefault();
    handleEditUser(currentUser);
  }

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <h2 className="text-2xl text-center pt-5 font-semibold text-primary dark:text-primary-dark">
          Edit user
        </h2>
        <div className="flex gap-5 p-5">
          {isError && (
            <div className="flex items-center justify-center">
              <ErrorBlock
                title="An error occurred!"
                message={error?.info?.message || "Failed to edit user."}
              />
            </div>
          )}
          {isPending ? (
            <div className="flex items-center justify-center">
              <LoadingIndicator />
            </div>
          ) : (
            <form onSubmit={editUser} className={"flex flex-col gap-5 w-96"}>
              <Input
                label="Username"
                type="text"
                value={currentUser.username}
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) =>
                  setUser({ ...currentUser, username: e.target.value })
                }
              />
              <Input
                label="Email"
                type="email"
                value={currentUser.email}
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) =>
                  setUser({ ...currentUser, email: e.target.value })
                }
              />
              <select
                label="Role"
                value={currentUser.role}
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) =>
                  setUser({ ...currentUser, role: e.target.value })
                }
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-accent"
              >
                Close
              </button>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}
