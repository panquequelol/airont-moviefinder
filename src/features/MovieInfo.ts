import { type MovieInfo } from "../types/movie";

async function fetchMovie(movieId: string, apiKey: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
  );
  const data = await response.json();
  console.log(data);
  return data;
}

function rating(score: number) {
  return Math.round(score) / 2;
}

function convertDate(dateRaw: string) {
  const [year, month, day] = dateRaw.split("-");

  const date = new Date(
    Date.UTC(
      year as unknown as number,
      month as unknown as number,
      day as unknown as number
    )
  );
  const release = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
  }).format(date);
  return release;
}

async function buildMovieInfo(relativePath: string, apiKey: string) {
  const movieInfoElement = document.getElementById("movie-info");

  const movie: MovieInfo = await fetchMovie(relativePath, apiKey);

  movieInfoElement!.innerHTML = `
    <div class="text-white pt-72 p-4" style="background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%), url(${
      "https://image.tmdb.org/t/p/original" + movie.backdrop_path
    }); background-position: center !important; background-repeat: no-repeat !important; background-size: cover !important;">
      <button class="bg-blue-500 py-2 px-16 rounded-full text-white">Play Trailer</button>
      <h2 class="font-semibold text-4xl text-blue-500 mt-4">${movie.title}</h2>
      <p>${movie.overview}</p>
      <div class="grid grid-cols-2 mt-4 gap-4">
        <div>
          <p class="font-bold">Release Date:</p>
          <p>${convertDate(movie.release_date)}</p>
        </div>
        <div>
          <p class="font-bold">Original Language:</p>
          <p>${
            movie.original_language === "en"
              ? "English"
              : movie.original_language === "ja"
              ? "Japanese"
              : movie.original_language === "es"
              ? "Spanish"
              : movie.original_language
          }</p>
        </div>
        <div>
          <p class="font-bold">Genre:</p>
          <p class="text-blue-500">${movie.genres.map(
            ({ name }) => ` ${name}`
          )}</p>
        </div>
        <div>
          <p class="font-bold">Popularity:</p>
          <p>${rating(movie.vote_average)} / 5</p>
        </div>
        <div>
          <p class="font-bold">Similar Movies:</p>
        </div>
      </div>
    </div>
  `;
}

export default buildMovieInfo;
