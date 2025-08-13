import React, { useState } from 'react';
// import { Search } from 'lucide-react'; // or use your preferred icon library
import './TopSearch.scss'; // Import your SCSS file

const TopSearch = ({ placeholder = "Search QLU Recruiting" }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="top-search-bar">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
        //   onChange={handleInputChange}
        //   onKeyPress={handleSearch}
        />
      </div>
    </div>
  );
};

export default TopSearch;