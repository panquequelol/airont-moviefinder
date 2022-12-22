import { type Movie } from "../types/movie";

let page = 1;

function rating(score: number) {
  return Math.round(score) / 2;
}

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
      ({ id, title, overview, backdrop_path, vote_average }) => {
        let starsDomNode = "";

        for (let index = 0; index < rating(vote_average); index++) {
          starsDomNode += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-yellow-500">
          <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
        </svg>
        `;
        }

        return (domNode += `<li>
        <a href="/${id}" class="flex flex-col px-4 pb-4 pt-96 gap-2 hover:cursor-pointer h-full"
        style="background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%), url(${
          "https://image.tmdb.org/t/p/original" + backdrop_path
        }); background-position: center !important; background-repeat: no-repeat !important; background-size: cover !important;"
        >
          <h2 class="text-3xl font-semibold text-white">${title}</h2>
          <div class="flex gap-2">${starsDomNode}</div>
          <p class="text-gray-300">${overview}</p>
        </a>
      </li>
      `);
      }
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
