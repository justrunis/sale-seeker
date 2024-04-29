import { loginActions } from "../../store/slices/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import Input from "../UI/Input";
import Header from "../Header";
import useHttp from "../../hooks/useHttp";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../public/logos/png/logo-color.png";
import { motion } from "framer-motion";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const user = useSelector((state) => state.login.user);

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

    const user = {
      email: data.email,
      password: data.password,
      token: null,
    };

    const response = await sendRequest(JSON.stringify(user));
    if (response.error) {
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
        >
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <img
            className="w-40 h-40 object-cover rounded-lg bg-base-100 mx-auto my-4"
            src={logo}
            alt="logo"
          />
          <Input className={cssClasses} label="Email" id="email" type="email" />
          <Input
            className={cssClasses}
            label="Password"
            id="password"
            type="password"
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
          <p>
            Don't have an account yet?{" "}
            <a
              className="text-blue-500 hover:text-blue-800 my-2"
              href="/register"
            >
              Register
            </a>
          </p>
        </motion.form>
      </div>
    </>
  );
}
