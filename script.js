const header = document.querySelector("[data-header]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function openLightbox(link) {
  const image = link.querySelector("img");
  lightboxImage.src = link.href;
  lightboxImage.alt = image ? image.alt : "Enlarged project screenshot";
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  lightboxImage.alt = "";
  document.body.style.overflow = "";
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

document.querySelectorAll(".project-media, .mini-shot").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openLightbox(link);
  });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});
