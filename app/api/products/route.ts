import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      where: { sellerId: session.user.id },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  console.log('Full Session in POST:', JSON.stringify(session, null, 2));
  console.log('Session User:', session?.user);
  console.log('Session User ID:', session?.user?.id);

  if (!session || !session.user || session.user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized', session: session }, { status: 401 });
  }

  if (!session.user.id) {
    console.error('User ID is missing from the session');
    return NextResponse.json({ error: 'User ID is missing', session: session }, { status: 500 });
  }

  try {
    const { title, price, quantity } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const product = await prisma.product.create({
      data: {
        title,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        sellerId: session.user.id,
      },
    });
    console.log('Product created successfully:', product);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product', details: error }, { status: 500 });
  }
}
