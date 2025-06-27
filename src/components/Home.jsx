import React, {useEffect, useState} from "react";
import {useDebounce} from "react-use";
import {getTrendingMovies} from "../appwrite.js";
import Search from "./Search.jsx";
import Spinner from "./Spinner.jsx";
import MovieCard from "./MovieCard.jsx";
import {useNavigate} from "react-router-dom";
import {fetchMovieDetails} from "../utility/getMovieDetails.js";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const Home = ({ setSelectedMovieDetails, setSelectedMovieVideo }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [fetchingMovieDetailsError, setFetchingMovieDetailsError] =
    useState(false);

  const navigate = useNavigate();

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        setErrorMessage("Failed to fetch movies");
        setMovieList([]);
        return;
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

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li
                  key={movie.movie_id}
                  className="cursor-pointer"
                  onClick={() => {
                    fetchMovieDetails(
                      movie.movie_id,
                      movie.poster_url,
                      movie.movie_name,
                      setFetchingMovieDetailsError,
                      setSelectedMovieDetails,
                      setSelectedMovieVideo,
                    ).then(() => {
                      if (fetchingMovieDetailsError) {
                        console.error(
                          "Error fetching movie details, cannot navigate to movie page.",
                        );
                      } else {
                        navigate(
                          `/movie/${movie.movie_id}/${movie.movie_name}`,
                        );
                      }
                    });
                  }}
                >
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.movie_name} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-white">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  setSelectedMovieDetails={setSelectedMovieDetails}
                  setSelectedMovieVideo={setSelectedMovieVideo}
                  setFetchingMovieDetailsError={setFetchingMovieDetailsError}
                  fetchingMovieDetailsError={fetchingMovieDetailsError}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};
export default Home;