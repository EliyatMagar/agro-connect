import React from 'react';
import { FaLeaf, FaChartLine, FaCheckCircle, FaTimesCircle, FaTractor, FaSeedling, FaWarehouse } from 'react-icons/fa';

const StatsCard = ({ 
  title, 
  value, 
  icon = <FaLeaf />, 
  color = 'green',
  trend,
  percentage,
  loading = false
}) => {
  // Color variants - updated to earth tones
  const colorVariants = {
    green: 'bg-green-50 text-green-700',
    lime: 'bg-lime-50 text-lime-700',
    amber: 'bg-amber-50 text-amber-700',
    teal: 'bg-teal-50 text-teal-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    yellow: 'bg-yellow-50 text-yellow-700'
  };

  // Icon components - updated with farming icons
  const iconComponents = {
    leaf: <FaLeaf />,
    chart: <FaChartLine />,
    check: <FaCheckCircle />,
    cancel: <FaTimesCircle />,
    tractor: <FaTractor />,
    seedling: <FaSeedling />,
    warehouse: <FaWarehouse />
  };

  // Determine icon to display
  const displayIcon = typeof icon === 'string' ? iconComponents[icon] || iconComponents.leaf : icon;

  return (
    <div className={`rounded-xl shadow-sm p-5 ${colorVariants[color] || colorVariants.green} border border-${color}-100`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          {loading ? (
            <div className="h-8 w-16 mt-2 bg-green-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold mt-1">{value}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-white bg-opacity-30 text-${color}-600`}>
          {displayIcon}
        </div>
      </div>
      
      {trend && (
        <div className={`mt-3 text-xs font-medium flex items-center ${
          trend === 'up' ? 'text-green-600' : 'text-amber-600'
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
          {percentage}% {trend === 'up' ? 'increase' : 'decrease'} from last season
        </div>
      )}
    </div>
  );
};

// Example usage:
/*
<StatsCard 
  title="Total Crops" 
  value={45} 
  icon="seedling" 
  color="green"
  trend="up"
  percentage={12.5}
/>
*/ 

export default StatsCard;