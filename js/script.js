const whatsappNumber = "254798748732";

const themeToggle = document.querySelector("#themeToggle");
const savedTheme = localStorage.getItem("creativeDeskTheme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("creativeDeskTheme", document.body.classList.contains("dark") ? "dark" : "light");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.counter || 0);
      const duration = 1200;
      const started = performance.now();

      function tick(now) {
        const progress = Math.min((now - started) / duration, 1);
        counter.textContent = Math.floor(progress * target).toString();

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          counter.textContent = `${target}+`;
        }
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll("[data-counter]").forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    document.querySelectorAll(".portfolio-card").forEach((card) => {
      const categories = card.dataset.category || "";
      card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

document.querySelectorAll(".feature-card video").forEach((video) => {
  video.addEventListener("mouseenter", () => video.play());
  video.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});

const lightbox = document.querySelector("#workLightbox");
const lightboxTitle = document.querySelector("#lightboxTitle");
const lightboxContent = document.querySelector("#lightboxContent");
const lightboxDescription = document.querySelector("#lightboxDescription");
const lightboxClose = document.querySelector(".lightbox-close");

document.querySelectorAll(".portfolio-action").forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.type;
    const src = button.dataset.src;
    const title = button.dataset.title;
    const description = button.dataset.description;
    const media =
      type === "video"
        ? `<video controls autoplay src="${src}"></video>`
        : `<img src="${src}" alt="${title}" />`;

    lightboxTitle.textContent = title;
    lightboxContent.innerHTML = media;
    lightboxDescription.textContent = description;
    lightboxContent.classList.remove("is-zoomed");
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    lightboxClose.focus();
  });
});

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxContent.innerHTML = "";
  lightboxContent.classList.remove("is-zoomed");
  document.body.classList.remove("no-scroll");
}

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

lightboxContent?.addEventListener("click", () => {
  if (lightboxContent.querySelector("img")) {
    lightboxContent.classList.toggle("is-zoomed");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }
});

const form = document.querySelector("#contactForm");
const note = document.querySelector("#formNote");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const contact = document.querySelector("#email").value.trim();
  const service = document.querySelector("#service").value;
  const message = document.querySelector("#message").value.trim();

  const text = `New enquiry:%0AName: ${encodeURIComponent(name)}%0AContact: ${encodeURIComponent(contact)}%0AService: ${encodeURIComponent(service)}%0AMessage: ${encodeURIComponent(message)}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

  note.textContent = "Opening WhatsApp with your enquiry.";
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  form.reset();
});
