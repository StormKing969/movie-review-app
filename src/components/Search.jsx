import React from "react";

/**
 * Search Component
 *
 * Renders a search input field with an icon.
 *
 * Props:
 * @param {Object} props - The props object.
 * @param {string} props.searchTerm - The current value of the search input.
 * @param {Function} props.setSearchTerm - Function to update the search term.
 *
 * @returns {JSX.Element} The rendered search input component.
 */
const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="Search icon" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};
export default Search;