import React from "react";

/**
 * MovieCard Component
 *
 * Displays a movie card with details such as title, rating, poster, release year, and original language.
 *
 * Props:
 * @param {Object} props - The props object.
 * @param {Object} props.movie - The movie object containing details about the movie.
 * @param {string} props.movie.title - The title of the movie.
 * @param {number} props.movie.vote_average - The average vote rating of the movie.
 * @param {string} props.movie.poster_path - The path to the movie's poster image.
 * @param {string} props.movie.release_date - The release date of the movie in YYYY-MM-DD format.
 * @param {string} props.movie.original_language - The original language of the movie.
 *
 * @returns {JSX.Element} A styled movie card displaying the movie's details.
 */
const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
}) => {
  return (
    <div className="movie-card">
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
            <img src="star.svg" alt="star" />
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