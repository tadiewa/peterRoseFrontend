"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import type { Review } from "@/lib/types";

type FilterStatus = "all" | Review["status"];

export default function AdminReviewsPage() {
  const { products, reviews, updateReviewStatus, deleteReview } = useStore();
  const [filter, setFilter] = useState<FilterStatus>("all");

  const getProductName = (productId: string) =>
    products.find((p) => p.id === productId)?.name || "Unknown Product";

  const filteredReviews =
    filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  const handleApprove = (id: string) => {
    updateReviewStatus(id, "approved");
    toast.success("Review approved and now visible on the product page");
  };

  const handleReject = (id: string) => {
    updateReviewStatus(id, "rejected");
    toast.success("Review rejected");
  };

  const handleDelete = (id: string) => {
    deleteReview(id);
    toast.success("Review permanently deleted");
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  const statusBadge = (status: Review["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            <CheckCircle2 className="h-3 w-3" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Reviews
          </h1>
          <p className="text-muted-foreground">
            Manage customer reviews and ratings
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Reviews</p>
            <p className="text-2xl font-bold text-foreground">
              {reviews.length}
            </p>
          </div>
          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Average Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-foreground">
                {avgRating.toFixed(1)}
              </p>
              <Star className="h-5 w-5 fill-primary text-primary" />
            </div>
          </div>
          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm text-muted-foreground">5-Star Reviews</p>
            <p className="text-2xl font-bold text-foreground">
              {reviews.filter((r) => r.rating === 5).length}
            </p>
          </div>
          <div className="bg-secondary rounded-lg p-4 relative">
            <p className="text-sm text-muted-foreground">Pending Approval</p>
            <p className="text-2xl font-bold text-foreground">
              {pendingCount}
            </p>
            {pendingCount > 0 && (
              <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-yellow-500 animate-pulse" />
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Filter by:</span>
          <Select
            value={filter}
            onValueChange={(val) => setFilter(val as FilterStatus)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="hidden md:table-cell">Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((review) => (
                  <TableRow
                    key={review.id}
                    className={
                      review.status === "pending"
                        ? "bg-yellow-50/50"
                        : undefined
                    }
                  >
                    <TableCell className="font-bold text-sm text-foreground">
                      {review.userName}
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {getProductName(review.productId)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={`admin-rev-${review.id}-star-${i}`}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "fill-primary text-primary"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs hidden md:table-cell">
                      <p className="text-sm text-muted-foreground truncate">
                        {review.comment}
                      </p>
                    </TableCell>
                    <TableCell>{statusBadge(review.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                      {review.date}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        {review.status !== "approved" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApprove(review.id)}
                            title="Approve review"
                            className="h-8 w-8"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="sr-only">Approve</span>
                          </Button>
                        )}
                        {review.status !== "rejected" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReject(review.id)}
                            title="Reject review"
                            className="h-8 w-8"
                          >
                            <XCircle className="h-4 w-4 text-yellow-600" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(review.id)}
                          title="Delete review"
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
