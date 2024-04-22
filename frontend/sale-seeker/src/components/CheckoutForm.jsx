import Cards from "react-credit-cards-2";
import { useState } from "react";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { sendPaymentInformation } from "./util/http";
import LoadingIndicator from "./UI/LoadingIndicator";
import ErrorBlock from "./UI/ErrorBlock";
import { motion } from "framer-motion";

export default function CheckoutForm({ cartItems, totalPrice }) {
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const {
    mutate: sendPaymentInformationMutation,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
    error: paymentError,
  } = useMutation({
    mutationFn: sendPaymentInformation,
    onSuccess: (data) => {
      toast.success("Payment successful!", data);
      setIsSuccess(true);
    },
    onError: (error) => {
      toast.error("Payment failed. Please try again. ", error);
    },
  });

  const cssClasses = "border-2 border-secondary rounded-lg p-2 w-full";

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;

    if (name === "number") {
      // Remove existing spaces and limit to 16 characters
      const formattedValue = value.replace(/\s/g, "").slice(0, 16);
      // Add space after every 4 characters, except when input length is already 16
      const formattedWithSpaces =
        formattedValue.length > 4
          ? formattedValue.replace(/(.{4})(?!$)/g, "$1 ") // Add space after every 4 characters, except at the end
          : formattedValue;

      setState((prev) => ({ ...prev, [name]: formattedWithSpaces }));
    } else if (name === "expiry") {
      // Format expiry as yy/dd
      const formattedExpiry = value
        .replace(/\D/g, "") // Remove non-digit characters
        .slice(0, 4); // Limit to 4 characters (yydd)

      // Insert '/' after the second character (if exists) to format as yy/dd
      const formattedExpiryWithSlash =
        formattedExpiry.length > 2
          ? `${formattedExpiry.slice(0, 2)}/${formattedExpiry.slice(2)}`
          : formattedExpiry;

      setState((prev) => ({ ...prev, [name]: formattedExpiryWithSlash }));
    } else if (name === "cvc") {
      // Limit cvc to max 3 numbers
      const formattedCVC = value.replace(/\D/g, "").slice(0, 3);

      setState((prev) => ({ ...prev, [name]: formattedCVC }));
    } else {
      setState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  const handlePaymentSubmit = (evt) => {
    evt.preventDefault();

    const fd = new FormData(evt.target);
    const paymentData = Object.fromEntries(fd.entries());

    let hasError = false;

    // validate payment inputs
    if (
      paymentData.number.length < 19 ||
      !/^\d{4} \d{4} \d{4} \d{4}$/.test(paymentData.number) || // Check if card number is valid
      !paymentData.number.includes(" ") || // Check if spaces are present
      !Number.isInteger(Number(paymentData.number.split(" ").join(""))) // Check if card number is a number
    ) {
      toast.error("Card number is invalid.");
      hasError = true;
    }
    if (paymentData.name.length < 3 || !/^[a-zA-Z ]+$/.test(paymentData.name)) {
      toast.error("Cardholder name is invalid.");
      hasError = true;
    }
    if (
      paymentData.expiry.length < 5 ||
      !paymentData.expiry.includes("/") ||
      !Number.isInteger(Number(paymentData.expiry.split("/").join(""))) // Check if expiry is a number
    ) {
      toast.error("Expiry date is invalid.");
      hasError = true;
    }
    if (
      paymentData.cvc.length < 3 ||
      paymentData.cvc.length > 4 ||
      !Number.isInteger(Number(paymentData.cvc)) // Check if cvc is a number
    ) {
      toast.error("CVC is invalid.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    paymentData.cartItems = cartItems;
    paymentData.totalPrice = totalPrice;
    // Data is valid for frontend, sending to backend for payment processing
    sendPaymentInformationMutation({ paymentInformation: paymentData });
  };

  return (
    <>
      {isSuccess && (
        <div className="flex justify-center flex-col gap-2">
          <h2 className="text-xl font-semibold text-center">
            Payment successful! Thank you for your purchase.
          </h2>
          <p className="text-center">
            You can check your order status in the order history section.
          </p>
        </div>
      )}
      {!isSuccess && isPaymentLoading && (
        <div className="flex justify-center">
          <LoadingIndicator />
        </div>
      )}
      {!isSuccess && isPaymentError && (
        <div className="flex justify-center">
          <ErrorBlock
            title="An error occurred!"
            message={paymentError.info?.message || "Failed to process payment."}
          />
        </div>
      )}
      {!isSuccess && !isPaymentLoading && !isPaymentError && (
        <>
          <h1 className="text-2xl font-bold my-5 text-center">
            Payment method
          </h1>
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <form
              className="flex flex-col gap-5 self-center mt-5"
              onSubmit={handlePaymentSubmit}
            >
              <motion.input
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                type="text"
                name="number"
                placeholder="Card Number"
                value={state.number}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className={cssClasses}
              />
              <motion.input
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                type="text"
                name="name"
                placeholder="Cardholder Name"
                value={state.name}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className={cssClasses}
              />
              <motion.input
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                type="text"
                name="expiry"
                placeholder="Expiry Date (yy/dd)"
                value={state.expiry}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className={cssClasses}
              />
              <motion.input
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                type="text"
                name="cvc"
                placeholder="CVC"
                value={state.cvc}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className={cssClasses}
              />
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="btn btn-secondary"
              >
                Pay now
              </motion.button>
            </form>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="self-center"
            >
              <Cards
                number={state.number}
                expiry={state.expiry}
                cvc={state.cvc}
                name={state.name}
                focused={state.focus}
              />
            </motion.div>
          </div>
        </>
      )}
    </>
  );
}
