import React from 'react';

const Loader = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-primary-500 border-r-transparent border-b-primary-500 border-l-transparent ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export default Loader;
