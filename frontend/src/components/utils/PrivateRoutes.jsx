import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PrivateLayout from "../layouts/PrivateLayout";

const PrivateRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to="/connexion" replace />;
  }

  return userInfo.role === "private" ? (
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
  ) : (
    <Navigate to="/connexion" replace />
  );
};

export default PrivateRoutes;
