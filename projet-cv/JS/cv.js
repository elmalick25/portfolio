document.addEventListener("DOMContentLoaded", function () {
  const printBtn = document.getElementById("btn-print-cv");
  const menuBtn = document.getElementById("btn-download-menu");
  const menu = document.getElementById("download-menu");
  const menuLabel = menuBtn ? menuBtn.querySelector(".btn-download-label") : null;
  const statusEl = document.getElementById("cv-export-status");
  const exportButtons = document.querySelectorAll("[data-export]");

  let statusTimer = null;

  function showStatus(message, isError) {
    if (!statusEl) return;
    clearTimeout(statusTimer);
    statusEl.textContent = message;
    statusEl.classList.toggle("is-error", Boolean(isError));
    statusEl.hidden = false;
    statusTimer = setTimeout(() => {
      statusEl.hidden = true;
    }, isError ? 5500 : 3200);
  }

  function setMenuOpen(open) {
    if (!menuBtn || !menu) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    });

    document.addEventListener("click", function (e) {
      if (!menu.hidden && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) {
        setMenuOpen(false);
        menuBtn.focus();
      }
    });
  }

  // Export PDF via impression A4 native
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      setMenuOpen(false);
      window.print();
    });
  }

  // Export Image Haute Définition (PNG / JPEG) à 3x (3120px de large, ~375 DPI sur A4)
  async function exportCvImage(format) {
    const sheet = document.querySelector("main.cv-sheet");
    if (!sheet) return;

    if (!window.htmlToImage) {
      showStatus("Module d'export indisponible hors-ligne. Utilisez Exporter en PDF.", true);
      return;
    }

    setMenuOpen(false);
    if (menuBtn) menuBtn.disabled = true;
    if (menuLabel) menuLabel.textContent = "Génération HD...";

    let stage = null;
    try {
      // Clone hors-écran calibré en 1040px (2 colonnes) pour une lisibilité parfaite même depuis un téléphone
      stage = document.createElement("div");
      stage.className = "cv-export-stage";
      const clone = sheet.cloneNode(true);
      stage.appendChild(clone);
      document.body.appendChild(stage);

      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const imgs = Array.from(clone.querySelectorAll("img"));
      await Promise.all(
        imgs.map((img) =>
          img.complete
            ? (img.decode ? img.decode().catch(() => {}) : Promise.resolve())
            : new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              })
        )
      );

      const exportHeight = Math.ceil(clone.scrollHeight);
      const options = {
        pixelRatio: 3,
        width: 1040,
        height: exportHeight,
        backgroundColor: "#ffffff",
        cacheBust: false,
      };

      const dataUrl =
        format === "jpeg"
          ? await window.htmlToImage.toJpeg(clone, { ...options, quality: 0.96 })
          : await window.htmlToImage.toPng(clone, options);

      const link = document.createElement("a");
      link.download = format === "jpeg" ? "CV-El-Hadji-Malick-SY.jpg" : "CV-El-Hadji-Malick-SY.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();

      showStatus(format === "jpeg" ? "CV téléchargé en JPEG HD" : "CV téléchargé en PNG HD", false);
    } catch (err) {
      console.error("Erreur export CV image:", err);
      const isFileProto = window.location.protocol === "file:";
      showStatus(
        isFileProto
          ? "Ouvrez le CV via un serveur local ou la version en ligne pour l'export image."
          : "Échec de l'export image. Réessayez ou utilisez Exporter en PDF.",
        true
      );
    } finally {
      if (stage && stage.parentNode) {
        stage.parentNode.removeChild(stage);
      }
      if (menuBtn) menuBtn.disabled = false;
      if (menuLabel) menuLabel.textContent = "Télécharger le CV";
    }
  }

  exportButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const format = btn.getAttribute("data-export");
      exportCvImage(format);
    });
  });

  // Déclenchement automatique de l'impression si l'URL contient ?print=1
  const params = new URLSearchParams(window.location.search);
  if (params.get("print") === "1") {
    setTimeout(() => {
      window.print();
    }, 350);
  }
});
