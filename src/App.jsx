import React, {useEffect, useState} from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

/**
 * App component serves as the main container for the movie search application.
 * It handles:
 *  - user search input,
 *  - debounced API calls to TMDB (The Movie Database),
 *  - loading and error state management,
 *  - rendering movie search results or popular movies.
 *
 * @component
 */
const App = () => {
  // State hooks for input value, API error message, movie data, loading indicator, and debounced query
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSeachTerm, setDebouncedSeachTerm] = useState("");

  /**
   * useDebounce delays updating the debounced search term for 500ms
   * after the user stops typing, to minimize unnecessary API calls.
   */
  useDebounce(() => setDebouncedSeachTerm(searchTerm), 500, [searchTerm]);

  /**
   * Fetches movies from TMDB.
   * If a search term is provided, it performs a search;
   * otherwise, it fetches popular movies.
   *
   * @async
   * @param {string} query - Search term entered by the user.
   * @returns {Promise<void>}
   */
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const moviesResponse = await response.json();

      if (moviesResponse.response === false) {
        setErrorMessage(moviesResponse.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(moviesResponse.results);
    } catch (e) {
      console.log(`Error fetching movies: ${e}`);
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * useEffect triggers a fetch whenever the search term updates.
   */
  useEffect(() => {
    fetchMovies(debouncedSeachTerm);
  }, [debouncedSeachTerm]);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-white">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};
export default App;