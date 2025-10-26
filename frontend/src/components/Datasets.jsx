import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Datasets = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Explore Premium Datasets
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Access curated, high-quality data for your next project
      </p>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-xl text-blue-800">
              Startup Funding Dataset
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-gray-700 mb-4">
              Comprehensive database of startup funding rounds, valuations, and
              investor information from 2015-2024
            </p>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>5,000 rows</span>
              <span>$0.05/row</span>
            </div>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => navigate("/datasets/fundedstartup")}
            >
              Explore Dataset
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-xl text-blue-800">
              Real Estate Listings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-gray-700 mb-4">
              Property listings with prices, locations, sizes, and market trends
              across major cities
            </p>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>8,000 rows</span>
              <span>$0.05/row</span>
            </div>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => navigate("/datasets/estate")}
            >
              Explore Dataset
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Datasets;
