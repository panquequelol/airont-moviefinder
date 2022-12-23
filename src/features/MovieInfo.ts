import { type MovieInfo } from "../types/movie";

async function fetchMovie(movieId: string, apiKey: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
  );
  const data = await response.json();
  return data;
}

async function getRecomendations(movieId: number, apiKey: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}`
  );
  const data = await response.json();

  return data.results;
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
  let similarMoviesDomNode = "";

  const movie: MovieInfo = await fetchMovie(relativePath, apiKey);
  const similarMovies: { backdrop_path: string; id: number; title: string }[] =
    await getRecomendations(movie.id, apiKey);

  console.log(similarMovies);

  similarMovies.forEach(({ backdrop_path, id, title }) => {
    similarMoviesDomNode += `<a class="rounded-xl ring-4 ring-transparent hover:ring-primary w-fit" href="http://localhost:5173/${id}">
      <img class="w-full sm:w-72 h-72 object-cover rounded-xl" src="${
        "https://image.tmdb.org/t/p/original" + backdrop_path
      }" alt="${title}"></img>
    </a>`;
  });

  movieInfoElement!.innerHTML = `
    <div class="text-white pt-72 px-4" style="background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%), url(${
      "https://image.tmdb.org/t/p/original" + movie.backdrop_path
    }); background-position: center !important; background-repeat: no-repeat !important; background-size: cover !important;">
      <button class="bg-primary py-2 px-16 rounded-full text-xl text-white">Play Trailer</button>
      <h2 class="font-semibold text-5xl text-primary my-4">${movie.title}</h2>
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
          <p class="text-primary">${movie.genres.map(
            ({ name }) => ` ${name}`
          )}</p>
        </div>
        <div>
          <p class="font-bold">Popularity:</p>
          <p>${rating(movie.vote_average)} / 5</p>
        </div>
      </div>
    </div>
    <div class="space-y-4 p-4">
      <p class="font-bold text-white">Similar Movies:</p>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">${similarMoviesDomNode}</div>
    </div>
  `;
}

export default buildMovieInfo;
