import React from "react";
import { Database, TrendingUp, Shield, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center gap-2 mb-4">
          <Database className="h-12 w-12 text-blue-500" />
          <h1 className="text-5xl font-bold text-blue-500">DataMart</h1>
        </div>
        <p className="text-xl text-gray-600 mb-4">
          Your Gateway to Premium Data
        </p>
        <p className="text-base text-gray-500 mb-6 max-w-xl mx-auto">
          Discover curated datasets for real estate, startups, and more. Filter
          precisely and pay only for what you use.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2 hover:bg-blue-600 ">
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link to="/datasets">
            <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-gray-200 ">
              Browse Datasets
            </button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <div className="text-center p-4 bg-white rounded-md shadow-sm hover:bg-blue-500 hover:shadow-md ">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Pay Per Row
            </h3>
            <p className="text-gray-500">
              Flexible pricing starting at $0.05 per row with custom filtering.
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-md shadow-sm hover:bg-blue-500 hover:shadow-md ">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Curated Quality
            </h3>
            <p className="text-gray-500">
              High-quality, verified datasets ready for immediate use.
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-md hover:bg-blue-500 shadow-sm hover:shadow-md ">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Instant Download
            </h3>
            <p className="text-gray-500">
              Download your filtered CSV instantly with no delays.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="bg-blue-500 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">
            Start Exploring Premium Data
          </h2>
          <p className="text-lg mb-6">
            Join thousands of businesses unlocking insights with DataMart.
          </p>
          <Link to="/login">
            <button className="px-6 py-2 bg-white text-blue-500 rounded-md hover:bg-gray-100 ">
              Create Free Account
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
