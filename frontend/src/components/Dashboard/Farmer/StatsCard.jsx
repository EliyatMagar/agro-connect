import React from 'react';
import { FaBox, FaChartLine, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const StatsCard = ({ 
  title, 
  value, 
  icon = <FaBox />, 
  color = 'indigo',
  trend,
  percentage,
  loading = false
}) => {
  // Color variants
  const colorVariants = {
    indigo: 'bg-indigo-50 text-indigo-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    purple: 'bg-purple-50 text-purple-700',
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700'
  };

  // Icon components
  const iconComponents = {
    box: <FaBox />,
    chart: <FaChartLine />,
    check: <FaCheckCircle />,
    cancel: <FaTimesCircle />
  };

  // Determine icon to display
  const displayIcon = typeof icon === 'string' ? iconComponents[icon] || iconComponents.box : icon;

  return (
    <div className={`rounded-xl shadow-sm p-5 ${colorVariants[color] || colorVariants.indigo}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          {loading ? (
            <div className="h-8 w-16 mt-2 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold mt-1">{value}</p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-white bg-opacity-30">
          {displayIcon}
        </div>
      </div>
      
      {trend && (
        <div className={`mt-3 text-xs font-medium flex items-center ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {percentage}% {trend === 'up' ? 'increase' : 'decrease'} from last month
        </div>
      )}
    </div>
  );
};

// Example usage:
/*
<StatsCard 
  title="Total Products" 
  value={45} 
  icon="box" 
  color="indigo"
  trend="up"
  percentage={12.5}
/>
*/ 

export default StatsCard;