const header = document.querySelector("[data-header]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const copyEmailButton = document.querySelector("[data-copy-email]");
let lightboxTrigger = null;

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function openLightbox(link) {
  const image = link.querySelector("img");
  lightboxTrigger = link;
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
  if (lightboxTrigger) lightboxTrigger.focus();
  lightboxTrigger = null;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "-9999px";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  field.remove();
}

function setCopyStatus(message) {
  copyEmailButton.textContent = message;
  window.setTimeout(() => {
    copyEmailButton.textContent = "Copy Email";
  }, 1800);
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

if (copyEmailButton) {
  copyEmailButton.addEventListener("click", async () => {
    try {
      await copyText(copyEmailButton.dataset.email);
      setCopyStatus("Email Copied");
    } catch {
      setCopyStatus("Copy Failed");
    }
  });
}
