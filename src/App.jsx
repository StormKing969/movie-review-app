import React, {useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import MoviePage from "./components/MoviePage.jsx";

const App = () => {
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
  const [selectedMovieVideo, setSelectedMovieVideo] = useState(null);

  console.log(selectedMovieDetails);
  console.log(selectedMovieVideo);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Home
              setSelectedMovieDetails={setSelectedMovieDetails}
              setSelectedMovieVideo={setSelectedMovieVideo}
            />
          }
        />
        <Route
          path="/movie/:movieID/:movieName"
          element={
            <MoviePage
              selectedMovieDetails={selectedMovieDetails}
              selectedMovieVideo={selectedMovieVideo}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
export default App;