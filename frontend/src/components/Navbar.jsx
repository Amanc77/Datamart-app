import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { userLoggedOut } from "@/features/authSlice";
import axiosInstance from "@/api/axios";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(userLoggedOut());
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Database className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-blue-500">DataMart</span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            className="text-gray-600 hover:text-blue-500 font-bold transition-colors duration-200"
          >
            <Link to="/">Home</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-gray-600 hover:text-blue-500 font-bold transition-colors duration-200"
          >
            <Link to="/datasets">Datasets</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-gray-600 hover:text-blue-500 font-bold transition-colors duration-200"
          >
            <Link to="/myPurchases">My Purchases</Link>
          </Button>

          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-gray-700"
            >
              Logout
            </Button>
          ) : (
            <Button
              asChild
              variant="ghost"
              className="text-gray-600 hover:text-blue-500 font-bold transition-colors duration-200"
            >
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
