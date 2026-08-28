import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search crops or locations...' }) => {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-crop-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-crop-200 bg-white pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-crop-400"
      />
    </div>
  );
};

export default SearchBar;
