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

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Determine user role (default to 'customer' if not specified)
  interface User {
    role?: string;
  }

  const userRole = (session?.user as User)?.role || 'customer';
  const isAdmin = userRole === 'admin';

  // Menu items based on role
  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1"
          />
        </svg>
      ),
      visible: isAdmin,
    },
    {
      name: 'Calendar',
      href: '/dashboard/calendar',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      visible: isAdmin,
    },
    {
      name: 'Eggs',
      href: '/dashboard/eggs',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      visible: true, // Visible to both admins and customers
    },
    {
      name: 'Stock',
      href: '/dashboard/stock',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0H4"
          />
        </svg>
      ),
      visible: isAdmin,
    },
    {
      name: 'Purchase',
      href: '/dashboard/purchase',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h18M9 3v18m6-18v18M3 9h18M3 15h18"
          />
        </svg>
      ),
      visible: isAdmin,
    },
    {
      name: 'Blog',
      href: '/dashboard/blog',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      visible: isAdmin,
    },
  ];

  const supportMenu = {
    name: 'Support Chat',
    href: '/dashboard/chat',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
    visible: isAdmin,
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Please log in.</p>;

  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden p-4">
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

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 transform transition-transform duration-300 ease-in-out lg:static lg:transform-none ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 z-50`}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-semibold">ChinabsFarm</span>
            <button onClick={toggleSidebar} className="lg:hidden text-white focus:outline-none">
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
          <nav>
            <ul className="space-y-2">
              {menuItems
                .filter((item) => item.visible)
                .map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center p-2 rounded-md hover:bg-gray-700"
                      onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click (mobile)
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
          {supportMenu.visible && (
            <div className="mt-auto">
              <p className="text-sm text-gray-400">Support</p>
              <Link
                href={supportMenu.href}
                className="flex items-center p-2 rounded-md hover:bg-gray-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                {supportMenu.icon}
                {supportMenu.name}
              </Link>
            </div>
          )}
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}