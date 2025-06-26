import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

const API_BASE_URL = " https://api.themoviedb.org/3/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
};

const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language, id }, setSelectedMovie
}) => {
    const navigate = useNavigate();
    const [fetchingMovieDetailsError, setFetchingMovieDetailsError] = useState(false);

    const handleOnClick = () => {
        fetchMovieDetails(id).then(() => {
            if (!fetchingMovieDetailsError) {
                navigate(`/movie/${id}/${title}`)
            } else {
                console.error("Error fetching movie details, cannot navigate to movie page.");
            }
        });

    }

    const fetchMovieDetails = async (movieId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${movieId}`, API_OPTIONS);

            if (!response.ok) {
                throw new Error("Failed to fetch movie details");
            }

            const movieDetails = await response.json();

            if (movieDetails.response === false) {
                setFetchingMovieDetailsError(true);
                console.error("Error fetching movie details:", movieDetails.Error || "Unknown error");
                return;
            }

            setSelectedMovie(movieDetails);
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    }

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