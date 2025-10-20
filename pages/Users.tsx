
import React, { useState, useMemo } from 'react';
import { mockUsers } from '../constants';
import { User, UserRole } from '../types';
import { PencilIcon, TrashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const roleColors: { [key in UserRole]: string } = {
  [UserRole.Admin]: 'bg-red-100 text-red-800',
  [UserRole.Volunteer]: 'bg-green-100 text-green-800',
  [UserRole.Citizen]: 'bg-blue-100 text-blue-800',
};

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');

  const filteredUsers = useMemo(() => {
    return mockUsers
      .filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(user =>
        roleFilter === 'All' || user.role === roleFilter
      );
  }, [searchTerm, roleFilter]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-incois-red"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-incois-red"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | 'All')}
        >
          <option value="All">All Roles</option>
          <option value={UserRole.Admin}>Admin</option>
          <option value={UserRole.Volunteer}>Volunteer</option>
          <option value={UserRole.Citizen}>Citizen</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.dateJoined}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-4">
                    <button className="text-indigo-600 hover:text-indigo-900"><PencilIcon className="h-5 w-5"/></button>
                    <button className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5"/></button>
                    <button className="text-green-600 hover:text-green-900"><ShieldCheckIcon className="h-5 w-5"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
