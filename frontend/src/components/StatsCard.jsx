import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-soft border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? '↗' : '↘'} {trendValue}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
