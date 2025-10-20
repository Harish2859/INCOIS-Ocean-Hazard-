
import React from 'react';

interface DataCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

const DataCard: React.FC<DataCardProps> = ({ title, value, icon, change, changeType }) => {
  const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {change && (
          <p className={`text-xs ${changeColor}`}>
            {change} from last week
          </p>
        )}
      </div>
      <div className="bg-incois-red/10 p-4 rounded-full">
        {icon}
      </div>
    </div>
  );
};

export default DataCard;
