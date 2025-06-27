import {updateSearchCount} from "../appwrite.js";

const API_BASE_URL = " https://api.themoviedb.org/3/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export const fetchMovieDetails = async (
  movieId,
  poster_path,
  title,
  setFetchingMovieDetailsError,
  setSelectedMovieDetails,
  setSelectedMovieVideo,
) => {
  try {
    await updateSearchCount(movieId, poster_path, title);

    const response = await fetch(`${API_BASE_URL}/${movieId}`, API_OPTIONS);

    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    const movieDetails = await response.json();

    if (movieDetails.response === false) {
      setFetchingMovieDetailsError(true);
      console.error(
        "Error fetching movie details:",
        movieDetails.Error || "Unknown error",
      );
      return;
    }

    setSelectedMovieDetails(movieDetails);

    await fetchMovieVideo(
      movieId,
      setFetchingMovieDetailsError,
      setSelectedMovieVideo,
    );
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
};

const fetchMovieVideo = async (
  movieId,
  setFetchingMovieDetailsError,
  setSelectedMovieVideo,
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/${movieId}/videos`,
      API_OPTIONS,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie images");
    }

    const video = await response.json();

    if (video.response === false) {
      setFetchingMovieDetailsError(true);
      console.error(
        "Error fetching movie images:",
        video.Error || "Unknown error",
      );
      return;
    }

    setSelectedMovieVideo(video);
  } catch (error) {
    console.error("Error fetching movie images:", error);
  }
};