import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLoginMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import logoImage from "../assets/logo_qc.jpeg"; // Ajout du logo
import { Loader } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userInfo.role === "user") {
        navigate("/user/dashboard");
      } else if (userInfo.role === "private") {
        navigate("/private/dashboard");
      } else {
        navigate(redirect);
      }
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-700">
      <div className="w-full max-w-md bg-gray-800 text-white shadow-xl rounded-lg p-8">
        {/* Logo de la quincaillerie */}
        <div className="flex justify-center mb-6">
          {/* <img
            src={logoImage}
            alt="Quincaillerie Calédonienne"
            className="h-16 w-auto"
          /> */}
        </div>

        <h2 className="text-center text-lg text-gray-400 mb-8">
          Connectez-vous pour accéder à votre compte.
        </h2>

        <form onSubmit={submitHandler} className="space-y-4">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:ring-2 focus:ring-primaryColor focus:outline-none placeholder-gray-400"
            placeholder="Adresse e-mail"
          />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:ring-2 focus:ring-primaryColor focus:outline-none placeholder-gray-400"
            placeholder="Mot de passe"
          />
          <button
            type="submit"
            className="w-full bg-primaryColor text-black font-bold p-3 rounded-md hover:bg-highlightColor transition duration-150 flex justify-center items-center"
          >
            {isLoading ? <Loader className="animate-spin" /> : "Se connecter"}
          </button>
        </form>

        <div className="flex justify-between items-center mt-6 text-sm">
          <Link
            to="/forgot-password"
            className="text-blue-400 hover:underline transition duration-150"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
