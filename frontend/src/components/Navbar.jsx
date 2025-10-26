import React from "react";
import { Link } from "react-router-dom";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Database className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-blue-500">DataMart</span>
        </div>
        <div className="flex gap-6">
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
          <Button
            asChild
            variant="ghost"
            className="text-gray-600 hover:text-blue-500 font-bold transition-colors duration-200"
          >
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
