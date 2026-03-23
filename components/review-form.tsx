"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store-context";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const { addReview } = useStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please enter your review");
      return;
    }

    setIsSubmitting(true);

    // Simulate a short delay for UX
    setTimeout(() => {
      addReview({
        productId,
        userName: name.trim(),
        rating,
        comment: comment.trim(),
        date: new Date().toISOString().split("T")[0],
      });

      toast.success(
        "Thank you! Your review has been submitted and is pending approval."
      );
      setRating(0);
      setName("");
      setComment("");
      setIsSubmitting(false);
      onSuccess?.();
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-foreground mb-2">
          Your Rating
        </label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={`form-star-${i}`}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              aria-label={`Rate ${i + 1} star${i === 0 ? "" : "s"}`}
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  i < (hoveredRating || rating)
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-sm text-muted-foreground ml-2">
              {rating} / 5
            </span>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="reviewer-name"
          className="block text-sm font-bold text-foreground mb-1.5"
        >
          Your Name
        </label>
        <Input
          id="reviewer-name"
          placeholder="e.g. Thandi M."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          className="max-w-xs"
        />
      </div>

      <div>
        <label
          htmlFor="review-comment"
          className="block text-sm font-bold text-foreground mb-1.5"
        >
          Your Review
        </label>
        <Textarea
          id="review-comment"
          placeholder="Tell us about your experience with this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={500}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {comment.length}/500 characters
        </p>
      </div>

      <Button
        type="submit"
        className="rounded-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
