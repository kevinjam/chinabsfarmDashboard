'use client';

import { ReactNode, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 

  // Log session for debugging
  console.log('DashboardLayout - Status:', status, 'Session:', session);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Unauthenticated: Render only children
  if (status === 'unauthenticated') {
    console.log('Rendering unauthenticated view (no sidebar)');
    return (
      <SessionProvider>
        <div className="min-h-screen bg-gray-50">{children}</div>
      </SessionProvider>
    );
  }

  // Authenticated: Define user role and sidebar
  interface User {
    role?: string;
  }

  const userRole = (session?.user as User)?.role || 'customer';
  const isAdmin = userRole === 'admin';
  console.log('User Role:', userRole, 'Is Admin:', isAdmin);

  // Menu items with icons
  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1',
      visible: isAdmin,
    },
    {
      name: 'Calendar',
      href: '/dashboard/calendar',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      visible: isAdmin,
    },
    {
      name: 'Eggs',
      href: '/dashboard/eggs',
      icon: 'M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0H4',
      visible: true,
    },
    {
      name: 'Stock',
      href: '/dashboard/stock',
      icon: 'M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0H4',
      visible: isAdmin,
    },
    {
      name: 'Purchase',
      href: '/dashboard/purchase',
      icon: 'M3 3h18M9 3v18m6-18v18M3 9h18M3 15h18',
      visible: isAdmin,
    },
    {
      name: 'Blog',
      href: '/dashboard/blog',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      visible: isAdmin,
    },
  ];

  const supportMenu = {
    name: 'Support Chat',
    href: '/dashboard/chat',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    visible: isAdmin,
  };

  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white transform transition-transform duration-300 ease-in-out lg:static lg:transform-none ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 z-50 shadow-xl`}
        >
          {/* Logo/Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-700/50">
            <span className="text-2xl font-bold tracking-tight text-purple-300">ChinabsFarm</span>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-1">
              {menuItems
                .filter((item) => item.visible)
                .map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center p-3 rounded-lg text-gray-200 hover:bg-purple-700/50 hover:text-white transition-all duration-200 text-sm font-medium"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <svg
                        className="h-5 w-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          {/* Support Section */}
          {supportMenu.visible && (
            <div className="p-4 mt-auto border-t border-gray-700/50">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Support</p>
              <Link
                href={supportMenu.href}
                className="flex items-center p-3 rounded-lg text-gray-200 hover:bg-purple-700/50 hover:text-white transition-all duration-200 text-sm font-medium"
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg
                  className="h-5 w-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={supportMenu.icon} />
                </svg>
                {supportMenu.name}
              </Link>
            </div>
          )}
        </aside>

        {/* Mobile Hamburger Menu */}
        <div className="lg:hidden p-4 fixed top-0 left-0 z-40 bg-gray-50">
          <button onClick={toggleSidebar} className="text-gray-800 focus:outline-none">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 lg:hidden z-30"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}