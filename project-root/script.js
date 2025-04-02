document.addEventListener("DOMContentLoaded", function () {
  var headerCss = document.createElement("link");
  headerCss.rel = "stylesheet";
  headerCss.href = "./components/header.css";
  document.head.appendChild(headerCss);

  fetch("./components/header.html")
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
document.querySelector(".top-trello").addEventListener("click", toggleMenu);
function toggleMenu() {
  let frameContainerBackground = document.querySelector(
    ".frame-container-background"
  );
  let topTrello = document.querySelector(".top-trello");
  let body = document.body;

  if (
    frameContainerBackground.style.display === "none" ||
    frameContainerBackground.style.display === ""
  ) {
    frameContainerBackground.style.display = "block";
    topTrello.style.display = "block";
    body.classList.add("body-color");
  } else {
    frameContainerBackground.style.display = "none";
    topTrello.style.display = "none";
    body.classList.remove("body-color");
  }
}

document.getElementById("NewBoard").addEventListener("click", toggleNewBoard);
function toggleNewBoard() {
  let ModalBoard = document.querySelector(".Modal-Create-new-board");
  let body = document.body;
  if (ModalBoard.style.display === "none" || ModalBoard.style.display === "") {
    ModalBoard.style.display = "block";
    body.classList.add("body-color");
  }
}

document.getElementById("exitBtn").addEventListener("click", hideNewBoard);
document.getElementById("board-close").addEventListener("click", hideNewBoard);

function hideNewBoard() {
  let ModalBoard = document.querySelector(".Modal-Create-new-board");
  let body = document.body;
  if (window.getComputedStyle(ModalBoard).display !== "none") {
    ModalBoard.style.display = "none";
    body.classList.remove("body-color");
  }
}
