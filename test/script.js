document.addEventListener("DOMContentLoaded", function () {
  // Tải Header
  fetch("./header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;
    });

  // Tải Footer
  fetch("./footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    });
});
