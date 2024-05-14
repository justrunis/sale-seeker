import Modal from "./UI/Modal";
import Input from "./UI/Input";
import Select from "./UI/Select";
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

  const inputClasses =
    "mt-1 p-2 block w-full border border-secondary rounded-md shadow-sm focus:outline-none mb-5";

  return (
    <>
      <Modal key="edit-user" open={open} onClose={onClose}>
        <h2 className="text-2xl text-center pt-5 font-semibold dark:text-primary-dark">
          Edit user
        </h2>
        <div className="flex justify-center p-5">
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
            <form onSubmit={editUser} className={"flex flex-col w-96"}>
              <Input
                label="Username"
                type="text"
                value={currentUser.username}
                className={inputClasses}
                onChange={(e) =>
                  setUser({ ...currentUser, username: e.target.value })
                }
              />
              <Input
                label="Email"
                type="email"
                value={currentUser.email}
                className={inputClasses}
                onChange={(e) =>
                  setUser({ ...currentUser, email: e.target.value })
                }
              />
              <Select
                label="Role"
                id="role"
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "user", label: "User" },
                  { value: "seller", label: "Seller" },
                ]}
                value={currentUser.role}
                className={inputClasses}
                onChange={(e) =>
                  setUser({ ...currentUser, role: e.target.value })
                }
              />
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-accent mt-2"
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
