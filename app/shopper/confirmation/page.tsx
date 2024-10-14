'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Confirmation() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'SHOPPER')) {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== 'SHOPPER') {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
      <p>Thank you for your purchase!</p>
      <p>Your order has been successfully placed.</p>
      <div className="mt-4 space-x-4">
        <Button onClick={() => router.push('/shopper/products')}>
          Continue Shopping
        </Button>
        <Button variant="outline" onClick={() => router.push('/shopper/orders')}>
          View Order History
        </Button>
      </div>
    </div>
  );
}
