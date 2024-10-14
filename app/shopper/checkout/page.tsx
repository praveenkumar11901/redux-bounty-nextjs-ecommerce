'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
  };
  quantity: number;
}

export default function Checkout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'SHOPPER')) {
      router.push('/');
    } else {
      const productId = searchParams.get('productId');
      if (productId) {
        fetchProduct(productId);
      } else {
        fetchCart();
      }
    }
  }, [status, session, router, searchParams]);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const product = await response.json();
        setCartItems([{ id: 'single-item', product, quantity: 1 }]);
        setTotal(product.price);
      } else {
        console.error('Failed to fetch product');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const cart = await response.json();
        setCartItems(cart.items);
        setTotal(cart.items.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0));
      } else {
        console.error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems }),
      });
      if (response.ok) {
        router.push('/shopper/confirmation');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Checkout failed');
        console.error('Checkout failed:', errorData);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('An unexpected error occurred during checkout');
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
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul>
        {cartItems.map((item) => (
          <li key={item.id} className="mb-2">
            {item.product.title} - Quantity: {item.quantity} - ${item.product.price * item.quantity}
          </li>
        ))}
      </ul>
      <p className="font-bold mt-4">Total: ${total}</p>
      <Button onClick={handleCheckout} className="mt-4">Complete Purchase</Button>
    </div>
  );
}
