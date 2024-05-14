import { loginActions } from "../../store/slices/loginSlice";
import { useDispatch } from "react-redux";
import Input from "../UI/Input";
import Header from "../Header";
import useHttp from "../../hooks/useHttp";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../public/logos/png/logo-color.png";
import { motion, useAnimate, stagger } from "framer-motion";
import { Link } from "react-router-dom";
import ForgotPassword from "../ForgotPasswordModal";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [scope, animate] = useAnimate();
  const [isInputError, setIsInputError] = useState(false);

  const recaptcha = useRef();

  const [showModal, setShowModal] = useState(false);

  const requestConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const URL = import.meta.env.VITE_API_URL;

  const { isLoading, sendRequest } = useHttp(`${URL}/login`, requestConfig);

  const handleLogin = async (event) => {
    event.preventDefault();

    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    const captchaValue = recaptcha.current.getValue();
    if (!captchaValue) {
      toast.error("Please complete the reCAPTCHA challenge.");
      return;
    }

    const user = {
      email: data.email,
      password: data.password,
      token: null,
    };

    const response = await sendRequest(JSON.stringify(user));
    if (response.error) {
      animate(
        "input, Input",
        { x: [-10, 0, 10, 0] },
        { type: "spring", duration: 0.2, delay: stagger(0.05) }
      );
      setIsInputError(true);
      toast.error(response.error || "Failed to login.");
      return;
    }
    dispatch(loginActions.login(response.data.user));
    toast.success(`User ${user.email} logged in.`);
    navigate("/home");
  };

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
          onSubmit={handleLogin}
          ref={scope}
        >
          <h2 className="text-2xl font-bold text-center text-black">Login</h2>
          <img
            className="w-40 h-40 object-cover rounded-lg bg-base-100 mx-auto my-4"
            src={logo}
            alt="logo"
          />
          <Input
            className={cssClasses + (isInputError ? " border-red-500" : "")}
            labelClass="text-black"
            label="Email"
            id="email"
            type="email"
          />
          <Input
            className={cssClasses + (isInputError ? " border-red-500" : "")}
            labelClass="text-black"
            label="Password"
            id="password"
            type="password"
          />
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
            {isLoading ? "Loading..." : "Login"}
          </motion.button>
          <motion.button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-2 mx-2"
            type="reset"
            disabled={isLoading}
            whileHover={{ scale: 1.2 }}
          >
            Clear
          </motion.button>
          <ForgotPassword showModal={showModal} setShowModal={setShowModal} />
          <p className="text-black">
            Forgot your password?{" "}
            <button
              className="text-blue-500 hover:text-blue-800 my-2"
              onClick={() => setShowModal(true)}
              type="button"
            >
              Reset
            </button>
          </p>
          <p className="text-black">
            Don't have an account yet?{" "}
            <Link
              className="text-blue-500 hover:text-blue-800 my-2"
              to="/register"
            >
              Register
            </Link>
          </p>
        </motion.form>
      </div>
    </>
  );
}
