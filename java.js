document.querySelectorAll(".carousel").forEach((carousel) => {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let dragged = false;

  const DRAG_THRESHOLD = 6;

  carousel.addEventListener("mousedown", (e) => {
    isDown = true;
    dragged = false;
    carousel.classList.add("is-dragging");
    startX = e.pageX;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const walk = e.pageX - startX;
    if (Math.abs(walk) > DRAG_THRESHOLD) dragged = true;
    carousel.scrollLeft = scrollLeft - walk;
  });

  window.addEventListener("mouseup", () => {
    isDown = false;
    carousel.classList.remove("is-dragging");
  });

  carousel.addEventListener("mouseleave", () => {
    isDown = false;
    carousel.classList.remove("is-dragging");
  });

  // Click en imagen -> lightbox (solo si NO has arrastrado)
  carousel.addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (!img) return;

    if (dragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Abrir lightbox con LISTA del carrusel + índice
    const list = Array.from(carousel.querySelectorAll("img"));
    const index = list.indexOf(img);
    openLightbox(list, index);
  });
});

// -------------------------
// LIGHTBOX + NAV
// -------------------------
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const fondo = lightbox?.querySelector(".lightboxFondo");
const navLeft = lightbox?.querySelector(".lb-left");
const navRight = lightbox?.querySelector(".lb-right");

let currentList = [];
let currentIndex = 0;

function setNavState() {
  if (!navLeft || !navRight) return;
  navLeft.classList.toggle("is-disabled", currentIndex <= 0);
  navRight.classList.toggle("is-disabled", currentIndex >= currentList.length - 1);
}

function showImage(i) {
  if (!lightboxImg || !currentList.length) return;
  currentIndex = Math.max(0, Math.min(i, currentList.length - 1));
  lightboxImg.src = currentList[currentIndex].src;
  lightboxImg.alt = currentList[currentIndex].alt || "";
  setNavState();
}

function openLightbox(list, index) {
  if (!lightbox || !lightboxImg) return;
  currentList = list || [];
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  showImage(index || 0);
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
  lightboxImg.alt = "";
  currentList = [];
  currentIndex = 0;
}

// Click en fondo cierra (solo si clicas el fondo, no la img, no los botones)
fondo?.addEventListener("click", closeLightbox);

// Evitar que click en la imagen cierre
lightboxImg?.addEventListener("click", (e) => e.stopPropagation());

// Navegación izquierda/derecha
navLeft?.addEventListener("click", (e) => {
  e.stopPropagation();
  showImage(currentIndex - 1);
});

navRight?.addEventListener("click", (e) => {
  e.stopPropagation();
  showImage(currentIndex + 1);
});

// ESC cierra + flechas teclado navegan
window.addEventListener("keydown", (e) => {
  if (!lightbox?.classList.contains("is-open")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showImage(currentIndex - 1);
  if (e.key === "ArrowRight") showImage(currentIndex + 1);
});