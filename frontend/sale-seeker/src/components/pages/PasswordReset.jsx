import Header from "../Header";
import Input from "../UI/Input";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordWithToken } from "../util/http";
import { useNavigate } from "react-router-dom";
import ErrorBlock from "../UI/ErrorBlock";
import LoadingIndicator from "../UI/LoadingIndicator";

export default function PasswordReset() {
  const cssClasses =
    "shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline my-2";

  const refreshToken = useParams().token;
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: resetPasswordWithToken,
    onSuccess: (data) => {
      toast.success("Password reset successfully.");
      navigate("/login");
    },
    onError: (error) => {
      toast.error("Failed to reset password.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    mutate({ password: passwords.password, token: refreshToken });
  };

  return (
    <div>
      <Header />
      <div className="w-full max-w-xl p-8 mx-auto">
        <h1 className="text-3xl text-center font-bold mb-4">Password Reset</h1>
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          {isLoading && <LoadingIndicator />}
          {isError && (
            <ErrorBlock
              title="An error has occurred!"
              message={error.info?.message || "Failed to reset password."}
            />
          )}
          <Input
            className={cssClasses}
            label="Password"
            type="password"
            name="password"
            value={passwords.password}
            onChange={(e) =>
              setPasswords({ ...passwords, password: e.target.value })
            }
          />
          <Input
            className={cssClasses}
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, confirmPassword: e.target.value })
            }
          />
          <div className="flex items-center justify-start gap-5 my-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              Reset Password
            </button>
            <button
              type="button"
              onClick={() =>
                setPasswords({ password: "", confirmPassword: "" })
              }
              className="btn btn-accent"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
