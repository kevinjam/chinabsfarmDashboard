// src/app/components/Header.tsx
'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  onSignOut: () => void; // Function to handle sign-out
}

export default function Header({ onSignOut }: HeaderProps) {
  const { data: session } = useSession();
  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = () => {
    setIsProfilePopoverOpen(!isProfilePopoverOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfilePopoverOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileRef]);

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
      <div className="flex items-center space-x-4 relative">
        <div className="flex items-center cursor-pointer" onClick={handleProfileClick}>
          <Image
            src="/images/logo/avatar.png"
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full mr-2"
          />
          <span className="text-gray-700">{session?.user?.name}</span>
        </div>

        {isProfilePopoverOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div className="px-4 py-2">
                <p className="text-sm font-semibold text-gray-900">{session?.user?.name}</p>
              </div>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Edit profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Account settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Support
              </a>
              <button
                onClick={onSignOut} // Use the prop here
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}