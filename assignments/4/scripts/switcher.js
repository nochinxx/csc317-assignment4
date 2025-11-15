// Theme switching
document.addEventListener("DOMContentLoaded", () => {
    const link = document.getElementById("css-theme");
    document.querySelectorAll(".theme-buttons [data-theme]").forEach(btn => {
      btn.addEventListener("click", () => {
        const theme = btn.getAttribute("data-theme");
        console.log("Switching to:", theme); // 👈 confirms click
        link.setAttribute("href", theme);
      });
    });
  });
  