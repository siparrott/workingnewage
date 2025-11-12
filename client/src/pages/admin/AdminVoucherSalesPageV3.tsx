import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "../../components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  type VoucherProduct, 
  type DiscountCoupon, 
  type VoucherSale,
  insertVoucherProductSchema,
  insertDiscountCouponSchema
} from "@shared/schema";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Package,
  Tag,
  TrendingUp,
  Euro,
  ShoppingCart,
  Gift,
  Percent,
  Calendar,
  Eye,
  Download,
  Settings,
  ArrowRight,
  CheckCircle,
  Users,
  BarChart3,
  Home,
  UserPlus,
  Mail,
  Camera,
  FileText,
  Folder,
  Image,
  MessageSquare,
  Calendar as CalendarIcon,
  CreditCard,
  PieChart,
  Globe,
  Palette
} from "lucide-react";

// Form schemas
const voucherProductFormSchema = insertVoucherProductSchema.extend({
  price: z.string().min(1, "Price is required"),
  validityPeriod: z.string().min(1, "Validity period is required"),
  displayOrder: z.string().optional(),
});

const discountCouponFormSchema = insertDiscountCouponSchema.extend({
  discountValue: z.string().min(1, "Discount value is required"),
  minOrderAmount: z.string().optional(),
  maxDiscountAmount: z.string().optional(),
  usageLimit: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  applicableProductSlug: z.string().optional(),
});

type VoucherProductFormData = z.infer<typeof voucherProductFormSchema>;
type DiscountCouponFormData = z.infer<typeof discountCouponFormSchema>;

export default function AdminVoucherSalesPageV3() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedProduct, setSelectedProduct] = useState<VoucherProduct | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<DiscountCoupon | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  // Admin token helper (read fresh from localStorage each call)
  const getAdminToken = () => (typeof window !== 'undefined' ? (localStorage.getItem('ADMIN_TOKEN') || '') : '');
  const withAdminJsonHeaders = () => ({ 'Content-Type': 'application/json', 'x-admin-token': getAdminToken() });
  const withAdminHeaders = () => ({ 'x-admin-token': getAdminToken() });

  // State for image upload
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Forms
  const productForm = useForm<VoucherProductFormData>({
    resolver: zodResolver(voucherProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      validityPeriod: "",
      isActive: true,
      displayOrder: "0",
      category: "",
      sessionType: "",
    },
  });

  const couponForm = useForm<DiscountCouponFormData>({
    resolver: zodResolver(discountCouponFormSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      isActive: true,
      applicableProductSlug: "",
    },
  });

  // API calls
  const { data: voucherProducts, isLoading: isLoadingProducts, error: productsError } = useQuery<VoucherProduct[]>({
    queryKey: ['/api/vouchers/products'],
    queryFn: async () => {
      const response = await fetch('/api/vouchers/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('📦 [ADMIN] Fetched products:', data.length, data);
      return data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache (updated from cacheTime)
  });
  
  // Debug log for products
  console.log('📊 [ADMIN] Voucher products state:', {
    count: voucherProducts?.length,
    products: voucherProducts,
    isLoading: isLoadingProducts,
    error: productsError
  });

  const { data: discountCoupons, isLoading: isLoadingCoupons } = useQuery<DiscountCoupon[]>({
    queryKey: ['/api/vouchers/coupons'],
    queryFn: async () => {
      const response = await fetch('/api/vouchers/coupons', { headers: withAdminHeaders() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    },
  });

  const { data: voucherSales, isLoading: isLoadingSales } = useQuery<VoucherSale[]>({
    queryKey: ['/api/vouchers/sales'],
    queryFn: async () => {
      const response = await fetch('/api/vouchers/sales', { headers: withAdminHeaders() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    },
  });

  // Calculate statistics
  const stats = {
    totalRevenue: voucherSales?.reduce((sum, sale) => sum + Number(sale.finalAmount), 0) || 0,
    totalSales: voucherSales?.length || 0,
    activeProducts: voucherProducts?.filter(p => p.isActive || p.is_active).length || 0,
    activeCoupons: discountCoupons?.filter(c => c.isActive || c.is_active).length || 0,
    avgOrderValue: voucherSales?.length ? (voucherSales.reduce((sum, sale) => sum + Number(sale.finalAmount), 0) / voucherSales.length) : 0,
    totalDiscountGiven: voucherSales?.reduce((sum, sale) => sum + Number(sale.discountAmount), 0) || 0
  };

  console.log('📊 [STATS] Calculated stats:', stats, 'from products:', voucherProducts?.map(p => ({ name: p.name, isActive: p.isActive, is_active: (p as any).is_active })));

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: async (data: VoucherProductFormData) => {
      const payload = {
        name: data.name,
        description: data.description,
        price: data.price, // Keep as string - backend will handle conversion
        validityPeriod: parseInt(data.validityPeriod),
        displayOrder: parseInt(data.displayOrder || "0"),
        isActive: data.isActive !== undefined ? data.isActive : true,
        category: data.category,
        sessionType: data.sessionType,
        imageUrl: uploadedImage || null,
      };
      console.log('[CREATE PRODUCT] Sending payload:', payload);
      const response = await fetch("/api/vouchers/products", {
        method: "POST",
        headers: withAdminJsonHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to create product:", errorText);
        throw new Error(errorText || `HTTP error ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      // Force refresh all voucher-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/vouchers/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/vouchers/products"] });
      // Reset query cache entirely for voucher products
      queryClient.removeQueries({ queryKey: ["/api/vouchers/products"] });
      setIsProductDialogOpen(false);
      productForm.reset();
      alert("Voucher product created successfully!");
      // Force page refresh to ensure data is loaded
      window.location.reload();
    },
    onError: (error) => {
      console.error("Failed to create voucher product:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Failed to create voucher product: ${errorMessage}`);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: VoucherProductFormData & { id: string }) => {
      const payload = {
        name: data.name,
        description: data.description,
        price: data.price, // Keep as string - backend will handle conversion
        validityPeriod: parseInt(data.validityPeriod),
        displayOrder: parseInt(data.displayOrder || "0"),
        isActive: data.isActive,
        category: data.category,
        sessionType: data.sessionType,
        imageUrl: uploadedImage || data.imageUrl || null,
      };
      console.log('[UPDATE PRODUCT] Sending payload:', payload);
      const response = await fetch(`/api/vouchers/products/${data.id}`, {
        method: "PUT",
        headers: withAdminJsonHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update product:", errorText);
        throw new Error(errorText || `HTTP error ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      // Force refresh all voucher-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/vouchers/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/vouchers/products"] });
      queryClient.removeQueries({ queryKey: ["/api/vouchers/products"] });
      setIsProductDialogOpen(false);
      setSelectedProduct(null);
      setUploadedImage(null);
      productForm.reset();
      alert("Voucher product updated successfully!");
      // Force page refresh to ensure data is loaded
      window.location.reload();
    },
    onError: (error) => {
      // console.error removed
      alert("Failed to update voucher product");
    },
  });

  const createCouponMutation = useMutation({
    mutationFn: async (data: DiscountCouponFormData) => {
      const response = await fetch("/api/vouchers/coupons", {
        method: "POST",
        headers: withAdminJsonHeaders(),
        body: JSON.stringify({
          ...data,
          discountValue: data.discountValue,
          minOrderAmount: data.minOrderAmount || undefined,
          maxDiscountAmount: data.maxDiscountAmount || undefined,
          usageLimit: data.usageLimit ? parseInt(data.usageLimit) : undefined,
          applicableProductSlug: data.applicableProductSlug || undefined,
        }),
      });
      if (!response.ok) throw new Error("Failed to create coupon");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vouchers/coupons"] });
      setIsCouponDialogOpen(false);
      couponForm.reset();
      alert("Discount coupon created successfully!");
    },
    onError: (error) => {
      // console.error removed
      alert("Failed to create discount coupon");
    },
  });

  const updateCouponMutation = useMutation({
    mutationFn: async (payload: DiscountCouponFormData & { id: string }) => {
      const response = await fetch(`/api/vouchers/coupons/${payload.id}`, {
        method: 'PUT',
        headers: withAdminJsonHeaders(),
        body: JSON.stringify({
          ...payload,
          discountValue: payload.discountValue,
          minOrderAmount: payload.minOrderAmount || undefined,
          maxDiscountAmount: payload.maxDiscountAmount || undefined,
          usageLimit: payload.usageLimit ? parseInt(payload.usageLimit) : undefined,
          applicableProductSlug: payload.applicableProductSlug || undefined,
        }),
      });
      if (!response.ok) throw new Error('Failed to update coupon');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vouchers/coupons"] });
      setIsCouponDialogOpen(false);
      setSelectedCoupon(null);
      couponForm.reset();
      alert('Discount coupon updated successfully!');
    },
    onError: () => {
      alert('Failed to update discount coupon');
    }
  });

  // Image upload handler
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: withAdminHeaders(),
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      
      const data = await response.json();
      setUploadedImage(data.url);
    } catch (error) {
      // console.error removed
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Handlers
  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setUploadedImage(null);
    setIsProductDialogOpen(false); // Close first
    setTimeout(() => {
      productForm.reset({
        name: "",
        description: "",
        price: "0",
        validityPeriod: "0",
        isActive: true,
        displayOrder: "0",
        category: "",
        sessionType: "",
      });
      setIsProductDialogOpen(true); // Then open
    }, 50);
  };

  const handleEditProduct = (product: VoucherProduct) => {
    setSelectedProduct(product);
    setUploadedImage(product.imageUrl);
    productForm.reset({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      validityPeriod: product.validityPeriod?.toString() || "365",
      isActive: product.isActive,
      displayOrder: product.displayOrder?.toString() || "0",
      category: product.category || "",
      sessionType: product.sessionType || "",
    });
    setIsProductDialogOpen(true);
  };

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/vouchers/products/${id}`, {
        method: "DELETE",
        headers: withAdminHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vouchers/products"] });
    },
  });

  const handleDeleteProduct = (product: VoucherProduct) => {
    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      deleteProductMutation.mutate(product.id);
    }
  };

  const handleCreateCoupon = () => {
    setSelectedCoupon(null);
    couponForm.reset();
    setIsCouponDialogOpen(true);
  };

  const handleEditCoupon = (coupon: DiscountCoupon) => {
    setSelectedCoupon(coupon);
    couponForm.reset({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || "",
      discountType: coupon.discountType as "percentage" | "fixed_amount",
      discountValue: coupon.discountValue.toString(),
      minOrderAmount: coupon.minOrderAmount?.toString() || "",
      maxDiscountAmount: coupon.maxDiscountAmount?.toString() || "",
      usageLimit: coupon.usageLimit?.toString() || "",
      startDate: coupon.startDate ? coupon.startDate.toString() : "",
      endDate: coupon.endDate ? coupon.endDate.toString() : "",
      isActive: coupon.isActive,
      applicableProductSlug: (coupon as any).applicableProducts?.[0] || "",
    });
    setIsCouponDialogOpen(true);
  };

  const handleProductSubmit = (data: VoucherProductFormData) => {
    if (selectedProduct) {
      updateProductMutation.mutate({ ...data, id: selectedProduct.id });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleCouponSubmit = (data: DiscountCouponFormData) => {
    if (selectedCoupon) {
      updateCouponMutation.mutate({ ...data, id: selectedCoupon.id });
    } else {
      createCouponMutation.mutate(data);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Voucher & Sales Management</h1>
              <p className="text-gray-600 mt-1">Manage voucher products, discount codes, and track sales performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-8 px-6" aria-label="Voucher Management">
              <button
                onClick={() => setActiveView("dashboard")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeView === "dashboard"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </div>
              </button>
              <button
                onClick={() => setActiveView("products")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeView === "products"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Products ({stats.activeProducts})
                </div>
              </button>
              <button
                onClick={() => setActiveView("coupons")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeView === "coupons"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Coupons ({stats.activeCoupons})
                </div>
              </button>
              <button
                onClick={() => setActiveView("sales")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeView === "sales"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Sales ({stats.totalSales})
                </div>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 bg-white">
            {activeView === "dashboard" && (
              <DashboardView 
                stats={stats} 
                onCreateProduct={handleCreateProduct}
                onCreateCoupon={handleCreateCoupon}
                recentSales={voucherSales?.slice(0, 5) || []}
              />
            )}
            {activeView === "products" && (
              <ProductsView 
                products={voucherProducts || []} 
                isLoading={isLoadingProducts}
                onCreateProduct={handleCreateProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            )}
            {activeView === "coupons" && (
              <CouponsView 
                coupons={discountCoupons || []} 
                isLoading={isLoadingCoupons}
                onCreateCoupon={handleCreateCoupon}
                onEditCoupon={handleEditCoupon}
              />
            )}
            {activeView === "sales" && (
              <SalesView 
                sales={voucherSales || []} 
                isLoading={isLoadingSales}
              />
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ProductDialog 
        key={selectedProduct?.id || 'new'}
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        product={selectedProduct}
        onSubmit={handleProductSubmit}
        form={productForm}
        uploadedImage={uploadedImage}
        onImageUpload={handleImageUpload}
        isUploading={isUploading}
      />
      <CouponDialog 
        open={isCouponDialogOpen}
        onOpenChange={setIsCouponDialogOpen}
        coupon={selectedCoupon}
        onSubmit={handleCouponSubmit}
        form={couponForm}
      />
    </AdminLayout>
  );
}

// Dashboard View Component
const DashboardView: React.FC<{
  stats: any;
  onCreateProduct: () => void;
  onCreateCoupon: () => void;
  recentSales: VoucherSale[];
}> = ({ stats, onCreateProduct, onCreateCoupon, recentSales }) => {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Total Revenue</CardTitle>
            <Euro className="h-4 w-4 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-blue-100">From {stats.totalSales} sales</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Products</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeProducts}</div>
            <p className="text-xs text-gray-600">Available for sale</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Coupons</CardTitle>
            <Tag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeCoupons}</div>
            <p className="text-xs text-gray-600">Currently valid</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">€{stats.avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-gray-600">Per voucher sale</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="cursor-pointer" onClick={onCreateProduct}>
          <Card className="bg-white border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors hover:bg-blue-50">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-gray-900">Create New Voucher Product</CardTitle>
            <CardDescription className="text-gray-700">
              Set up a new photography voucher package for customers to purchase
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={onCreateProduct} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Voucher Product
            </Button>
          </CardContent>
        </Card>
        </div>

        <div className="cursor-pointer" onClick={onCreateCoupon}>
          <Card className="bg-white border-2 border-dashed border-purple-300 hover:border-purple-500 transition-colors hover:bg-purple-50">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-gray-900">Create Discount Coupon</CardTitle>
            <CardDescription className="text-gray-700">
              Generate promotional codes for special offers and campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={onCreateCoupon} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Discount Coupon
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Latest voucher purchases from customers</CardDescription>
        </CardHeader>
        <CardContent>
          {recentSales.length > 0 ? (
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Gift className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{sale.purchaserName}</p>
                      <p className="text-sm text-gray-500">{sale.voucherCode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{Number(sale.finalAmount).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{new Date(sale.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No sales yet. Create voucher products to start selling.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Products View Component
const ProductsView: React.FC<{
  products: VoucherProduct[];
  isLoading: boolean;
  onCreateProduct: () => void;
  onEditProduct: (product: VoucherProduct) => void;
  onDeleteProduct: (product: VoucherProduct) => void;
}> = ({ products, isLoading, onCreateProduct, onEditProduct, onDeleteProduct }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Product Catalog</h2>
          <p className="text-gray-600">Manage your photography voucher offerings</p>
        </div>
        <Button onClick={onCreateProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={(product.isActive || (product as any).is_active) ? "default" : "secondary"}>
                        {(product.isActive || (product as any).is_active) ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">
                        {product.validityPeriod || (product as any).validity_period ? Math.floor(((product.validityPeriod || (product as any).validity_period) / 30)) : 12} months
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">€{product.price}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{product.description}</p>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditProduct(product)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDeleteProduct(product)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`/vouchers/${product.id}`, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No voucher products yet</h3>
            <p className="text-gray-600 mb-6">Create your first voucher product to start selling photography packages</p>
            <Button onClick={onCreateProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Coupons View Component  
const CouponsView: React.FC<{
  coupons: DiscountCoupon[];
  isLoading: boolean;
  onCreateCoupon: () => void;
  onEditCoupon: (coupon: DiscountCoupon) => void;
}> = ({ coupons, isLoading, onCreateCoupon, onEditCoupon }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Coupon Management</h2>
          <p className="text-gray-600">Create and manage promotional discount codes</p>
        </div>
        <Button onClick={onCreateCoupon}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {coupons.length > 0 ? (
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <code className="bg-gray-100 px-3 py-1 rounded text-lg font-mono font-bold">
                        {coupon.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(coupon.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{coupon.name}</CardTitle>
                    <CardDescription>{coupon.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant={coupon.isActive ? "default" : "secondary"} className="mb-2">
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      Used: {coupon.usageCount} / {coupon.usageLimit || "∞"}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  <div className="flex items-center space-x-1">
                    <Percent className="h-4 w-4 text-gray-400" />
                    <span>
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}% off`
                        : `€${coupon.discountValue} off`
                      }
                    </span>
                  </div>
                  {coupon.minOrderAmount && (
                    <div className="flex items-center space-x-1">
                      <Euro className="h-4 w-4 text-gray-400" />
                      <span>Min: €{coupon.minOrderAmount}</span>
                    </div>
                  )}
                  {coupon.endDate && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Expires: {new Date(coupon.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditCoupon(coupon)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No discount coupons yet</h3>
            <p className="text-gray-600 mb-6">Create promotional codes to offer discounts to your customers</p>
            <Button onClick={onCreateCoupon}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Coupon
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Sales View Component
const SalesView: React.FC<{
  sales: VoucherSale[];
  isLoading: boolean;
}> = ({ sales, isLoading }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportToCSV = () => {
    if (sales.length === 0) return;
    
    // Create CSV content
    const headers = ['Voucher Code', 'Product', 'Purchaser Name', 'Purchaser Email', 'Recipient Name', 'Recipient Email', 'Gift Message', 'Original Amount', 'Discount', 'Final Amount', 'Status', 'Date'];
    const rows = sales.map((sale: any) => [
      sale.voucherCode || '',
      sale.product_name || 'Unknown Product',
      sale.purchaserName || '',
      sale.purchaserEmail || '',
      sale.recipientName || '',
      sale.recipientEmail || '',
      sale.giftMessage || '',
      Number(sale.originalAmount || 0).toFixed(2),
      Number(sale.discountAmount || 0).toFixed(2),
      Number(sale.finalAmount || 0).toFixed(2),
      sale.paymentStatus || 'pending',
      new Date(sale.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `voucher-sales-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setShowExportMenu(false);
  };

  const exportToPDF = () => {
    if (sales.length === 0) return;
    
    // Create a printable HTML report
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Voucher Sales Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; border-bottom: 2px solid #666; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; }
          th { background-color: #f4f4f4; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .summary { margin: 20px 0; padding: 15px; background: #f0f0f0; border-radius: 5px; }
          .summary-item { display: inline-block; margin-right: 30px; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Voucher Sales Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        
        <div class="summary">
          <div class="summary-item"><strong>Total Sales:</strong> ${sales.length}</div>
          <div class="summary-item"><strong>Total Revenue:</strong> €${sales.reduce((sum: number, s: any) => sum + Number(s.finalAmount || 0), 0).toFixed(2)}</div>
          <div class="summary-item"><strong>Paid:</strong> ${sales.filter((s: any) => s.paymentStatus === 'paid' || s.paymentStatus === 'completed').length}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Voucher Code</th>
              <th>Product</th>
              <th>Purchaser</th>
              <th>Recipient</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${sales.map((sale: any) => `
              <tr>
                <td>${sale.voucherCode || ''}</td>
                <td>${sale.product_name || 'Unknown Product'}</td>
                <td>${sale.purchaserName || ''}<br/><small>${sale.purchaserEmail || ''}</small></td>
                <td>${sale.recipientName || 'Self-purchase'}<br/><small>${sale.recipientEmail || ''}</small></td>
                <td>€${Number(sale.finalAmount || 0).toFixed(2)}</td>
                <td>${sale.paymentStatus || 'pending'}</td>
                <td>${new Date(sale.createdAt).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          New Age Fotografie - Voucher Sales Report<br/>
          www.newagefotografie.com
        </div>
      </body>
      </html>
    `;
    
    // Open in new window for printing/PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
    setShowExportMenu(false);
  };

  // Close export menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExportMenu) {
        setShowExportMenu(false);
      }
    };
    
    if (showExportMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showExportMenu]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Sales History</h2>
          <p className="text-gray-600">Track all voucher sales and customer orders</p>
        </div>
        <div className="relative">
          <Button 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setShowExportMenu(!showExportMenu);
            }}
            disabled={sales.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Sales
          </Button>
          {showExportMenu && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    exportToCSV();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="h-4 w-4 inline mr-2" />
                  Export as CSV
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    exportToPDF();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Download className="h-4 w-4 inline mr-2" />
                  Export as PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {sales.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Voucher Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchaser
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gift Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Final Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => {
                    // Type assertion to access extended properties from the JOIN
                    const saleWithProduct = sale as any;
                    const productName = saleWithProduct.product_name || 'Unknown Product';
                    const productSku = saleWithProduct.product_sku || 'demo';
                    
                    // Build PDF download URL
                    const pdfUrl = `/voucher/pdf/preview?` +
                      `sku=${encodeURIComponent(productSku)}&` +
                      `name=${encodeURIComponent(sale.recipientName || sale.purchaserName)}&` +
                      `from=${encodeURIComponent(sale.purchaserName)}&` +
                      `message=${encodeURIComponent(sale.giftMessage || 'Thank you for your purchase!')}&` +
                      `amount=${sale.finalAmount}&` +
                      `voucher_id=${encodeURIComponent(sale.voucherCode)}`;

                    return (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                            {sale.voucherCode}
                          </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{productName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">{sale.purchaserName}</div>
                            <div className="text-sm text-gray-500">{sale.purchaserEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {sale.recipientName ? (
                            <div>
                              <div className="font-medium text-gray-900">{sale.recipientName}</div>
                              {sale.recipientEmail && (
                                <div className="text-sm text-gray-500">{sale.recipientEmail}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Self-purchase</span>
                          )}
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          {sale.giftMessage ? (
                            <div className="text-sm text-gray-900 truncate" title={sale.giftMessage}>
                              "{sale.giftMessage}"
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">No message</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            €{Number(sale.finalAmount).toFixed(2)}
                          </div>
                          {sale.discountAmount && Number(sale.discountAmount) > 0 && (
                            <div className="text-xs text-gray-500">
                              (€{Number(sale.originalAmount).toFixed(2)} - €{Number(sale.discountAmount).toFixed(2)})
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={sale.paymentStatus === 'paid' || sale.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                            {sale.paymentStatus || 'pending'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(sale.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(pdfUrl, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sales yet</h3>
            <p className="text-gray-600">Voucher sales will appear here once customers start purchasing</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Product Dialog Component
const ProductDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: VoucherProduct | null;
  onSubmit: (data: VoucherProductFormData) => void;
  form: any;
  uploadedImage: string | null;
  onImageUpload: (file: File) => void;
  isUploading: boolean;
}> = ({ open, onOpenChange, product, onSubmit, form, uploadedImage, onImageUpload, isUploading }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (uploadedImage) {
      setImagePreview(uploadedImage);
    } else {
      setImagePreview(null);
    }
  }, [uploadedImage]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload to server
      await onImageUpload(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white border-2 shadow-2xl">
          <DialogHeader>
            <DialogTitle>
              {product ? 'Edit Voucher Product' : 'Create New Voucher Product'}
            </DialogTitle>
          <DialogDescription>
            {product 
              ? 'Update the details of this voucher product including promotional images'
              : 'Create a new voucher product that customers can purchase with promotional imagery'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Product Image Upload */}
          <div className="space-y-3">
            <Label htmlFor="product-image" className="text-base font-medium">Product Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('product-image')?.click()}
                    className="w-full"
                    disabled={isUploading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Change Image'}
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Upload a promotional image for this voucher</p>
                    <p className="text-xs text-gray-500">Recommended: 400x300px, JPG or PNG, max 2MB</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('product-image')?.click()}
                    className="mt-4"
                    disabled={isUploading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
              )}
              <input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input 
                {...form.register("name")}
                placeholder="e.g., Family Photo Session Voucher"
                className="bg-white"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (€)</Label>
              <Input 
                {...form.register("price")}
                type="number" 
                step="0.01"
                placeholder="199.00"
                className="bg-white"
                onFocus={(e) => e.target.select()}
              />
              {form.formState.errors.price && (
                <p className="text-sm text-red-600">{form.formState.errors.price.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              {...form.register("description")}
              placeholder="Describe what's included in this voucher package..."
              rows={4}
              className="bg-white resize-none"
            />
          </div>

          {/* Additional Settings */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="validityPeriod">Validity (Days)</Label>
              <Input 
                {...form.register("validityPeriod")}
                type="number" 
                placeholder="365"
                className="bg-white"
                onFocus={(e) => e.target.select()}
              />
              {form.formState.errors.validityPeriod && (
                <p className="text-sm text-red-600">{form.formState.errors.validityPeriod.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input 
                {...form.register("displayOrder")}
                type="number" 
                placeholder="1"
                className="bg-white"
              />
            </div>
            <div className="space-y-2 flex items-center space-x-2 pt-6">
              <Switch 
                checked={form.watch("isActive")}
                onCheckedChange={(checked) => form.setValue("isActive", checked)}
              />
              <Label className="font-medium">Active for sale</Label>
            </div>
          </div>

          {/* Category and Target Audience */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                onValueChange={(value) => form.setValue("category", value)} 
                defaultValue={form.watch("category") || "familie"}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="familie">Familie</SelectItem>
                  <SelectItem value="baby">Baby & Newborn</SelectItem>
                  <SelectItem value="hochzeit">Hochzeit</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionType">Session Type</Label>
              <Input 
                {...form.register("sessionType")}
                placeholder="e.g., Familie Portrait, Business Headshots"
                className="bg-white"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="pt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

// Coupon Dialog Component
const CouponDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: DiscountCoupon | null;
  onSubmit: (data: DiscountCouponFormData) => void;
  form: any;
}> = ({ open, onOpenChange, coupon, onSubmit, form }) => {
  const { data: products } = useQuery<VoucherProduct[]>({ queryKey: ['/api/vouchers/products'] });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent className="sm:max-w-[600px] bg-white border-2 shadow-2xl">
          <DialogHeader>
            <DialogTitle>
              {coupon ? 'Edit Discount Coupon' : 'Create New Discount Coupon'}
            </DialogTitle>
          <DialogDescription>
            {coupon 
              ? 'Update the details of this discount coupon'
              : 'Create a new discount coupon for promotional campaigns'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input 
                id="code" 
                placeholder="e.g., WELCOME15"
                {...form.register('code')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon-name">Coupon Name</Label>
              <Input 
                id="coupon-name" 
                placeholder="e.g., Welcome Discount"
                {...form.register('name')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coupon-description">Description</Label>
            <Textarea 
              id="coupon-description" 
              placeholder="Describe this discount offer..."
              rows={2}
              {...form.register('description')}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount-type">Discount Type</Label>
              <Select 
                value={form.watch('discountType') || 'percentage'}
                onValueChange={(val) => form.setValue('discountType', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed_amount">Fixed Amount (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-value">Discount Value</Label>
              <Input 
                id="discount-value" 
                type="number" 
                placeholder="15"
                {...form.register('discountValue')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-order">Min Order (€)</Label>
              <Input 
                id="min-order" 
                type="number" 
                placeholder="100"
                {...form.register('minOrderAmount')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Applicable Product (optional)</Label>
            <Select
              value={form.watch('applicableProductSlug') || ''}
              onValueChange={(val) => form.setValue('applicableProductSlug', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All products</SelectItem>
                {products?.map((p) => (
                  <SelectItem key={p.id} value={(p as any).slug || (p as any).productSlug || p.name.toLowerCase().replace(/\s+/g,'-')}>
                    {p.name}
                  </SelectItem>
                ))}
                <SelectItem value="family-basic">Family Basic</SelectItem>
                <SelectItem value="newborn-basic">Newborn Basic</SelectItem>
                <SelectItem value="maternity-basic">Maternity Basic</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Leave empty for all products. Select one to restrict the coupon.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usage-limit">Usage Limit</Label>
              <Input 
                id="usage-limit" 
                type="number" 
                placeholder="100"
                {...form.register('usageLimit')}
              />
            </div>
            <div className="space-y-2 flex items-center space-x-2 pt-6">
              <Switch 
                id="coupon-active" 
                checked={!!form.watch('isActive')}
                onCheckedChange={(val) => form.setValue('isActive', val)}
              />
              <Label htmlFor="coupon-active">Active</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
            {coupon ? 'Update Coupon' : 'Create Coupon'}
          </Button>
        </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};