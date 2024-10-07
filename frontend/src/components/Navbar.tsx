// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold text-gray-700 dark:text-white">
            <Link to="/">IoT Dashboard</Link>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <Link to="/" className="text-gray-700 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 mx-3">Dashboard</Link>
                <Link to="/device-test" className="text-gray-700 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 mx-3">Device Test</Link>
                <button onClick={logout} className="text-gray-700 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 mx-3">Logout</button>
              </>
            ) : (
              <Link to="/login" className="text-gray-700 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 mx-3">Login</Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;