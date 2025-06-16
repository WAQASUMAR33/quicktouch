'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  // Toggle user dropdown
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isOpen) setIsOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsUserMenuOpen(false);
    router.push('/login');
  };

  // Navigation links
  const navLinks = [
   
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-200 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-white text-2xl font-bold tracking-tight">
              Khawaja Traders
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white hover:bg-blue-700 hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  {link.label}
                </Link>
              ))}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <User className="h-5 w-5 mr-1" />
                  Profile
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      aria-label="Logout"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-100 focus:outline-none"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={toggleMenu}
                  className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-200"
                >
                  {link.label}
                </Link>
              ))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="flex items-center w-full text-left text-white hover:bg-blue-600 px-3 py-2 rounded-md text-base font-medium transition duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={toggleMenu}
                className="text-white bg-blue-500 hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}