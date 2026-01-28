import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";

export default function ProtectedRoute() {
const { isAuthenticated, isLoading } = useSelector(
  (state: RootState) => state.auth
);
console.log("Check is Authenticated: "+ isAuthenticated)

if (isLoading) {
  return <div>Checking session...</div>;
}

if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}

return <Outlet />;

}