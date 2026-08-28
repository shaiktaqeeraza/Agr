import React from 'react';

const Loader = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 text-primary-700">
    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    <p className="text-sm">{label}</p>
  </div>
);

export default Loader;
