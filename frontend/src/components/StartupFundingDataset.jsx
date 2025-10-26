import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "../api/axios";
import { toast } from "sonner";

const StartupFundingDataset = () => {
  const [data, setData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [filters, setFilters] = useState({
    country: "",
    industry: "",
    minAmountRaised: "",
    yearFrom: "",
    yearTo: "",
  });
  const [rowCount, setRowCount] = useState(100);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/datasets/fundedstartup");
      console.log("API Response for Startup Funding:", response.data);
      const apiData = response.data;
      const rows = apiData.data || (Array.isArray(apiData) ? apiData : []);
      setData(rows);
      setPreviewData(rows);
    } catch (error) {
      console.error("Error fetching startup funding dataset:", error);
      toast.error("Failed to fetch startup funding dataset");
      setData([]);
      setPreviewData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = data;
    if (filters.country) {
      filtered = filtered.filter((item) =>
        (item.country || "")
          .toLowerCase()
          .includes(filters.country.toLowerCase())
      );
    }
    if (filters.industry) {
      filtered = filtered.filter((item) =>
        (item.industry || "")
          .toLowerCase()
          .includes(filters.industry.toLowerCase())
      );
    }
    if (filters.minAmountRaised) {
      const min = parseInt(filters.minAmountRaised);
      if (!isNaN(min)) {
        filtered = filtered.filter((item) => item.amountRaised >= min);
      }
    }
    if (filters.yearFrom || filters.yearTo) {
      const from = filters.yearFrom ? parseInt(filters.yearFrom) : -Infinity;
      const to = filters.yearTo ? parseInt(filters.yearTo) : Infinity;
      filtered = filtered.filter(
        (item) => item.year >= from && item.year <= to
      );
    }
    filtered = filtered
      .sort((a, b) => b.amountRaised - a.amountRaised)
      .slice(0, 10);
    setPreviewData(filtered);
  };

  const handlePurchase = () => {
    const total = rowCount * 0.05;
    toast.success(`Purchased ${rowCount} rows for $${total.toFixed(2)}!`);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 sticky top-0 bg-white z-10 py-4 border-b border-gray-200">
        Startup Funding Dataset
      </h1>
      <p className="text-gray-600 mb-6 text-lg">
        Comprehensive database of startup funding rounds, valuations, and
        investor information from 2015-2024
      </p>
      <div className="flex justify-between mb-6 sticky top-20 bg-white z-10 py-3 border-b border-gray-200">
        <span className="text-lg font-semibold">Total Rows: 5,000</span>
        <span className="text-blue-600 text-lg font-semibold">
          Price: $0.05/row
        </span>
      </div>
      <Card className="border rounded-lg shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">
                Preview Data (First 10 rows)
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                Sample of the dataset to help you make your decision
              </p>
              <div className="overflow-auto max-h-150 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium">Country</TableHead>
                      <TableHead className="font-medium">Industry</TableHead>
                      <TableHead className="font-medium">Valuation</TableHead>
                      <TableHead className="font-medium">Year</TableHead>
                      <TableHead className="font-medium">
                        Startup Name
                      </TableHead>
                      <TableHead className="font-medium">
                        Amount Raised
                      </TableHead>
                      <TableHead className="font-medium">Series</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-gray-500"
                        >
                          No data available.
                        </TableCell>
                      </TableRow>
                    ) : (
                      previewData.map((row, index) => (
                        <TableRow
                          key={index}
                          className={index % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          <TableCell>{row.country || "N/A"}</TableCell>
                          <TableCell>{row.industry || "N/A"}</TableCell>
                          <TableCell>{row.valuation || "N/A"}</TableCell>
                          <TableCell>{row.year || "N/A"}</TableCell>
                          <TableCell>{row.startupName || "N/A"}</TableCell>
                          <TableCell>{row.amountRaised || "N/A"}</TableCell>
                          <TableCell>{row.fs || "N/A"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Purchase Dataset</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Customize your data purchase
              </p>
              <div className="space-y-4">
                <div>
                  <Label className="block mb-2 font-medium text-sm">
                    Number of Rows
                  </Label>
                  <Input
                    type="number"
                    value={rowCount}
                    onChange={(e) => setRowCount(e.target.value)}
                    className="w-full"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Total Cost: ${(rowCount * 0.05).toFixed(2)}
                </p>
                <h3 className="font-semibold mb-3 text-sm">
                  Filters (Optional)
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="block mb-1 font-medium text-sm">
                      Country
                    </Label>
                    <Input
                      placeholder="Filter by country"
                      name="country"
                      value={filters.country}
                      onChange={handleFilterChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="block mb-1 font-medium text-sm">
                      Industry
                    </Label>
                    <Input
                      placeholder="Filter by industry"
                      name="industry"
                      value={filters.industry}
                      onChange={handleFilterChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="block mb-1 font-medium text-sm">
                      Min Amount Raised
                    </Label>
                    <Input
                      placeholder="Min amount raised"
                      name="minAmountRaised"
                      value={filters.minAmountRaised}
                      onChange={handleFilterChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="block mb-1 font-medium text-sm">
                      Year From
                    </Label>
                    <Input
                      placeholder="From year"
                      name="yearFrom"
                      value={filters.yearFrom}
                      onChange={handleFilterChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="block mb-1 font-medium text-sm">
                      Year To
                    </Label>
                    <Input
                      placeholder="To year"
                      name="yearTo"
                      value={filters.yearTo}
                      onChange={handleFilterChange}
                      className="w-full"
                    />
                  </div>
                </div>
                <Button
                  onClick={applyFilters}
                  className="w-full mb-2 bg-blue-500 hover:bg-blue-600"
                >
                  Apply Filters
                </Button>
                <Button
                  onClick={handlePurchase}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  Purchase Dataset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupFundingDataset;
