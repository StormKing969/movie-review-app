import React from "react";
import {useNavigate} from "react-router-dom";
import {fetchMovieDetails} from "../utility/getMovieDetails.js";

const MovieCard = ({
  movie: {
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
    id,
  },
  setSelectedMovieDetails,
  setSelectedMovieVideo,
  setFetchingMovieDetailsError,
  setSelectedMovieImage,
  fetchingMovieDetailsError,
}) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    fetchMovieDetails(
      id,
      poster_path,
      title,
      setFetchingMovieDetailsError,
      setSelectedMovieDetails,
      setSelectedMovieVideo,
      setSelectedMovieImage,
    ).then(() => {
      if (!fetchingMovieDetailsError) {
        navigate(`/movie/${id}/${title}`);
      } else {
        console.error(
          "Error fetching movie details, cannot navigate to movie page.",
        );
      }
    });
  };

  return (
    <div className="movie-card" onClick={() => handleOnClick()}>
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-movie.png"
        }
        alt={`${title}`}
      />

      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="star" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>

          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};
export default MovieCard;