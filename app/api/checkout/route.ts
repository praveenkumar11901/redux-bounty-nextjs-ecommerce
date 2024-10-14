import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SHOPPER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { cartItems } = await req.json();

    // Create an order for each cart item
    const orders = await Promise.all(
      cartItems.map(async (item: any) => {
        const order = await prisma.order.create({
          data: {
            userId: session.user.id,
            productId: item.product.id,
            quantity: item.quantity,
          },
        });

        // Update product quantity
        await prisma.product.update({
          where: { id: item.product.id },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });

        return order;
      })
    );

    // Clear the user's cart
    await prisma.cartItem.deleteMany({
      where: { cart: { userId: session.user.id } },
    });

    return NextResponse.json({ message: 'Checkout successful', orders });
  } catch (error) {
    console.error('Error during checkout:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
