import React from 'react';

const StatsCard = ({ title, value, subtitle, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-400 to-blue-600 text-blue-600',
    green: 'from-green-400 to-green-600 text-green-600',
    purple: 'from-purple-400 to-purple-600 text-purple-600',
    orange: 'from-orange-400 to-orange-600 text-orange-600',
  };

  const gradientClass = `bg-gradient-to-r ${colorClasses[color]}`;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
        {icon && (
          <span className={`p-2 rounded-full bg-opacity-10 ${colorClasses[color].split(' ')[2]}`}>
            {icon}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold mb-1">
        <span className={colorClasses[color].split(' ')[2]}>{value}</span>
      </div>
      {subtitle && (
        <div className="mt-1">
          <p className="text-xs text-gray-500">{subtitle}</p>
          <div className={`mt-2 h-1 w-16 rounded-full opacity-60 ${gradientClass}`}></div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
