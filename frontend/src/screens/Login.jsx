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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500">
      <div className="w-full max-w-md bg-white text-gray-800 shadow-lg rounded-lg p-8">
        {/* Logo de la quincaillerie */}
        <div className="flex justify-center mb-6">
          <img
            src={logoImage}
            alt="Quincaillerie Calédonienne"
            className="h-16 w-auto"
          />
        </div>

        <h2 className="text-center text-xl font-bold text-gray-700 mb-8">
          Bienvenue, connectez-vous pour continuer.
        </h2>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 shadow-sm"
              placeholder="Adresse e-mail"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 shadow-sm"
              placeholder="Mot de passe"
            />
          </div>
          <button
            type="submit"
            className="w-full p-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200 flex justify-center items-center shadow-md"
          >
            {isLoading ? <Loader className="animate-spin" /> : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <span className="mr-2">Nouveau ici ?</span>
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Créez un compte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
