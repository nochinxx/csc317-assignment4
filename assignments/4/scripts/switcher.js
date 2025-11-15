// Theme switching
document.addEventListener("DOMContentLoaded", () => {
    const link = document.getElementById("css-theme");
    document.querySelectorAll(".theme-buttons [data-theme]").forEach(btn => {
      btn.addEventListener("click", () => {
        link.href = btn.getAttribute("data-theme");
      });
    });
  });