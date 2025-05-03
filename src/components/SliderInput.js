import React from 'react';

const SliderInput = ({ label, value, min, max, step, onChange, unit = '' }) => {
  // Calculate percentage for custom slider styling
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="mb-6 group">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">{label}</label>
        <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded-full text-gray-800 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          {unit === '$' ? `${unit}${value}` : `${value}${unit}`}
        </span>
      </div>
      <div className="relative h-2 w-full">
        <div className="absolute inset-0 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-white border-2 border-blue-500 rounded-full shadow-md pointer-events-none"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
};

export default SliderInput;
