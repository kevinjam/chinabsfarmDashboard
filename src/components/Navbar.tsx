// src/components/Navbar.tsx
import Link from 'next/link';
import { FaHome, FaBlog, FaQuestionCircle } from 'react-icons/fa'; // Example icons

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">
          ChinabsFarm Dashboard
        </Link>
        <div className="flex space-x-4">
          <Link href="/dashboard" className="flex items-center">
            <FaHome className="mr-1" /> Home
          </Link>
          <Link href="/dashboard/blog" className="flex items-center">
            <FaBlog className="mr-1" /> Blog
          </Link>
          <Link href="/dashboard/faq" className="flex items-center">
            <FaQuestionCircle className="mr-1" /> FAQ
          </Link>
          <Link href="/dashboard/about" className="flex items-center">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}