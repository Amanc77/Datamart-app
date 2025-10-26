import { Database, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MyPurchases() {
  return (
    <>
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center  items-center gap-3 mb-8">
            <Database className="h-10 w-10 text-primary" />
            <div>
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
            <div className="p-6">
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
                <TableBody></TableBody>
              </Table>
            </div>
          </div>
          {/* End of placeholder - wrap with <Card> later */}
        </div>
      </div>
    </>
  );
}
