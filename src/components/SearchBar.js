import React, { useState } from 'react';

const SearchBar = ({onSearch}) => {
  const [term, setTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();

    onSearch(parseInt(term));
  };

  return (
    <div className="ui search">
      <div className="ui icon input">
        <input
          className="prompt"
          type="text"
          placeholder="US ZIP Code"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <i
          className="search circular link icon"
          onClick={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;

/**
 * Icon Button to obtain GPS location
 * <i className="large map marker alternate link icon"></i>
 *
 */