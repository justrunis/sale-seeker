import Header from "../Header";
import Input from "../UI/Input";
import { useInput } from "../../hooks/useInput";
import { isEmail, isNotEmpty, hasMinLength } from "../util/validation";
import { useRef } from "react";
import useHttp from "../../hooks/useHttp";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/logos/png/logo-color.png";
import { motion } from "framer-motion";
import { useAnimate, stagger } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const recaptcha = useRef();

  const [scope, animate] = useAnimate();

  const {
    value: usernameValue,
    isValid: usernameIsValid,
    hasError: usernameHasError,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    reset: resetUsername,
  } = useInput("", (value) => isNotEmpty(value) && hasMinLength(value, 3));

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput("", isEmail);

  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput("", (value) => {
    return hasMinLength(value, 6);
  });

  const {
    value: confirmPasswordValue,
    isValid: confirmPasswordIsValid,
    hasError: confirmPasswordHasError,
    valueChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
    reset: resetConfirmPassword,
  } = useInput("", (value) => {
    return value === passwordValue;
  });

  const requestConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const URL = import.meta.env.VITE_API_URL;

  const { isLoading, sendRequest } = useHttp(`${URL}/register`, requestConfig);

  async function handleRegistration(event) {
    event.preventDefault();
    setPasswordsAreNotEqual(false);

    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    const captchaValue = recaptcha.current.getValue();
    if (!captchaValue) {
      toast.error("Please complete the reCAPTCHA challenge.");
      return;
    }

    if (data.password !== data["confirm-password"]) {
      setPasswordsAreNotEqual(true);
      animate(
        "input, Input",
        { x: [-10, 0, 10, 0] },
        { type: "spring", duration: 0.2, delay: stagger(0.05) }
      );
      toast.error("Passwords are not equal.");
      return;
    }

    if (
      !usernameIsValid ||
      !emailIsValid ||
      !passwordIsValid ||
      !confirmPasswordIsValid
    ) {
      animate(
        "input, Input",
        { x: [-10, 0, 10, 0] },
        { type: "spring", duration: 0.2, delay: stagger(0.05) }
      );
      toast.error("Invalid input. Please check the form.");
      return;
    }

    const response = await sendRequest(
      JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      })
    );
    if (response.error) {
      toast.error(response.error || "Failed to create user.");
      return;
    }
    toast.success(`User ${data.username} created.`);
    navigate("/login");
  }

  function clearInputs() {
    resetUsername();
    resetEmail();
    resetPassword();
    resetConfirmPassword();
  }

  const cssClasses =
    "shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline my-2";

  return (
    <>
      <Header />
      <div className="w-full max-w-xl p-8 mx-auto">
        <motion.form
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleRegistration}
          ref={scope}
        >
          <h1 className="text-2xl font-bold text-center text-black">
            Register
          </h1>
          <img
            className="w-40 h-40 object-cover rounded-lg bg-base-100 mx-auto my-4"
            src={logo}
            alt="logo"
          />
          <Input
            label="Username"
            id="username"
            name="username"
            type="text"
            onBlur={usernameBlurHandler}
            onChange={usernameChangeHandler}
            value={usernameValue}
            error={usernameHasError}
            className={`${cssClasses} ${
              usernameHasError ? "border-red-500" : ""
            }`}
            labelClass="text-black"
          />
          {usernameHasError && (
            <p className="text-red-500 text-xs italic">
              Username must be at least 3 characters
            </p>
          )}

          <Input
            label="Email"
            id="email"
            name="email"
            type="text"
            onBlur={emailBlurHandler}
            onChange={emailChangeHandler}
            value={emailValue}
            error={emailHasError}
            className={`${cssClasses} ${emailHasError ? "border-red-500" : ""}`}
            labelClass="text-black"
          />
          {emailHasError && (
            <p className="text-red-500 text-xs italic">Invalid email</p>
          )}

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            onBlur={passwordBlurHandler}
            onChange={passwordChangeHandler}
            value={passwordValue}
            error={passwordHasError}
            className={`${cssClasses} ${
              passwordHasError ? "border-red-500" : ""
            }`}
            labelClass="text-black"
          />
          {passwordHasError && (
            <p className="text-red-500 text-xs italic">
              Password must be at least 6 characters
            </p>
          )}

          <Input
            label="Confirm Password"
            id="confirm-password"
            name="confirm-password"
            type="password"
            onBlur={confirmPasswordBlurHandler}
            onChange={confirmPasswordChangeHandler}
            value={confirmPasswordValue}
            error={confirmPasswordHasError}
            className={`${cssClasses} ${
              confirmPasswordHasError ? "border-red-500" : ""
            }`}
            labelClass="text-black"
          />

          {confirmPasswordHasError && (
            <p className="text-red-500 text-xs italic">
              Passwords are not equal
            </p>
          )}

          <ReCAPTCHA
            ref={recaptcha}
            sitekey={import.meta.env.VITE_SITE_KEY}
            size="normal"
            theme="light"
          />

          <motion.button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-2 mx-2"
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.2 }}
          >
            {isLoading ? "Loading..." : "Register"}
          </motion.button>
          <motion.button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-2 mx-2"
            type="button"
            onClick={clearInputs}
            disabled={isLoading}
            whileHover={{ scale: 1.2 }}
          >
            Clear
          </motion.button>
          <p className="text-black">
            Already have an account?{" "}
            <Link
              className="text-blue-500 hover:text-blue-800 my-2"
              to="/login"
            >
              Login
            </Link>
          </p>
        </motion.form>
      </div>
    </>
  );
}
