import React, { useState } from 'react';

const SearchBar = ({onSearch}) => {
  const [term, setTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();

    onSearch(term);
  };

  return (
    <div className="ui search">
      <div className="ui icon input">
        <input
          className="prompt"
          type="text"
          placeholder="Washington City or ZIP"
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