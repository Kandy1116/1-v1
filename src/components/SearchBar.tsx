
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      router.push(`/search?q=${query}`);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for books"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
