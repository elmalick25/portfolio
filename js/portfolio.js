document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("header");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinksContainer = document.getElementById("navLinks");
  const navLinks = document.querySelectorAll(".nav-link-item");
  const sections = document.querySelectorAll("main section[id]");
  const contactForm = document.getElementById("contactForm");

  // 1. Menu mobile (ouverture / fermeture)
  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener("click", function () {
      navLinksContainer.classList.toggle("open");
      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        icon.className = navLinksContainer.classList.contains("open")
          ? "bi bi-x-lg"
          : "bi bi-list";
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinksContainer.classList.remove("open");
        const icon = mobileMenuBtn.querySelector("i");
        if (icon) icon.className = "bi bi-list";
      });
    });
  }

  // 2. Ombre sur la barre de navigation + lien actif au défilement (ScrollSpy)
  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    const scrollPosition = window.scrollY + 140;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", onScroll);
  onScroll();

  // 3. Envoi du formulaire de contact via mailto pré-rempli
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const subject = document.getElementById("contactSubject").value.trim();
      const message = document.getElementById("contactMessage").value.trim();

      const body = `Bonjour El Hadji Malick,\n\n${message}\n\n---\nDe : ${name} (${email})`;
      const mailtoUrl = `mailto:ehmalick.sy1@univ-thies.sn?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    });
  }
});

