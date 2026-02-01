import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import "./App.css";
import Search from "./components/search";
import Spinner from "./components/spinner";
import MovieCard from "./components/movieCard";
import LightRays from "./components/lightRays";
import { getTrendingMovies, updateSearchCount } from "./appwrite";


const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, SetMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [debounceSearchTerm, setDebounceSearchTerm] = useState()

  const [trendingMovies, setTrendingMovies] = useState([])

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm])

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

      const data = await response.json();
      if (data.Response === false) {
        setErrorMessage(data.Error || "Failed to fetch movies");
        SetMovieList([]);
        return;
      }
      SetMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])


      }

    } catch (error) {
      console.error(`Error in fetching Movies : ${error}`);
      setErrorMessage("Error fetching movies.Please try again later.");
    } finally {
      setIsLoading(false)
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    } catch (error) {
      console.error(`Error fetching trending Movies : ${error}`)

    }
  }

  useEffect(() => {

    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies()
  }, [])

  return (
    <main className="relative min-h-screen bg-black"  >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <LightRays
          raysOrigin="top-center"
          raysColor="#fc3b14"
          raysSpeed={2}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0}
          noiseAmount={0}
          distortion={2}
          className="custom-rays"
          pulsating={false}
          fadeDistance={0.5}
          saturation={0.5}
        />
      </div>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="" />
          <h1 className="text-5xl font-luckiest-guy">
            Discover <span className="text-gradient">Movies</span> You’ll Love —
            Effortlessly
          </h1>
        </header>
         <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {trendingMovies.length > 0 && (
          <section className="trending font-luckiest-guy">
            <h2 >Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="all-movies ">
          <h2 className="font-luckiest-guy ">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>


      <footer className="bg-neutral-primary-soft rounded-base shadow-xs border border-default m-4 font-luckiest-guy">
        <div className="w-full max-w-7xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between ">
            <a href="#" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse text-gray-600">
              <img src="./logo.png" class="h-7" />
              <span class="text-heading self-center text-2xl font-semibold whitespace-nowrap">Cinemora</span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-body sm:mb-0  text-gray-600">
              <li>
                <a href="https://github.com/Omkar-Kurade/Cinemora" target="_blank" className="hover:underline me-4 md:me-6">Github</a>
              </li>
              <li>
                <a href="https://linkedin.com/in/omkar-kurade-054668223" target="_blank" className="hover:underline">LinkedIn</a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-defaul border-gray-500 t sm:mx-auto lg:my-8" />
          <span className="block text-sm text-body sm:text-center text-gray-600">© 2025</span>
        </div>
      </footer>

    </main>

  );
}

export default App;
