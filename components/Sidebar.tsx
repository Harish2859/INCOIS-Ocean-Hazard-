import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, ChartBarIcon, DocumentTextIcon, BellIcon, CogIcon, MapIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Map View', href: '/map', icon: MapIcon },
  { name: 'Notifications', href: '/notifications', icon: BellIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <div className="flex flex-col w-64 bg-gray-800 text-white">
            <div className="flex items-center justify-center h-20 border-b border-gray-700">
                <h1 className="text-2xl font-bold text-incois-red">INCOIS</h1>
                <span className="text-2xl font-thin ml-2">Admin</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                isActive
                                    ? 'bg-incois-red text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="h-6 w-6 mr-3" aria-hidden="true" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full" src="https://picsum.photos/id/1027/100/100" alt="Admin Avatar" />
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">Admin Priya</p>
                        <p className="text-xs font-medium text-gray-400">View profile</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;