import "./style.css";
import buildGallery from "./features/Gallery";

if (!localStorage.getItem("session")) console.log("not found");

const relativePath = (
  window.location.pathname + window.location.search
).substring(1);

if (relativePath) {
  // will run when when there's a path parameter, the path parameter is a movie id
} else {
  // will run when user is home

  // show gallery section
  const gallerySectionElement = document.getElementById("gallery-section");
  gallerySectionElement!.style.display = "block";
  buildGallery();
}
