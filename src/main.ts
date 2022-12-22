import "./style.css";
import buildGallery from "./features/Gallery";
import buildMovieInfo from "./features/MovieInfo";

const API_KEY = "8a05ce3666972d0438eebd9615a87a00";

if (!localStorage.getItem("session")) console.log("not found");

const relativePath = (
  window.location.pathname + window.location.search
).substring(1);

if (relativePath) {
  // will run when when there's a path parameter, the path parameter is a movie id

  buildMovieInfo(relativePath, API_KEY);
} else {
  // will run when user is home

  // show gallery section
  const gallerySectionElement = document.getElementById("gallery-section");
  gallerySectionElement!.style.display = "block";
  buildGallery(API_KEY);
}
