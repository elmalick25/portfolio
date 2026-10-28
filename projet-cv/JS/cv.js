document.addEventListener("DOMContentLoaded", function () {
  // Déclenchement automatique de l'impression si l'URL contient ?print=1
  const params = new URLSearchParams(window.location.search);
  if (params.get("print") === "1") {
    setTimeout(() => {
      window.print();
    }, 300);
  }
});
