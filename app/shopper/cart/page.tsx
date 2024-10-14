'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CartItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    quantity: number;  // Add this to know the available stock
  };
  quantity: number;
}

export default function Cart() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'SHOPPER')) {
      router.push('/');
    } else {
      fetchCart();
    }
  }, [status, session, router]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      } else {
        setError('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('An unexpected error occurred');
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Prevent negative quantities
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (response.ok) {
        fetchCart(); // Refresh the cart
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update item quantity');
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
      setError('An unexpected error occurred');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
      if (response.ok) {
        fetchCart(); // Refresh the cart
      } else {
        setError('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError('An unexpected error occurred');
    }
  };

  const proceedToCheckout = () => {
    router.push('/shopper/checkout');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== 'SHOPPER') {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="mb-2 p-2 border rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.product.title}</p>
                  <p>Price: ${item.product.price.toFixed(2)}</p>
                  <p>Available: {item.product.quantity}</p>
                </div>
                <div className="flex items-center">
                  <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.product.quantity}>+</Button>
                  <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)} className="ml-2">Remove</Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <p className="font-bold">Total: ${cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}</p>
            <Button onClick={proceedToCheckout} className="mt-2">Proceed to Checkout</Button>
          </div>
        </>
      )}
    </div>
  );
}
