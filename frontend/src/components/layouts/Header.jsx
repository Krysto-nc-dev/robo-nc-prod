import { logout } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../slices/userApiSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      console.log("logout");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <header className="h-20 pl-20 pr-10 flex justify-between items-center bg-gray-700 ">
      HEADER
    </header>
  );
};

export default Header;
