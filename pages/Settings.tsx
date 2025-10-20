
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      <p className="mt-4 text-gray-600">This area will be for system configuration. Admins can manage their profiles, and super-admins can manage other admin accounts, define alert categories, and set content guidelines.</p>
    </div>
  );
};

export default Settings;
