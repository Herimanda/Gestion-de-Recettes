import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="flex items-center p-4">
      <input 
        type="text" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded-lg p-2 w-full"
        placeholder="Search for recipes..."
      />
      <button 
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 ml-2 rounded"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
