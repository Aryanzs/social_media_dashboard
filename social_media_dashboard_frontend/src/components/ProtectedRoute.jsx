import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () =>
  localStorage.getItem("token") ? <Outlet /> : <Navigate to="/login" replace />;

export default ProtectedRoute;
