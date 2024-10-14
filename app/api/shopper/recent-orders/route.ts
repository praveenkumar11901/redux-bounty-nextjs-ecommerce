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
    const recentOrders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            title: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    const formattedOrders = recentOrders.map(order => ({
      id: order.id,
      date: order.createdAt.toISOString(),
      total: order.product.price * order.quantity,
      status: 'Completed', // You might want to add a status field to your Order model
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return NextResponse.json({ error: 'Failed to fetch recent orders' }, { status: 500 });
  }
}
