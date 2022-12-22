import { type Movie } from "../types/movie";

let page = 1;

async function buildGallery(apiKey: string) {
  let popularMovies: Movie[] = [];
  const galleryElement = document.getElementById("gallery");
  let domNode = "";

  async function fetchMovies(apiKey: string, page: number) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`
    );
    console.log(page, "fetchMovies");
    const data = await response.json();
    console.log(data);
    return data.results;
  }

  const threeColsButton = document.getElementById("three-cols-button");
  const singleColButton = document.getElementById("single-col-button");

  function handleThreeColToggle() {
    galleryElement!.classList.add("grid-cols-3");
  }

  function handleSingleColToggle() {
    galleryElement!.classList.remove("grid-cols-3");
  }

  singleColButton!.addEventListener("click", () => handleSingleColToggle());
  threeColsButton!.addEventListener("click", () => handleThreeColToggle());

  async function loadMovies(domNode: string, page: number) {
    console.log(page, "loadMovies");
    const movies = await fetchMovies(apiKey, page);
    popularMovies = [...popularMovies, ...movies];
    // re-built the UI
    popularMovies.forEach(
      ({ id, title, overview, backdrop_path }) =>
        (domNode += `<li>
          <a href="/${id}" class="flex flex-col px-4 pb-4 pt-96 gap-2 hover:cursor-pointer h-full"
          style="background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%), url(${
            "https://image.tmdb.org/t/p/original" + backdrop_path
          }); background-position: center !important; background-repeat: no-repeat !important; background-size: cover !important;"
          >
            <h2 class="text-3xl font-semibold text-white">${title}</h2>
            <p class="text-gray-300">${overview}</p>
          </a>
        </li>
        `)
    );

    galleryElement!.innerHTML = `${domNode}`;
  }

  await loadMovies(domNode, page);

  const galleryLoadingElement = document.getElementById(
    "gallery-loading-element"
  );

  const observer = new IntersectionObserver(async (entries) => {
    const [element] = entries;
    if (element.isIntersecting) {
      page += 1;
      console.log(page);
      await loadMovies(domNode, page);
    }
  });

  observer.observe(galleryLoadingElement as Element);
}

export default buildGallery;
