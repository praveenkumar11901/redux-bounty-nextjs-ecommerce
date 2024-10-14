'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export default function ShopperProducts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'SHOPPER')) {
      router.push('/');
    } else {
      fetchProducts();
    }
  }, [status, session, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/all');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (response.ok) {
        alert('Product added to cart');
      } else {
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const buyNow = (productId: string) => {
    router.push(`/shopper/checkout?productId=${productId}`);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== 'SHOPPER') {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Products</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id} className="mb-4 p-4 border rounded">
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p>Price: ${product.price}</p>
              <p>Available: {product.quantity}</p>
              <div className="mt-2">
                <Button onClick={() => addToCart(product.id)} className="mr-2">Add to Cart</Button>
                <Button onClick={() => buyNow(product.id)}>Buy Now</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
