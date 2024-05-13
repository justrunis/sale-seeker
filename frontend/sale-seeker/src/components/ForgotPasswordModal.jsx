import Modal from "./UI/Modal";
import Input from "./UI/Input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "./util/http";
import { toast } from "react-toastify";
import ErrorBlock from "./UI/ErrorBlock";
import LoadingIndicator from "./UI/LoadingIndicator";

export default function ForgotPassword({ showModal, setShowModal }) {
  const cssClasses =
    "shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline my-2";

  const [email, setEmail] = useState("");

  const [isSent, setIsSent] = useState(false);

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success("Password reset email sent.");
      setIsSent(true);
    },
    onError: (error) => {
      toast.error("Failed to send password reset email.");
    },
  });

  const handleSubmit = async () => {
    if (!email) {
      console.error("Email is required.");
      return;
    }
    mutate({ email });
  };

  return (
    <Modal
      key="forgot-password"
      open={showModal}
      onClose={() => setShowModal(false)}
    >
      {isLoading && <LoadingIndicator />}
      {isError && (
        <ErrorBlock
          title="An error has occurred!"
          message={
            error.info?.message || "Failed to send password reset email."
          }
        />
      )}
      <h1 className="text-2xl text-center pt-5 font-semibold">
        Forgot Password
      </h1>
      {isSent && (
        <div className="p-5">
          <p>
            If an account with the email address you provided exists, you will
            receive an email with instructions to reset your password.
          </p>
          <button
            className="btn btn-primary mt-2"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      )}
      {!isSent && !isLoading && (
        <form className="px-8 pt-6 pb-8 mb-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className={cssClasses}
          />
          <div className="flex items-center justify-center gap-5 p-5">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={isLoading}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-accent"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
