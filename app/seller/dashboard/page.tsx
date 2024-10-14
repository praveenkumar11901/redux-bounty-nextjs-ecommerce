'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  quantity: number;
  product: Product;
}

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'SELLER')) {
      router.push('/');
    } else if (session && session.user.role === 'SELLER') {
      fetchProducts();
      fetchOrders();
    }
  }, [status, session, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        findLowStockProducts(data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('An unexpected error occurred while fetching products');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/seller/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        calculateTotalRevenue(data);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('An unexpected error occurred while fetching orders');
    }
  };

  const calculateTotalRevenue = (orders: Order[]) => {
    const revenue = orders.reduce((sum, order) => sum + order.product.price * order.quantity, 0);
    setTotalRevenue(revenue);
  };

  const findLowStockProducts = (products: Product[]) => {
    const lowStock = products.filter(product => product.quantity < 10);
    setLowStockProducts(lowStock);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== 'SELLER') {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{lowStockProducts.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-x-4">
          <Link href="/seller/products/add">
            <Button>Add New Product</Button>
          </Link>
          <Link href="/seller/products">
            <Button variant="outline">Manage All Products</Button>
          </Link>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Products</h2>
        {products.length === 0 ? (
          <p>You haven't added any products yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 6).map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle>{product.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Price: ${product.price.toFixed(2)}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p className={product.quantity < 10 ? "text-red-500" : ""}>
                    {product.quantity < 10 ? "Low Stock!" : "In Stock"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {products.length > 6 && (
          <div className="mt-4">
            <Link href="/seller/products">
              <Button variant="link">View all products...</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
