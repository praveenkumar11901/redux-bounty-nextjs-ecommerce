'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

export function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold">E-Commerce App</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {status === 'authenticated' ? (
                <>
                  <NavLink href="/">Home</NavLink>
                  {session.user.role === 'ADMIN' && (
                    <NavLink href="/admin/dashboard">Admin Dashboard</NavLink>
                  )}
                  {session.user.role === 'SELLER' && (
                    <>
                      <NavLink href="/seller/dashboard">Seller Dashboard</NavLink>
                      <NavLink href="/seller/products">Manage Products</NavLink>
                    </>
                  )}
                  {session.user.role === 'SHOPPER' && (
                    <>
                      <NavLink href="/shopper/dashboard">Shopper Dashboard</NavLink>
                      <NavLink href="/shopper/products">Browse Products</NavLink>
                      <NavLink href="/shopper/cart">
                        <ShoppingCart className="inline-block mr-1" size={18} />
                        Cart
                      </NavLink>
                      <NavLink href="/shopper/orders">Order History</NavLink>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => signOut()}
                    className="text-white hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <NavLink href="/">Home</NavLink>
                  <NavLink href="/login">Login</NavLink>
                  <NavLink href="/register">Register</NavLink>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {status === 'authenticated' ? (
              <>
                <MobileNavLink href="/">Home</MobileNavLink>
                {session.user.role === 'ADMIN' && (
                  <MobileNavLink href="/admin/dashboard">Admin Dashboard</MobileNavLink>
                )}
                {session.user.role === 'SELLER' && (
                  <>
                    <MobileNavLink href="/seller/dashboard">Seller Dashboard</MobileNavLink>
                    <MobileNavLink href="/seller/products">Manage Products</MobileNavLink>
                  </>
                )}
                {session.user.role === 'SHOPPER' && (
                  <>
                    <MobileNavLink href="/shopper/dashboard">Shopper Dashboard</MobileNavLink>
                    <MobileNavLink href="/shopper/products">Browse Products</MobileNavLink>
                    <MobileNavLink href="/shopper/cart">
                      <ShoppingCart className="inline-block mr-1" size={18} />
                      Cart
                    </MobileNavLink>
                    <MobileNavLink href="/shopper/orders">Order History</MobileNavLink>
                  </>
                )}
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:bg-purple-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink href="/">Home</MobileNavLink>
                <MobileNavLink href="/login">Login</MobileNavLink>
                <MobileNavLink href="/register">Register</MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-white hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:bg-purple-700">
      {children}
    </Link>
  );
}
