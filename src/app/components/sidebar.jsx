'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  PlusCircleIcon,
  CalculatorIcon,
  UsersIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        console.error('Logout failed:', await response.json());
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/pages/new_sale', label: 'New Vehicle', icon: PlusCircleIcon },
    { href: '/pages/tax_management', label: 'Tax Management', icon: CalculatorIcon },
    { href: '/pages/supplier_management', label: 'Supplier Management', icon: UsersIcon },
    { href: '/pages/dealer_management', label: "Dealer's Management", icon: UserGroupIcon },
    { href: '/supplier-ledger', label: 'Supplier Ledger', icon: DocumentTextIcon },
    { href: '/dealers-ledger', label: "Dealer's Ledger", icon: DocumentTextIcon },
    { href: '/pages/product_management', label: "Product Management", icon: DocumentTextIcon },
    { href: '/sales-list', label: 'Sales List', icon: DocumentTextIcon },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header with User Info */}
      <div className="p-4 flex items-center justify-between border-b border-blue-600">
        {isOpen && (
          <div className="text-sm">
            <p>dilwaq22@gmail.com</p>
            <p className="text-xs text-blue-200">User</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-blue-600"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col space-y-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center p-3 rounded-lg hover:bg-blue-600 text-white"
            aria-label={item.label}
          >
            <item.icon className="w-6 h-6 mr-3" />
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-600">
        <button
          onClick={handleLogout}
          className="flex items-center p-3 w-full text-left rounded-lg hover:bg-red-600 text-white"
          aria-label="Logout"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}