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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { fetchPurchases } from "@/features/purchaseSlice";
import DatasetSkeleton from "./DatasetSkeleton";

const RealEstateDataset = () => {
  const [data, setData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    yearFrom: "",
    yearTo: "",
  });
  const [rowCount, setRowCount] = useState(100);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    loadRazorpay();
  }, []);

  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/datasets/estate");
      const rows = res.data.data || [];
      setData(rows);
      setPreviewData(rows.slice(0, rowCount));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
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
    let filtered = [...data];

    if (filters.city) {
      filtered = filtered.filter((item) =>
        item.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    if (filters.minPrice) {
      const min = parseInt(filters.minPrice);
      if (!isNaN(min)) filtered = filtered.filter((item) => item.price >= min);
    }
    if (filters.yearFrom || filters.yearTo) {
      const from = filters.yearFrom ? parseInt(filters.yearFrom) : -Infinity;
      const to = filters.yearTo ? parseInt(filters.yearTo) : Infinity;
      filtered = filtered.filter(
        (item) => item.yearBuilt >= from && item.yearBuilt <= to
      );
    }

    filtered = filtered.sort((a, b) => b.price - a.price).slice(0, rowCount);
    setPreviewData(filtered);
  };

  const initiatePayment = async () => {
    if (!isAuthenticated) {
      toast.error("you need to Login first");
      navigate("/login");
      return;
    }
    if (rowCount < 1) return toast.error("Row count must be at least 1");

    try {
      const res = await axiosInstance.post("/payments/checkout/dataset", {
        datasetType: "realestate",
        filters,
        rowCount,
      });

      if (!res.data.success) throw new Error(res.data.message);

      if (res.data.isFree) {
        toast.success("Free dataset unlocked!");
        dispatch(fetchPurchases());
        return;
      }

      const options = {
        key: res.data.key_id,
        amount: res.data.amount_paise,
        currency: "INR",
        name: "DataMart",
        description: `Real Estate - ${rowCount} rows`,
        order_id: res.data.order_id,
        handler: async (response) => {
          try {
            const verifyRes = await axiosInstance.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.data.success) {
              toast.success("Payment successful! Dataset ready.");
              dispatch(fetchPurchases());
            }
          } catch (err) {
            toast.error(`Verification failed: ${err?.message || err}`);
          }
        },
        prefill: res.data.prefill,
        theme: { color: "#10b981" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed");
      });
      rzp.open();
    } catch (err) {
      toast.error(`Payment initiation failed: ${err.message}`);
    }
  };

  if (loading) {
    return <DatasetSkeleton columnCount={7} />;
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 sticky top-0 bg-white z-10 py-4 border-b">
        Real Estate Listings
      </h1>
      <p className="text-gray-600 mb-6 text-lg">
        Property listings with prices, locations, sizes, and market trends.
      </p>
      <div className="flex justify-between mb-6 sticky top-16 bg-white z-10 py-3 border-b">
        <span className="text-lg font-semibold">Total Rows: 8,000</span>
        <span className="text-blue-600 text-lg font-semibold">
          Price: $0.05/row
        </span>
      </div>

      <Card className="border rounded-lg shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Preview Data</h2>
              <p className="text-sm text-gray-600 mb-4">
                First {previewData.length} rows (filtered)
              </p>
              <div className="border rounded-md overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>City</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Bed</TableHead>
                      <TableHead>Sqft</TableHead>
                      <TableHead>Bath</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-gray-500 py-8"
                        >
                          No matching data
                        </TableCell>
                      </TableRow>
                    ) : (
                      previewData.map((row, i) => (
                        <TableRow
                          key={i}
                          className={i % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          <TableCell>{row.city || "N/A"}</TableCell>
                          <TableCell>${row.price?.toLocaleString()}</TableCell>
                          <TableCell>{row.bedrooms}</TableCell>
                          <TableCell>{row.sqft}</TableCell>
                          <TableCell>{row.bathrooms}</TableCell>
                          <TableCell>{row.yearBuilt}</TableCell>
                          <TableCell className="text-xs">
                            {row.propertyId}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Purchase Dataset</h2>
              <p className="text-sm text-gray-600 mb-4">Customize your data</p>

              <div className="space-y-4">
                <div>
                  <Label>Number of Rows</Label>
                  <Input
                    type="number"
                    min="1"
                    value={rowCount}
                    onChange={(e) =>
                      setRowCount(Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                </div>
                <p className="font-medium">
                  Total: <strong>${(rowCount * 0.05).toFixed(2)}</strong>{" "}
                  (approx. ₹{(rowCount * 0.05 * 84).toFixed(2)})
                </p>

                <h3 className="font-semibold text-sm">Filters</h3>
                <div className="space-y-3 text-sm">
                  <Input
                    placeholder="City"
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                  />
                  <Input
                    placeholder="Min Price"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                  <Input
                    placeholder="Year From"
                    name="yearFrom"
                    value={filters.yearFrom}
                    onChange={handleFilterChange}
                  />
                  <Input
                    placeholder="Year To"
                    name="yearTo"
                    value={filters.yearTo}
                    onChange={handleFilterChange}
                  />
                </div>

                <Button
                  onClick={applyFilters}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Apply Filters
                </Button>
                <Button
                  onClick={initiatePayment}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Purchase Now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealEstateDataset;
