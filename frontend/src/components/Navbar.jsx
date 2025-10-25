import React from "react";
import { Database } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Database className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-blue-500">DataMart</span>
        </div>
        <div className="flex gap-6  font-bold ">
          <button className="text-gray-600 hover:text-blue-500 ">Home</button>
          <button className="text-gray-600 hover:text-blue-500 ">
            Marketplace
          </button>
          <button className="text-gray-600 hover:text-blue-500 ">
            Pricing
          </button>
          <button className="text-gray-600 hover:text-blue-500 ">Login</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
