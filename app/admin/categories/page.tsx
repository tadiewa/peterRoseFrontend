"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ImageUpload } from "@/components/admin/image-upload";
import type { CategoryResponseDTO, CategoryCreateDTO, CategoryUpdateDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Power, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "@/lib/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState<CategoryResponseDTO | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (categoryData: CategoryCreateDTO | CategoryUpdateDTO) => {
    try {
      if (editCategory) {
        const updated = await updateCategory(editCategory.id, categoryData as CategoryUpdateDTO);
        setCategories((prev) =>
          prev.map((c) => (c.id === editCategory.id ? updated : c))
        );
        toast.success(`${updated.displayName} updated successfully`);
      } else {
        const created = await createCategory(categoryData as CategoryCreateDTO);
        setCategories((prev) => [...prev, created]);
        toast.success(`${created.displayName} created successfully`);
      }
      setIsDialogOpen(false);
      setEditCategory(null);
    } catch (error: any) {
      console.error("Failed to save category:", error);
      toast.error(error.message || "Failed to save category");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      setErrorDialog({ 
        isOpen: true, 
        title: "Action Denied", 
        message: error.message || "Failed to delete category." 
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updated = await toggleCategoryStatus(id);
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      toast.success("Category status updated");
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Dialog open={errorDialog.isOpen} onOpenChange={(isOpen) => setErrorDialog({ ...errorDialog, isOpen })}>
        <DialogContent className="max-w-[400px] bg-background border-destructive text-center">
          <DialogHeader className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="font-serif text-xl border-none">
              {errorDialog.title}
            </DialogTitle>
          </DialogHeader>
          <div className="text-muted-foreground text-sm py-2">
            {errorDialog.message}
          </div>
          <div className="mt-4 flex justify-center w-full">
            <Button className="w-full" variant="default" onClick={() => setErrorDialog({ ...errorDialog, isOpen: false })}>
              Understood
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-serif text-2xl font-bold">Categories</h1>
            <p className="text-muted-foreground">Manage product categories</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="rounded-full"
                onClick={() => setEditCategory(null)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-background max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif">
                  {editCategory ? "Edit Category" : "Add New Category"}
                </DialogTitle>
              </DialogHeader>
              <CategoryForm
                category={editCategory}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Order</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded overflow-hidden bg-muted">
                        {category.imageUrl ? (
                          <Image
                            src={category.imageUrl}
                            alt={category.displayName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-secondary px-2 py-1 rounded">
                        {category.name}
                      </code>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {category.displayName}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {category.displayOrder}
                    </TableCell>
                    <TableCell className="text-center">
                      {category.active ? (
                        <span className="text-xs font-bold text-green-600">
                          Active
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(category.id)}
                          title={category.active ? "Deactivate" : "Activate"}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditCategory(category);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDelete(category.id, category.displayName)
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}

function CategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category: CategoryResponseDTO | null;
  onSave: (category: CategoryCreateDTO | CategoryUpdateDTO) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<CategoryCreateDTO | CategoryUpdateDTO>(
    category || {
      name: "",
      displayName: "",
      description: "",
      imageUrl: "",
      active: true,
      displayOrder: 0,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name (URL-friendly)</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="roses"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Will be auto-converted to lowercase
        </p>
      </div>

      <div>
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          placeholder="Roses"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
        />
      </div>

      {/* ✅ IMAGE UPLOAD COMPONENT */}
      <ImageUpload
        currentImage={form.imageUrl}
        onImageChange={(imageUrl) => setForm({ ...form, imageUrl: imageUrl })}
        label="Category Image"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="displayOrder">Display Order</Label>
          <Input
            id="displayOrder"
            type="number"
            value={form.displayOrder}
            onChange={(e) =>
              setForm({ ...form, displayOrder: Number(e.target.value) })
            }
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Active</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="rounded-full flex-1">
          {category ? "Save Changes" : "Add Category"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-full"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
