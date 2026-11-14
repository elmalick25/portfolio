document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("header");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinksContainer = document.getElementById("navLinks");
  const navLinks = document.querySelectorAll(".nav-link-item");
  const sections = document.querySelectorAll("main section[id]");
  const contactForm = document.getElementById("contactForm");

  // 1. Menu mobile (ouverture / fermeture & accessibilité)
  function closeMobileMenu() {
    if (navLinksContainer && navLinksContainer.classList.contains("open")) {
      navLinksContainer.classList.remove("open");
      const icon = mobileMenuBtn ? mobileMenuBtn.querySelector("i") : null;
      if (icon) icon.className = "bi bi-list";
    }
  }

  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
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
        closeMobileMenu();
      });
    });

    // Fermeture en cas de clic en dehors du menu
    document.addEventListener("click", function (e) {
      if (header && !header.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Fermeture avec la touche Échap
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeMobileMenu();
      }
    });
  }

  // 2. Gestion de l'état actif de la barre de navigation
  function setActiveLink(id) {
    navLinks.forEach((link) => {
      const isTarget = link.getAttribute("href") === `#${id}`;
      if (isTarget) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  // 3. Ombre sur la barre de navigation + lien actif au défilement (ScrollSpy précis)
  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Si on est en bas de page, activer le dernier lien (Contact)
    const isAtBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
    if (isAtBottom && sections.length > 0) {
      const lastSection = sections[sections.length - 1];
      setActiveLink(lastSection.getAttribute("id"));
      return;
    }

    // Si on est en haut de page, activer Accueil
    if (window.scrollY < 80) {
      setActiveLink("accueil");
      return;
    }

    const scrollPosition = window.scrollY + 160;
    let currentId = "accueil";

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute("id");
      }
    });

    setActiveLink(currentId);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        const targetId = href.substring(1);
        setActiveLink(targetId);
      }
    });
  });

  // 4. Chargement dynamique au défilement (Reveal on Scroll pro & 60fps)
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  function revealElement(el) {
    el.classList.add("is-revealed");
    const langBar = el.querySelector(".lang-progress-bar");
    if (langBar && langBar.dataset.width) {
      langBar.style.width = langBar.dataset.width;
    }
  }

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        revealElement(el);
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    revealElements.forEach(revealElement);
  }

  // 5. Envoi du formulaire de contact via mailto pré-rempli
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const subject = document.getElementById("contactSubject").value.trim();
      const message = document.getElementById("contactMessage").value.trim();

      const body = `Bonjour El Hadji Malick,\n\n${message}\n\n---\nDe : ${name} (${email})`;
      const mailtoUrl = `mailto:ehmalick.sy1@univ-thies.sn?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    });
  }
});
