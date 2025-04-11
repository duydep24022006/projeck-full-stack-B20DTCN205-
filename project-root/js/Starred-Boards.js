document.addEventListener("DOMContentLoaded", function () {
  var headerCss = document.createElement("link");
  headerCss.rel = "stylesheet";
  headerCss.href = "../components/header.css";
  document.head.appendChild(headerCss);

  fetch("../components/header-Board-Layout.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("frame-header").innerHTML = data;
      const menuBtn = document.getElementById("menuBtn");
      if (menuBtn) {
        menuBtn.addEventListener("click", toggleMenu);
      }
    })
    .catch((error) => console.error("Fetch error:", error));
});
