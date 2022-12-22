import { type MovieInfo } from "../types/movie";

async function fetchMovie(movieId: string, apiKey: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
  );
  const data = await response.json();
  console.log(data);
  return data;
}

async function buildMovieInfo(relativePath: string, apiKey: string) {
  const movieInfoElement = document.getElementById("movie-info");

  const movie: MovieInfo = await fetchMovie(relativePath, apiKey);

  movieInfoElement!.innerHTML = `
    <div class="text-white pt-60 p-4" style="background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%), url(${
      "https://image.tmdb.org/t/p/original" + movie.backdrop_path
    }); background-position: center !important; background-repeat: no-repeat !important; background-size: cover !important;">
      <button class="bg-blue-500 py-2 px-4 rounded-xl text-white">Play Trailer</button>
      <h2>${movie.title}</h2>
      <p>${movie.overview}</p>
      <div>
        <div>
          <p>Release Date:</p>
          <p>${movie.release_date}</p>

          <p>Genre:</p>
          <p>${movie.genres[0]}</p>
        </div>
        <div>
          <p>Original Language:</p>
          <p>${movie.original_language}</p>
          <p>Popularity:</p>
          <p>${movie.popularity}</p>
        </div>
        <div>
          <p>Similar Movies:</p>
        </div>
      </div>
    </div>
  `;
}

export default buildMovieInfo;
