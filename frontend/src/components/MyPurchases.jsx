import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Database, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPurchases } from "@/features/purchaseSlice";
import { toast } from "sonner";
import axiosInstance from "../api/axios";
import { Link } from "react-router-dom";

export default function MyPurchases() {
  const dispatch = useDispatch();
  const {
    list: purchases = [],
    loading,
    error,
  } = useSelector((state) => state.purchases || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPurchases());
    }
  }, [dispatch, isAuthenticated]);

  const handleDownload = async (id) => {
    try {
      const response = await axiosInstance.get(`/payments/downloads/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `dataset_${id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(`Failed to download dataset: ${err.message}`);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getName = (type) =>
    type === "realestate" ? "Real Estate" : "Startup Funding";

  const getBadgeVariant = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 flex-col gap-4">
        <p>Please login first to view your purchases.</p>
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      //added skeleton
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-center items-center gap-3 mb-10">
            <Database className="h-10 w-10 text-primary" />
            <div className="text-center">
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-4 w-[300px] mt-2" />
            </div>
          </div>

          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-4 w-[300px] mt-2" />
            </div>

            <div className="p-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <TableHead key={i}>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load purchases. Please log in again.
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-center items-center gap-3 mb-10">
          <Database className="h-10 w-10 text-primary" />
          <div className="text-center">
            <h1 className="text-4xl font-bold">My Purchases</h1>
            <p className="text-muted-foreground">
              Download your purchased datasets
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Purchase History</h2>
            <p className="text-muted-foreground">
              All your dataset purchases and downloads
            </p>
          </div>

          <div className="p-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dataset</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-10"
                    >
                      No purchases yet
                    </TableCell>
                  </TableRow>
                ) : (
                  purchases.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell className="font-semibold">
                        {getName(p.datasetType)}
                      </TableCell>
                      <TableCell>
                        {p.datasetType === "realestate"
                          ? "Property & Market Data"
                          : "Startup Investment Data"}
                      </TableCell>
                      <TableCell>{p.rowCount}</TableCell>
                      <TableCell>${p.amount?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(p.status)}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(p.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleDownload(p._id)}
                          disabled={p.status !== "completed"}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" /> CSV
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
