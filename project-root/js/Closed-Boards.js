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
          is_closet: false,
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

const currentUser = getData("currentUser");
if (!currentUser) {
  window.location.href = "./pages/Sign-inLayout.html";
}

document.getElementById("signOutBtn").addEventListener("click", () => {
  Swal.fire({
    title: "Bạn có chắc muốn đăng xuất?",
    text: "Sau khi đăng xuất, bạn sẽ cần đăng nhập lại.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Đăng xuất",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Đã đăng xuất!",
        text: "Bạn đã đăng xuất thành công.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("BoardLayout");

        window.location.href = "./pages/Sign-inLayout.html";
      });
    }
  });
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

  const boardContainer = document.querySelector(".main-boards-bottom");
  boardContainer.innerHTML = "";

  currentUser.boards.forEach((board, index) => {
    let background = board.backdrop;

    const isImage =
      background.startsWith("http") ||
      background.startsWith("./") ||
      background.startsWith("../");

    const isOnlineImage = background.startsWith("http");

    const bgStyle = isImage
      ? `background-image: url('${
          isOnlineImage ? background : `.${background}`
        }'); background-size: cover; background-position: center;`
      : `background: ${background};`;

    let html = `  
      <div class="createBoard" style="
        ${bgStyle}
        width: 256px; height: 130px; border-radius: 5px;"
      >
        <button id="boardsTitle" onclick="editBoardLayout(${board.id})">
          ${board.title}
        </button>
        <button id="EditThisBoard" onclick="toggleEditBoard(${index})">
          <span>
            <img
              src="../assets/icon/Vector (1).svg"
              width="16"
              height="16"
              alt="..."
            />
          </span>
          Edit this board
        </button>
      </div>
    `;

    if (board.is_closet) {
      boardContainer.innerHTML += html;
    }
  });
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
function hideNewBoard() {
  let ModalBoard = document.querySelector(".Modal-Create-new-board");
  let body = document.body;
  if (window.getComputedStyle(ModalBoard).display !== "none") {
    ModalBoard.style.display = "none";
    clearInput();
    body.classList.remove("body-color");
  }
}
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
  } else {
    ModalBoard.style.display = "none";
    document.querySelectorAll(".update-mode ").forEach((el) => {
      el.style.display = "none";
    });
    document.querySelectorAll(".create-mode").forEach((el) => {
      el.style.display = "inline-block";
    });
    body.classList.add("body-color");
  }
}
function newBoard() {
  let titleName = document.getElementById("Board-title-input").value.trim();
  if (!titleName) {
    document.getElementById("messError").style.display = "block";
    setTimeout(() => {
      document.getElementById("messError").style.display = "none";
    }, 3000);
    return;
  }
  let currentUser = getData("currentUser");
  let users = getData("users");
  let newBoard = {
    id: Date.now() + Math.floor(Math.random()),
    title: titleName,
    description: "Quản lý tiến độ dự án website",
    backdrop: colorInput || imgInput,
    is_starred: false,
    is_closet: false,
    created_at: new Date().toISOString(),
    lists: [],
  };
  currentUser.boards.push(newBoard);
  let updatedUsers = users.map((user) => {
    if (user.id === currentUser.id) {
      return currentUser;
    }
    return user;
  });
  board.boards.push(newBoard);
  setData("users", updatedUsers);
  setData("currentUser", board);
  hideNewBoard();
  clearInput();
  renderBoards();
}
function toggleEditBoard(index) {
  let ModalBoard = document.querySelector(".Modal-Create-new-board");
  let body = document.body;
  let currentUser = getData("currentUser");
  document.getElementById("Board-title-input").value =
    currentUser.boards[index].title;
  if (ModalBoard.style.display === "none" || ModalBoard.style.display === "") {
    ModalBoard.style.display = "block";
    document.querySelectorAll(".create-mode").forEach((el) => {
      el.style.display = "none";
    });
    document.querySelectorAll(".update-mode").forEach((el) => {
      el.style.display = "inline-block";
    });
    body.classList.add("body-color");
  }

  const saveBtn = document.getElementById("board-Save");

  const newSaveHandler = function () {
    editBoard(index);
  };
  saveBtn.replaceWith(saveBtn.cloneNode(true));
  document
    .getElementById("board-Save")
    .addEventListener("click", newSaveHandler);
}

let board = getData("currentUser");

let imgInput = "./assets/img/backgr1.png";
function changeBackgroundImg(img) {
  if (!img) {
    imgInput = "./assets/img/backgr1.png";
  } else {
    imgInput = img;
  }
}
let colorInput = "";
function changeColor(color) {
  if (!color) {
    colorInput = "";
  } else {
    colorInput = color;
  }
}

function editBoard(index) {
  let titleName = document.getElementById("Board-title-input").value.trim();
  if (!titleName) {
    document.getElementById("messError").style.display = "block";
    setTimeout(() => {
      document.getElementById("messError").style.display = "none";
    }, 3000);
    return;
  }
  let currentUser = getData("currentUser");
  let users = getData("users");
  let newBoard = {
    id: Date.now() + Math.floor(Math.random()),
    title: titleName,
    description: "Quản lý tiến độ dự án website",
    backdrop: colorInput || imgInput,
    is_starred: false,
    is_closet: true,
    created_at: new Date().toISOString(),
    lists: [],
  };
  currentUser.boards.splice(index, 1, newBoard);
  let updatedUsers = users.map((user) => {
    if (user.id === currentUser.id) {
      return currentUser;
    }
    return user;
  });

  setData("users", updatedUsers);
  setData("currentUser", currentUser);

  hideNewBoard();
  clearInput();
  renderBoards();
}
function clearInput() {
  document.getElementById("Board-title-input").value = "";
  document.getElementById("messError").style.display = "none";
  imgInput = "./assets/img/backgr1.png";
  colorInput = "";
}
document.getElementById("Boards").addEventListener("click", function () {
  window.location.href = `../index.html`;
});
document.getElementById("starredBoards").addEventListener("click", function () {
  window.location.href = `./Starred-Boards.html`;
});
function editBoardLayout(id) {
  window.location.href = `../pages/Board-Layout.html?boardId=${id}`;
}

document.getElementById("board-create").addEventListener("click", newBoard);
document.getElementById("exitBtn").addEventListener("click", hideNewBoard);
document.getElementById("board-close").addEventListener("click", hideNewBoard);
