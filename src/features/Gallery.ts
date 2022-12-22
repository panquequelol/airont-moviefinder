import { type Movie } from "../types/movie";

async function buildGallery(apiKey: string, page: number) {
  let popularMovies: Movie[] = [];
  const galleryElement = document.getElementById("gallery");
  let domNode = "";

  async function fetchMovies(apiKey: string) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&?page=${page}`
    );
    const data = await response.json();
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

  async function loadMovies(domNode: string) {
    const movies = await fetchMovies(apiKey);
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

  await loadMovies(domNode);

  const galleryLoadingElement = document.getElementById(
    "gallery-loading-element"
  );

  const observer = new IntersectionObserver(async (entries) => {
    const [element] = entries;
    if (element.isIntersecting) {
      page = +1;
      await loadMovies(domNode);
    }
  });

  observer.observe(galleryLoadingElement as Element);
}

export default buildGallery;
