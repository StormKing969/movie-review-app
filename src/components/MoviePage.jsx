import React, {useEffect, useState} from "react";
import {getMovieSearchCount} from "../appwrite.js";

const YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v=";

const MoviePage = ({
  selectedMovieDetails: {
    id,
    adult,
    genres,
    title,
    overview,
    poster_path,
    release_date,
    runtime,
    vote_average,
    vote_count,
    production_countries,
    status,
    spoken_languages,
    budget,
    revenue,
    tagline,
    production_companies,
  },
  selectedMovieVideo,
  selectedMovieImage,
}) => {
  const [movieSearchCount, setMovieSearchCount] = useState(null);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatVoteCount = (count) => {
    if (count < 1000) {
      return count;
    } else if (count < 1000000) {
      return `${(count / 1000).toFixed(1)}K`;
    } else {
      return `${(count / 1000000).toFixed(1)}M`;
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const formatBudget = (budget) => {
    if (budget < 1000) {
      return `$${budget}`;
    } else if (budget < 1000000) {
      return `$${(budget / 1000).toFixed(1)} K`;
    } else {
      return `$${(budget / 1000000).toFixed(1)} M`;
    }
  };

  const getMovieUrl = (movieURL) => {
    if (!Array.isArray(movieURL)) return "#";
    const trailer = movieURL.find(
        (vid) =>
            vid.name.toLowerCase() === "official trailer" ||
            vid.name.toLowerCase() === "official teaser trailer"
    );

    return trailer ? `${YOUTUBE_BASE_URL}${trailer.key}` : "#";
  };

  const loadMovieSearchCount = async (currentMovieId) => {
    try {
      const count = await getMovieSearchCount(currentMovieId);
      setMovieSearchCount(count);
    } catch (error) {
      console.error("Error fetching movie search count:", error);
      setMovieSearchCount(1);
    }
  };

  useEffect(() => {
    loadMovieSearchCount(id);
  }, [id]);

  return (
    <main key={id} className="text-white">
      <div className="pattern" />

      <div className="wrapper">
        <section className="movie-header">
          <div className="flex flex-row justify-between mb-1">
            <h2>{title}</h2>

            <div className="flex flex-row items-center justify-center">
              <div className="rating mr-2">
                <img src="/star.svg" alt="star" />
                <p>
                  {vote_average ? vote_average.toFixed(1) : "N/A"}
                  <span className="font-semibold text-gray-100">
                    /10 ({formatVoteCount(vote_count)})
                  </span>
                </p>
              </div>

              <div className="flex flex-row items-center gap-1 bg-light-100/10 px-3 py-1 rounded-md">
                <img src="/trend.png" alt="trend" />
                <p className="font-semibold text-gray-100">
                  {movieSearchCount}
                </p>
              </div>
            </div>
          </div>

          <div className="text-gray-100">
            {release_date}
            <span className="px-2">•</span>
            {!adult ? "PG-13" : "R"}
            <span className="px-2">•</span>
            {runtime ? formatTime(runtime) : "N/A"}
          </div>
        </section>

        <section className="movie-body">
          <img
            className="img-small"
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500/${poster_path}`
                : "/no-movie.png"
            }
            alt={`${title}`}
          />

          <div className="second-img-wrapper">
            <img
              className="img-large"
              src={
                selectedMovieImage
                  ? `https://image.tmdb.org/t/p/w500${selectedMovieImage}`
                  : "/no-movie.png"
              }
              alt={`${title}`}
            />

            <a
              href={getMovieUrl(selectedMovieVideo)}
              target="_blank"
              rel="noopener noreferrer"
              className="movie-link"
            >
              <img src="/play-icon.png" alt="Play Icon" />{" "}
              <span className="pl-2">Trailer</span>
            </a>
          </div>
        </section>

        <section className="movie-content">
          <div className="flex flex-col">
            <div className="content-style">
              <h3 className="word-title">Genres</h3>
              <ul>
                {genres.map((genre) => (
                  <li
                    key={genre.id}
                    className="mr-2 bg-light-200/10 px-3 py-1 rounded-md"
                  >
                    {genre.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="content-style">
              <h3 className="word-title">Overview</h3>
              <p className="word-content">
                {overview || "No overview available."}
              </p>
            </div>

            <div className="content-style">
              <h3 className="word-title">Release Date</h3>
              <p className="word-content">
                {formatDate(release_date) || "No release date available."}
              </p>
            </div>

            <div className="content-style">
              <h3 className="word-title">Countries</h3>
              <ul>
                {production_countries.length > 0 ? (
                  production_countries.map((country, index) => (
                    <li key={country.iso_3166_1}>
                      {country.name}
                      {index !== production_countries.length - 1 && (
                        <span className="px-2">•</span>
                      )}
                    </li>
                  ))
                ) : (
                  <li>No production countries available.</li>
                )}
              </ul>
            </div>

            <div className="content-style">
              <h3 className="word-title">Status</h3>
              <p className="word-content">{status || "No status available."}</p>
            </div>

            <div className="content-style">
              <h3 className="word-title">Language</h3>
              <ul>
                {spoken_languages.length > 0 ? (
                  spoken_languages.map((lang, index) => (
                    <li key={lang.iso_639_1}>
                      {lang.english_name}
                      {index !== spoken_languages.length - 1 && (
                        <span className="px-2">•</span>
                      )}
                    </li>
                  ))
                ) : (
                  <li>No languages available</li>
                )}
              </ul>
            </div>

            <div className="content-style">
              <h3 className="word-title">Budget</h3>
              <p className="word-content">
                {formatBudget(budget) || "No budget available."}
              </p>
            </div>

            <div className="content-style">
              <h3 className="word-title">Revenue</h3>
              <p className="word-content">
                {formatBudget(revenue) || "No revenue available."}
              </p>
            </div>

            <div className="content-style">
              <h3 className="word-title">Tagline</h3>
              <p className="word-content">
                {tagline || "No tagline available."}
              </p>
            </div>

            <div className="content-style">
              <h3 className="word-title">Production Companies</h3>
              <ul>
                {production_companies.length > 0 ? (
                  production_companies.map((company, index) => (
                    <>
                      <li key={company.id} className="text-center">
                        {company.name}
                      </li>
                      {index !== production_companies.length - 1 && (
                        <span className="px-2">•</span>
                      )}
                    </>
                  ))
                ) : (
                  <li>No production companies available</li>
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
export default MoviePage;