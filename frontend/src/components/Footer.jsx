import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center gap-6 mb-4">
          <button className="text-gray-800">About</button>
          <button className="text-gray-800">Privacy</button>
          <button className="text-gray-800">Terms</button>
          <button className="text-gray-800">Contact</button>
        </div>
        <p className="text-gray-400">
          &copy; 2025 DataMart. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
