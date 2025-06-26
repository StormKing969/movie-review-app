import React, {useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import MoviePage from "./components/MoviePage.jsx";

const App = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home setSelectedMovie={setSelectedMovie} />} />
        <Route path="/movie/:movieID/:movieName" element={<MoviePage selectedMovie={selectedMovie} />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;