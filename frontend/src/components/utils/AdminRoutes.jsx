import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminLayout from "../layouts/AdminLayout";

const AdminRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // Vérification que userInfo existe avant de vérifier la propriété role
  if (!userInfo) {
    return <Navigate to="/" replace />;
  }

  return userInfo.role === "admin" ? (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ) : (
    <Navigate to="/" replace />
  );
};

export default AdminRoutes;
