'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShoppingBag, ShoppingCart, Clock } from "lucide-react";

interface ShopperStats {
  totalOrders: number;
  totalSpent: number;
  cartItems: number;
}

interface RecentOrder {
  id: string;
  date: string;
  total: number;
  status: string;
}

export default function ShopperDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<ShopperStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'SHOPPER')) {
      router.push('/');
    } else {
      fetchShopperStats();
      fetchRecentOrders();
    }
  }, [status, session, router]);

  const fetchShopperStats = async () => {
    try {
      const response = await fetch('/api/shopper/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Failed to fetch shopper statistics');
      }
    } catch (error) {
      console.error('Error fetching shopper stats:', error);
      setError('An unexpected error occurred');
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('/api/shopper/recent-orders');
      if (response.ok) {
        const data = await response.json();
        setRecentOrders(data);
      } else {
        setError('Failed to fetch recent orders');
      }
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      setError('An unexpected error occurred');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== 'SHOPPER') {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Shopper Dashboard</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalSpent.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.cartItems || 0}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex justify-between items-center">
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                  <span>${order.total.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground">{order.status}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/shopper/products">
              <Button className="w-full">Browse Products</Button>
            </Link>
            <Link href="/shopper/cart">
              <Button className="w-full" variant="outline">View Cart</Button>
            </Link>
            <Link href="/shopper/orders">
              <Button className="w-full" variant="outline">Order History</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
