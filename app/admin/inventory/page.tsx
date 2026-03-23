"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ImageUpload } from "@/components/admin/image-upload";
import type { ProductResponseDTO, ProductCreateDTO, ProductUpdateDTO, CategoryResponseDTO } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  getCategories,
} from "@/lib/api";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(price);
};

export default function InventoryPage() {
  const [productList, setProductList] = useState<ProductResponseDTO[]>([]);
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editProduct, setEditProduct] = useState<ProductResponseDTO | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProductList(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  const filtered = productList.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.includes(search);
    const matchCategory =
      filterCategory === "all" || p.category.id === filterCategory;
    return matchSearch && matchCategory;
  });

  const handleSave = async (productData: ProductCreateDTO | ProductUpdateDTO) => {
    try {
      if (editProduct) {
        const updated = await updateProduct(editProduct.id, productData as ProductUpdateDTO);
        setProductList((prev) =>
          prev.map((p) => (p.id === editProduct.id ? updated : p))
        );
        toast.success(`${updated.name} updated successfully`);
      } else {
        const created = await createProduct(productData as ProductCreateDTO);
        setProductList((prev) => [...prev, created]);
        toast.success(`${created.name} created successfully`);
      }
      setIsDialogOpen(false);
      setEditProduct(null);
    } catch (error: any) {
      console.error("Failed to save product:", error);
      toast.error(error.message || "Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProductList((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      setErrorDialog({ 
        isOpen: true, 
        title: "Action Denied", 
        message: error.message || "Failed to delete product." 
      });
    }
  };

  const handleStockUpdate = async (id: string, newStock: number) => {
    try {
      const updated = await updateProductStock(id, Math.max(0, newStock));
      setProductList((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
      toast.success("Stock updated");
    } catch (error) {
      console.error("Failed to update stock:", error);
      toast.error("Failed to update stock");
    }
  };

  const totalValue = productList.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalItems = productList.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = productList.filter((p) => p.stock <= 5).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading inventory...</p>
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
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Inventory
            </h1>
            <p className="text-muted-foreground">
              Manage your product stock and catalog
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="rounded-full"
                onClick={() => setEditProduct(null)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-background text-foreground max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-foreground">
                  {editProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                product={editProduct}
                categories={categories}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-secondary rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Package className="h-4 w-4" />
              Total Items in Stock
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">{totalItems}</p>
          </div>
          <div className="bg-secondary rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Package className="h-4 w-4" />
              Inventory Value
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatPrice(totalValue)}
            </p>
          </div>
          <div className="bg-secondary rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Low Stock Items
            </div>
            <p className="text-2xl font-bold text-destructive mt-1">
              {lowStockCount}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-sm text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {product.id}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs capitalize bg-secondary px-2 py-1 rounded text-foreground">
                      {product.category.displayName}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-foreground">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() =>
                          handleStockUpdate(product.id, product.stock - 1)
                        }
                        className="h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-accent text-foreground text-sm"
                        type="button"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-foreground">
                        {product.stock}
                      </span>
                      <button
                        onClick={() =>
                          handleStockUpdate(product.id, product.stock + 1)
                        }
                        className="h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-accent text-foreground text-sm"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {product.stock === 0 ? (
                      <span className="text-xs font-bold text-destructive">
                        Out of Stock
                      </span>
                    ) : product.stock <= 5 ? (
                      <span className="text-xs font-bold text-primary">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-green-600">
                        In Stock
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditProduct(product);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
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

function ProductForm({
  product,
  categories,
  onSave,
  onCancel,
}: {
  product: ProductResponseDTO | null;
  categories: CategoryResponseDTO[];
  onSave: (product: ProductCreateDTO | ProductUpdateDTO) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProductCreateDTO | ProductUpdateDTO>(
    product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          categoryId: product.category.id,
          stock: product.stock,
          featured: product.featured,
          bestSeller: product.bestSeller,
        }
      : {
          name: "",
          description: "",
          price: 0,
          image: "",
          categoryId: categories[0]?.id || "",
          stock: 0,
          featured: false,
          bestSeller: false,
        }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      {/* ✅ IMAGE UPLOAD COMPONENT */}
      <ImageUpload
        currentImage={form.image}
        onImageChange={(imageUrl) => setForm({ ...form, image: imageUrl })}
        label="Product Image"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (R)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
            required
          />
        </div>
      </div>

      <div>
        <Label>Category</Label>
        <Select
          value={form.categoryId}
          onValueChange={(v) => setForm({ ...form, categoryId: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="rounded"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={form.bestSeller}
            onChange={(e) =>
              setForm({ ...form, bestSeller: e.target.checked })
            }
            className="rounded"
          />
          Best Seller
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="rounded-full flex-1">
          {product ? "Save Changes" : "Add Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-full bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
