const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search sticky top-0 z-50 w-full py-4 backdrop-blur-md bg-black/20h">
      <div>
        <img src="search.svg" alt="search" />
        <input
          type="text"
          placeholder="Search a movie"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
