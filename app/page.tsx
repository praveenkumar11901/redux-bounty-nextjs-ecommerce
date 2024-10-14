'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our E-Commerce Platform</h1>
      {status === 'authenticated' ? (
        <div>
          <p className="mb-4">Hello, {session.user.name}!</p>
          {session.user.role === 'ADMIN' && (
            <Link href="/admin/dashboard">
              <Button>Go to Admin Dashboard</Button>
            </Link>
          )}
          {session.user.role === 'SELLER' && (
            <Link href="/seller/dashboard">
              <Button>Go to Seller Dashboard</Button>
            </Link>
          )}
          {session.user.role === 'SHOPPER' && (
            <Link href="/shopper/dashboard">
              <Button>Go to Shopper Dashboard</Button>
            </Link>
          )}
        </div>
      ) : (
        <div>
          <p className="mb-4">Please log in or register to get started.</p>
          <Link href="/login">
            <Button className="mr-2">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Register</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
