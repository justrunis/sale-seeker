import { loginActions } from "../../store/slices/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import Input from "../UI/Input";
import Header from "../Header";
import useHttp from "../../hooks/useHttp";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../public/logos/png/logo-color.png";

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

  const { isLoading, sendRequest } = useHttp(
    "http://localhost:4000/login",
    requestConfig
  );

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
    toast.success(`User ${user.email} logged in.`);
    dispatch(loginActions.login(response.data.user));
    navigate("/home");
  };

  const cssClasses =
    "shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline my-2";

  return (
    <>
      <Header />
      <div className="w-full max-w-xl p-8 mx-auto">
        <form
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
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-2 mx-2"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-2 mx-2"
            type="reset"
          >
            Clear
          </button>
          <p>
            Don't have an account yet?{" "}
            <a
              className="text-blue-500 hover:text-blue-800 my-2"
              href="/register"
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </>
  );
}
