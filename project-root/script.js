const data = {
  users: [
    {
      id: 1, // ID của người dùng
      username: "john_doe", // Tên người dùng
      email: "john@example.com", // Địa chỉ email
      password: "hashed_password", // Mật khẩu đã được mã hóa
      created_at: "2025-02-28T12:00:00Z", // Thời gian người dùng được tạo tài khoản
      boards: [
        {
          id: 101, // ID của bảng (board)
          title: "Dự án Website", // Tiêu đề bảng
          description: "Quản lý tiến độ dự án website", // Mô tả bảng
          backdrop:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/640px-Cat_August_2010-4.jpg", // Hình nền bảng
          is_starred: false, // Đánh dấu bảng là yêu thích (starred)
          created_at: "2025-02-28T12:30:00Z", // Thời gian tạo bảng
          lists: [
            {
              id: 201, // ID của danh sách
              title: "Việc cần làm", // Tiêu đề danh sách
              created_at: "2025-02-28T13:00:00Z", // Thời gian tạo danh sách
              tasks: [
                // Các công việc trong danh sách
                {
                  id: 301, // ID của công việc
                  title: "Thiết kế giao diện", // Tiêu đề công việc
                  description: "Tạo wireframe cho trang chủ", // Mô tả công việc
                  status: "pending", // Trạng thái công việc (đang chờ)
                  due_date: "2025-03-05T23:59:59Z", // Hạn chót công việc
                  tags: [
                    // Các thẻ (tags) của công việc
                    {
                      id: 401, // ID của thẻ
                      content: "Urgent", // Nội dung thẻ
                      color: "#fff", // Màu sắc của thẻ
                    },
                  ],
                  created_at: "2025-02-28T13:30:00Z", // Thời gian tạo công việc
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

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
const currentUser = getData("currentUser");
if (!currentUser) {
  window.location.href = "./pages/Sign-inLayout.html";
}

document.getElementById("signOutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "./pages/Sign-inLayout.html";
});
function getData(name) {
  return JSON.parse(localStorage.getItem(name)) || data.users;
}

function setData(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}
renderBoards();

function renderBoards() {
  const currentUser = getData("currentUser");
  if (!currentUser) {
    console.warn("Chưa đăng nhập hoặc currentUser không tồn tại.");
    return;
  }
  const starredContainer = document.querySelector(".main-starredBoards-bottom");
  const boardContainer = document.querySelector(".main-boards-bottom");

  starredContainer.innerHTML = "";
  boardContainer.innerHTML = "";

  currentUser.boards.forEach((board, index) => {
    const html = `
      <div class="createBoard">
                  <img
                    src="${board.backdrop}"
                    width="270"
                    height="130"
                    alt="..."
                  />
                  <button id="boardsTitle">${board.title}</button>
                  <button id="EditThisBoard" data-index="${index}">
                    <span
                      ><img
                        src="./assets/icon/Vector (1).svg"
                        width="16"
                        height="16"
                        alt="..." /></span
                    >Edit this board
                  </button>
                </div>
  `;
    if (board.is_starred) {
      starredContainer.innerHTML += html;
    } else {
      boardContainer.innerHTML += html;
    }
  });
  const htmlNewBoard = `
          <div class="createNewBoard">
                  <button id="NewBoard">Create new board</button>
                </div>`;
  document.querySelector(".main-boards-bottom").innerHTML += htmlNewBoard;

  document.addEventListener("DOMContentLoaded", function () {
    // Bắt sự kiện khi click nút Edit (dùng event delegation)
    document.body.addEventListener("click", function (e) {
      const newBoardBtn = e.target.closest("#NewBoard");
      if (newBoardBtn) {
        console.log(" Tạo board mới");
        return;
      }
      const editBtn = e.target.closest(".EditThisBoard");
      if (editBtn) {
        const index = Number(editBtn.dataset.index);
        console.log("Vị trí board được click:", index);
      }
    });
    renderBoards();
  });
}
function addBoard() { 
  let 
}

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
document
  .getElementById("EditThisBoard")
  .addEventListener("click", toggleEditBoard);
function toggleNewBoard() {
  let ModalBoard = document.querySelector(".Modal-Create-new-board");
  let body = document.body;
  if (ModalBoard.style.display === "none" || ModalBoard.style.display === "") {
    ModalBoard.style.display = "block";
    document.querySelectorAll(" .update-mode ").forEach((el) => {
      el.style.display = "none";
    });
    document.querySelectorAll(".create-mode").forEach((el) => {
      el.style.display = "inline-block";
    });
    body.classList.add("body-color");
  }
}
function toggleEditBoard() {
  let ModalBoard = document.querySelector(".Modal-Create-new-board");

  let body = document.body;
  if (ModalBoard.style.display === "none" || ModalBoard.style.display === "") {
    ModalBoard.style.display = "block";
    document.querySelectorAll(".create-mode").forEach((el) => {
      el.style.display = "none";
    });
    document.querySelectorAll(" .update-mode ").forEach((el) => {
      el.style.display = "inline-block";
    });
    body.classList.add("body-color");
  }
}
let board = getData("currentUser");
console.log("q" + board.boards);

function deleteBoard(index) {
  let board = getData("currentUser").users.name.boards;
}

function hideNewBoard() {
  let ModalBoard = document.querySelector(".Modal-Create-new-board");
  let body = document.body;
  if (window.getComputedStyle(ModalBoard).display !== "none") {
    ModalBoard.style.display = "none";
    body.classList.remove("body-color");
  }
}

document.getElementById("exitBtn").addEventListener("click", hideNewBoard);
document.getElementById("board-close").addEventListener("click", hideNewBoard);
