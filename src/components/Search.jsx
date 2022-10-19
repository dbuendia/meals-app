import { useState } from "react";
import { useGlobalContext } from "../context.jsx";

const Search = () => {
  const { setSearchTerm, fetchRandomMeal } = useGlobalContext();
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text) {
      setSearchTerm(text);
    }
  };

  const handleRandomMeal = () => {
    // Prevents a bug (1):
    // If user makes a search and then clicks the inspire me button
    // We need to change the state of the search term or it will remain with the previous search (and the fetch will not happen since its useEffect hears searchTerm state changes)
    setSearchTerm("");
    setText("");
    fetchRandomMeal();
  };

  return (
    <header className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          placeholder="Type favourite meal"
          className="form-input"
          onChange={handleChange}
        />
        <button type="submit" className="btn">
          Search
        </button>
        <button
          type="button"
          className="btn btn-hipster"
          onClick={handleRandomMeal}
        >
          Inspire me
        </button>
      </form>
    </header>
  );
};

export default Search;
