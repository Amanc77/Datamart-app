import React from "react";
import { Link } from "react-router-dom";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
