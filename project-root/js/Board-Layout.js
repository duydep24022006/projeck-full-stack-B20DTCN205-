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
          color: "linear-gradient(to bottom right, #ffb100, #fa0c00)",
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
const urlParams = new URLSearchParams(window.location.search);
const boardId = urlParams.get("boardId");
let currentUser = getData("currentUser");
let boardsTitle = currentUser.boards.filter((board) => boardId == board.id);

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
document.getElementById("text-Close").addEventListener("click", function () {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, close it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
});

document.getElementById("Boards").addEventListener("click", function () {
  window.location.href = "../index.html";
});

function renderBoard() {
  let currentUser = getData("currentUser");
  let boardId = new URLSearchParams(window.location.search).get("boardId");
  const boardContainer = document.getElementById("main-boards-bottom");
  boardContainer.innerHTML = "";
  let board = currentUser.boards.find((b) => b.id == boardId);
  if (!board || !board.lists || !boardContainer) return;

  boardContainer.innerHTML = board.lists
    .map((list,index) => {
      return `
        <div class="bottom-item ${list.title}">
          <div class="top">
            <div class="top-left">${list.title}</div>
            <div class="top-rigth">
              <img src="../assets/icon/Vector1.svg" width="17" height="7.59" alt="..." />
              <img src="../assets/icon/Frame (1).svg" width="16" height="16" alt="..." />
            </div>
          </div>
          <div class="content">
            ${
              list.tasks && list.tasks.length
                ? list.tasks
                    .map((task) => {
                      return `
                      <div class="item ${task.done ? "item1" : "item2"}">
                        ${
                          task.done
                            ? `<span><img src="../assets/img/check_circle.png" width="20" height="20" alt="..." /></span>`
                            : ""
                        }
                        ${task.title}
                      </div>
                    `;
                    })
                    .join("")
                : ""
            }
          </div>
          <div class="footer">
            <div class="top-left">
              <span><img src="../assets/icon/Frame (2).svg" width="16" height="16" alt="..." /></span>
              &nbsp;Add a card
            </div>
            <div class="top-rigth">
              <img src="../assets/icon/Button - Create from template….svg" width="32" height="32" alt="..." onclick="deletedList(${index})"/>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  boardContainer.innerHTML += `
    <div class="add-List-container">
      <div class="bottom-item Add-another-list" onclick="showInputAddlistName()">
        <span><img src="../assets/icon/Frame (2).svg" width="16" height="16" alt="..." /></span>
        &nbsp;Add another list
      </div>
      <div class="bottom-item add-List-Input">
        <input type="text" id="nameNewList" placeholder="  Enter list name...">
        <div id="messNameNewList">Bạn không đc để trống tên!</div>
        <div class="inputBtn">
          <button class="btn btn-primary" id="btnName" type="submit" onclick="NewList()">Add list</button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span><i class="fa-regular fa-x" id="exitBtn" onclick="hiddenInputAddName()"></i></span>
        </div>
      </div>
    </div>
  `;
}

renderBoard();
function showInputAddlistName() {
  let addAnotherList = document.querySelector(".Add-another-list");
  let addListInput = document.querySelector(".add-List-Input");
  if (
    addListInput.style.display === "none" ||
    addListInput.style.display === ""
  ) {
    addAnotherList.style.display = "none";
    addListInput.style.display = "block";
  }
}
function hiddenInputAddName() {
  let addAnotherList = document.querySelector(".Add-another-list");
  let addListInput = document.querySelector(".add-List-Input");
  if (
    addAnotherList.style.display === "none" ||
    addAnotherList.style.display === ""
  ) {
    addListInput.style.display = "none";
    addAnotherList.style.display = "block";
    document.getElementById("nameNewList").value = "";
  }
}
function NewList() {
  let currentUser = getData("currentUser");
  let users = getData("users");

  let nameNewList = document.getElementById("nameNewList").value.trim();
  let messNameNewList = document.getElementById("messNameNewList");
  if (!nameNewList) {
    messNameNewList.style.display = "block";
    setTimeout(() => {
      messNameNewList.style.display = "none";
    }, 3000);
    return;
  }
    let newList = {
      id: Date.now() + Math.floor(Math.random()),
      title: nameNewList,
      created_at: new Date().toISOString(),
      tasks: [],
    };

    // Tìm board đang mở
    let board = currentUser.boards.find((b) => b.id == boardId);
    if (board) {
      board.lists.push(newList); 
    }

    let updatedUsers = users.map((user) => {
      if (user.id === currentUser.id) {
        return currentUser;
      }
      return user;
    });

    setData("users", updatedUsers);
    setData("currentUser", currentUser);
  document.getElementById("nameNewList").value = "";
  renderBoard();
}
function deletedList(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}
function getData(name) {
  return JSON.parse(localStorage.getItem(name)) || data.users;
}

function setData(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}
