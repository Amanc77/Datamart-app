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
import { useDispatch } from "react-redux";
import { fetchPurchases } from "@/features/purchaseSlice";

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
  const [rowCount, setRowCount] = useState(50);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
      const res = await axiosInstance.get("/datasets/fundedstartup");
      const rows = res.data.data || [];
      setData(rows);
      setPreviewData(rows.slice(0, `${rowCount}`));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
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

    if (filters.country)
      filtered = filtered.filter((item) =>
        item.country?.toLowerCase().includes(filters.country.toLowerCase())
      );
    if (filters.industry)
      filtered = filtered.filter((item) =>
        item.industry?.toLowerCase().includes(filters.industry.toLowerCase())
      );
    if (filters.minAmountRaised) {
      const min = parseInt(filters.minAmountRaised);
      if (!isNaN(min))
        filtered = filtered.filter((item) => item.amountRaised >= min);
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
      .slice(0, rowCount);

    setPreviewData(filtered);
  };

  const initiatePayment = async () => {
    if (rowCount < 1) return toast.error("Row count too low");

    try {
      const res = await axiosInstance.post("/payments/checkout/dataset", {
        datasetType: "startupfunding",
        filters,
        rowCount,
      });

      if (!res.data.success) throw new Error("Order failed");

      if (res.data.isFree) {
        toast.success("Free access granted!");
        dispatch(fetchPurchases());
        return;
      }

      const options = {
        key: res.data.key_id,
        amount: res.data.amount_paise,
        currency: "INR",
        name: "DataMart",
        description: `Startup Funding - ${rowCount} rows`,
        order_id: res.data.order_id,
        handler: async (resp) => {
          const verify = await axiosInstance.post("/payments/verify", {
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
          });
          if (verify.data.success) {
            toast.success("Payment done! Download ready.");
            dispatch(fetchPurchases());
          }
        },
        prefill: res.data.prefill,
        theme: { color: "#8b5cf6" },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment error");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 sticky top-0 bg-white z-10 py-4 border-b">
        Startup Funding Dataset
      </h1>
      <p className="text-gray-600 mb-6 text-lg">
        Funding rounds, valuations, and investors (2015–2024)
      </p>
      <div className="flex justify-between mb-6 sticky top-16 bg-white z-10 py-3 border-b">
        <span className="text-lg font-semibold">Total Rows: 5,000</span>
        <span className="text-blue-600 text-lg font-semibold">
          Price: $0.05/row
        </span>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Preview</h2>
              <div className="border rounded-md overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Country</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Startup</TableHead>
                      <TableHead>Raised</TableHead>
                      <TableHead>Series</TableHead>
                      <TableHead>Year</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-gray-500"
                        >
                          No data
                        </TableCell>
                      </TableRow>
                    ) : (
                      previewData.map((row, i) => (
                        <TableRow
                          key={i}
                          className={i % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          <TableCell>{row.country}</TableCell>
                          <TableCell>{row.industry}</TableCell>
                          <TableCell>{row.startupName}</TableCell>
                          <TableCell>
                            ${row.amountRaised?.toLocaleString()}
                          </TableCell>
                          <TableCell>{row.fs || "N/A"}</TableCell>
                          <TableCell>{row.year}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Buy Dataset</h2>
              <div className="space-y-4">
                <div>
                  <Label>Rows</Label>
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
                  Cost: <strong>${(rowCount * 0.05).toFixed(2)}</strong>
                </p>

                <h3 className="font-semibold text-sm">Filters</h3>
                <div className="space-y-3 text-sm">
                  <Input
                    placeholder="Country"
                    name="country"
                    value={filters.country}
                    onChange={handleFilterChange}
                  />
                  <Input
                    placeholder="Industry"
                    name="industry"
                    value={filters.industry}
                    onChange={handleFilterChange}
                  />
                  <Input
                    placeholder="Min Raised"
                    name="minAmountRaised"
                    value={filters.minAmountRaised}
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
                  className="w-full"
                  variant="secondary"
                >
                  Apply Filters
                </Button>
                <Button
                  onClick={initiatePayment}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Buy Now
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
