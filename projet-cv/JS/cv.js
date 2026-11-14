document.addEventListener("DOMContentLoaded", function () {
  // Bouton d'impression / Export PDF A4 direct
  const printBtn = document.getElementById("btn-print-cv");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }

  // Déclenchement automatique de l'impression si l'URL contient ?print=1
  const params = new URLSearchParams(window.location.search);
  if (params.get("print") === "1") {
    setTimeout(() => {
      window.print();
    }, 350);
  }
});
