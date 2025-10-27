import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const DatasetSkeleton = ({ columnCount = 6 }) => {
  return (
    <div className="p-6 bg-white min-h-screen">
      <Skeleton className="h-8 w-[300px] mb-4" />
      <Skeleton className="h-4 w-[400px] mb-6" />
      <div className="flex justify-between mb-6">
        <Skeleton className="h-6 w-[150px]" />
        <Skeleton className="h-6 w-[150px]" />
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-6 w-[150px] mb-3" />
              <div className="border rounded-md overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Array.from({ length: columnCount }).map((_, i) => (
                        <TableHead key={i}>
                          <Skeleton className="h-4 w-[80px]" />
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: columnCount }).map((_, j) => (
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

            <div>
              <Skeleton className="h-6 w-[150px] mb-3" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-5 w-[100px]" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatasetSkeleton;
