import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SHOPPER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [totalOrders, orders, cartItems] = await Promise.all([
      prisma.order.count({
        where: { userId: session.user.id },
      }),
      prisma.order.findMany({
        where: { userId: session.user.id },
        include: { product: true },
      }),
      prisma.cartItem.count({
        where: { cart: { userId: session.user.id } },
      }),
    ]);

    const totalSpent = orders.reduce((sum, order) => sum + (order.product.price * order.quantity), 0);

    return NextResponse.json({
      totalOrders,
      totalSpent,
      cartItems,
    });
  } catch (error) {
    console.error('Error fetching shopper stats:', error);
    return NextResponse.json({ error: 'Failed to fetch shopper statistics' }, { status: 500 });
  }
}
