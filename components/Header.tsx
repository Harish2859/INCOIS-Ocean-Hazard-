
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';

const getTitle = (pathname: string): string => {
  if (pathname === '/') return 'Dashboard';
  const name = pathname.replace('/', '');
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const Header: React.FC = () => {
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <button className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-incois-red md:hidden">
          <Bars3Icon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 ml-3">{title}</h1>
      </div>
      <div className="flex items-center">
        <button className="bg-incois-red hover:bg-incois-red-dark text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          Create New Post
        </button>
      </div>
    </header>
  );
};

export default Header;
