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
                      title: "123",
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
let selectedListsId = null;
let selectedTasksId = null;

const urlParams = new URLSearchParams(window.location.search);
const boardId = urlParams.get("boardId");
if (!boardId) {
  window.location.href = "../index.html";
}
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
      let currentUser = getData("currentUser");
      let users = getData("users");
      let index = currentUser.boards.find((b) => b.id == boardId);
      if (index === -1) {
        console.error("Board not found");
        return;
      }
      index.is_closet = true;
      const userIndex = users.findIndex(
        (u) => u.username === currentUser.username
      );

      if (userIndex !== -1) users[userIndex] = currentUser;
      setData("users", users);
      setData("currentUser", currentUser);
      window.location.href = "../index.html";
      renderBoard();
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

function getData(name) {
  return JSON.parse(localStorage.getItem(name)) || data.users;
}

function setData(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

function renderBoard() {
  let currentUser = getData("currentUser");
  const boardContainer = document.getElementById("main-boards-bottom");
  let StarOrUnstarBoard = document.querySelector(".Star-or-unstar-board");

  boardContainer.innerHTML = "";
  let board = currentUser.boards.find((b) => b.id == boardId);

  StarOrUnstarBoard.innerHTML = board.is_starred
    ? '<i class="fa-solid fa-star" id="Star-board" style="color: gold;"></i>'
    : '<i class="fa-regular fa-star" id="Star-unstar-board"></i>';

  if (!board || !board.lists || !boardContainer) return;

  boardContainer.innerHTML = board.lists
    .map((list, index) => {
      return `
         <div class="bottom-item ${list.title}" data-list-id="${list.id}">
          <div class="top">
            <div class="top-left">
              <p id="titleName">${list.title}</p>
              <input type="text" id="editNameTitle" data-index="${index}" onkeydown="handleUpdateListTitle(event)" >
            </div>
            <div class="top-rigth">
              <img src="../assets/icon/Frame (1).svg" width="16" height="16" alt="..."  onclick="showInputEditCardName('${
                list.title
              }')"/>
            </div>
          </div>
          <div class="content">
            ${
              list.tasks && list.tasks.length
                ? list.tasks
                    .map((task) => {
                      return `
                      <div onclick="showTaskDetailModal('${task.title}','${
                        task.id
                      }','${list.id}')" class="item  ${
                        task.status !== "pending" ? "item1" : "item2"
                      }">
                        ${
                          task.status !== "pending"
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
            <div class="topContainer top-left "onclick="showInputAddCardName('${
              list.id
            }')">
              <span><img src="../assets/icon/Frame (2).svg" width="16" height="16" alt="..." /></span>
              &nbsp;Add a card
            </div>
            <div class="topContainer top-rigth">
              <img src="../assets/icon/Button - Create from template….svg" width="32" height="32" alt="..." onclick="deletedList( ${index})"/>
            </div>
          </div>
          <div class="add-card-Input">
            <input type="text" id="nameNewCard" placeholder="  Enter a title or paste a link">
            <div class="messNameNewList">Không đc để trống Tên!</div>
            <div class="inputBtn">
              <button class="btn btn-primary" id="btnAddCard" type="submit" onclick="newCard(${
                list.id
              })">Add card</button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span><i class="fa-regular fa-x" id="exitBtn" onclick="hiddenInputAddCardName()"></i></span>
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
        <div class="messNameNewList">Không đc để trống tên!</div>
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
function renderYourBoards() {
  const currentUser = getData("currentUser");
  if (!currentUser) {
    console.warn("Chưa đăng nhập hoặc currentUser không tồn tại.");
    return;
  }

  const boardContainer = document.querySelector(".content");
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
      <div class="content-item">
        <div class="item1-backgr" style="${bgStyle}; width: 24px; height: 20px; border-radius: 4px;"></div>
        <p>${board.title}</p>
      </div>
    `;

    boardContainer.innerHTML += html;
  });
}

renderYourBoards();
document
  .querySelector(".Star-or-unstar-board")
  .addEventListener("click", function () {
    let currentUser = getData("currentUser");
    let boardId = new URLSearchParams(window.location.search).get("boardId");
    let board = currentUser.boards.find((b) => b.id == boardId);

    board.is_starred = !board.is_starred;
    let users = getData("users");
    let userIndex = users.findIndex(
      (user) => user.username === currentUser.username
    );
    if (userIndex !== -1) {
      users[userIndex] = currentUser;
      setData("users", users);
      setData("currentUser", currentUser);
    }

    renderBoard();
  });
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
  let messNameNewList =
    document.getElementsByClassName("messNameNewList")[1] ||
    document.getElementsByClassName("messNameNewList")[0];

  if (!nameNewList || nameNewList === "") {
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
  renderBoard();
  document.getElementById("nameNewList").value = "";
}
function showInputAddCardName(listsId) {
  selectedListsId = listsId;
  document.querySelectorAll(".add-card-Input").forEach((el) => {
    el.style.display = "none";
  });
  const listContainer = document.querySelector(
    `.bottom-item[data-list-id="${listsId}"]`
  );
  if (!listContainer) return;
  listContainer.querySelectorAll(".topContainer").forEach((el) => {
    el.style.display = "none";
  });
  const addCardInput = listContainer.querySelector(".add-card-Input");
  if (addCardInput) {
    addCardInput.style.display = "block";
  }
}

function hiddenInputAddCardName() {
  let topContainers = document.querySelectorAll(".topContainer");
  let addCardInput = document.querySelector(".add-card-Input");
  if (
    addCardInput.style.display === "block" ||
    addCardInput.style.display === ""
  ) {
    addCardInput.style.display = "none";

    topContainers.forEach((item) => {
      item.style.display = "block";
    });
    document.getElementById("nameNewCard").value = "";
  }
}
function newCard(listId) {
  let currentUser = getData("currentUser");
  let users = getData("users");
  let boardId = new URLSearchParams(window.location.search).get("boardId");
  let board = currentUser.boards.find((b) => b.id == boardId);
  if (!board) return;
  let listContainer = document.querySelector(
    `.bottom-item[data-list-id="${listId}"]`
  );
  if (!listContainer) return;
  let nameNewCardInput = listContainer.querySelector("#nameNewCard");
  let nameNewCard = nameNewCardInput?.value.trim();
  let messNameNewList = listContainer.querySelector(".messNameNewList");

  if (!nameNewCard || nameNewCard === "") {
    if (messNameNewList) {
      messNameNewList.style.display = "block";
      setTimeout(() => {
        messNameNewList.style.display = "none";
      }, 3000);
    }
    return;
  }

  let newCard = {
    id: Date.now() + Math.floor(Math.random()),
    title: nameNewCard,
    description: "Tạo wireframe cho trang chủ",
    status: "pending",
    due_date: "2025-03-05T23:59:59Z",
    tags: [],
    created_at: new Date().toISOString(),
  };

  let listIndex = board.lists.findIndex((l) => l.id == listId);
  if (listIndex !== -1) {
    board.lists[listIndex].tasks.push(newCard);
  }

  let updatedUsers = users.map((user) => {
    return user.id === currentUser.id ? currentUser : user;
  });

  setData("users", updatedUsers);
  setData("currentUser", currentUser);
  renderBoard();
  if (nameNewCardInput) nameNewCardInput.value = "";
}

function showInputEditCardName(title) {
  let titleName = document.getElementById("titleName");
  let editNameTitle = document.getElementById("editNameTitle");

  if (
    editNameTitle.style.display === "none" ||
    editNameTitle.style.display === ""
  ) {
    document.getElementById("editNameTitle").value = title;
    titleName.style.display = "none";
    editNameTitle.style.display = "block";
  } else {
    editNameTitle.style.display = "none";
    titleName.style.display = "block";
    document.getElementById("titleName").value = "";
  }
}
document.querySelectorAll("input[id^='nameNewList']").forEach((input) => {
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      let index = parseInt(this.dataset.index);
      editTitle(index);
    }
  });
});

function handleUpdateListTitle(event) {
  if (event.key === "Enter") {
    let input = event.target;
    let newTitle = input.value.trim();
    let index = input.getAttribute("data-index");
    if (newTitle) {
      updateListTitle(index, newTitle);
    }
  }
}

function updateListTitle(index, newTitle) {
  let currentUser = getData("currentUser");
  let users = getData("users");

  let board = currentUser.boards.find((b) => b.id == boardId);
  if (!board) return;

  board.lists[index].title = newTitle;

  let updatedUsers = users.map((user) =>
    user.id === currentUser.id ? currentUser : user
  );

  setData("users", updatedUsers);
  setData("currentUser", currentUser);
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
      let currentUser = getData("currentUser");
      let users = getData("users");
      let currentBoard = currentUser.boards.find((b) => b.id == boardId);
      if (!currentBoard) {
        console.error("Board not found");
        return;
      }
      currentBoard.lists.splice(index, 1);
      const userIndex = users.findIndex(
        (u) => u.username === currentUser.username
      );
      if (userIndex !== -1) users[userIndex] = currentUser;
      setData("users", users);
      setData("currentUser", currentUser);
      renderBoard();
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}

document.getElementById("FiltersTasts").addEventListener("click", filterShow);
document.getElementById("cancelFilter").addEventListener("click", filterShow);
function filterShow() {
  let FilterDropdown = document.querySelector(".FilterDropdown");
  let body = document.body;
  if (
    FilterDropdown.style.display === "none" ||
    FilterDropdown.style.display === ""
  ) {
    FilterDropdown.style.display = "block";
    body.classList.add("body-color");
  } else {
    FilterDropdown.style.display = "none";
    body.classList.remove("body-color");
  }
}
let currentList = null;
let TaskIndex = null;
function showTaskDetailModal(title, idTasks, idLists) {
  selectedListsId = idLists;
  selectedTasksId = idTasks;
  let TaskDetailModal = document.querySelector(".Task-Detail-Modal");
  let statusTasksBtn = document.getElementById("statusTasksBtn");
  let currentUser = getData("currentUser");
  let currentBoard = currentUser.boards.find((b) => b.id == boardId);
  if (!currentBoard) {
    console.error("Board not found");
    return;
  }
  currentList = currentBoard.lists.find((l) => l.id == selectedListsId);
  TaskIndex = currentList.tasks.findIndex((t) => t.id == selectedTasksId);

  statusTasksBtn.innerHTML =
    currentList.tasks[TaskIndex].status !== "pending"
      ? '<img src="../assets/img/check_circle.png" width="16" height="16" alt="..." />'
      : '<img src="../assets/icon/Img - Incomplete.svg" width="16" height="16" alt="..." />';

  document.getElementById("nameCardchilden").innerText = title;

  let body = document.body;
  if (
    TaskDetailModal.style.display === "none" ||
    TaskDetailModal.style.display === ""
  ) {
    TaskDetailModal.style.display = "block";
    body.classList.add("body-color");
  } else {
    TaskDetailModal.style.display = "none";
    body.classList.remove("body-color");
  }
}
function hidenTaskDetailModal() {
  let body = document.body;
  let TaskDetailModal = document.querySelector(".Task-Detail-Modal");
  if (TaskDetailModal.style.display === "block") {
    TaskDetailModal.style.display = "none";
    body.classList.remove("body-color");
    myEditor.setData("");
  }
}
document
  .getElementById("statusTasksBtn")
  .addEventListener("click", function () {
    let currentUser = getData("currentUser");
    let users = getData("users");

    let boardIndex = currentUser.boards.findIndex((item) => item.id == boardId);
    if (boardIndex === -1) {
      console.error("Board not found");
      return;
    }

    let listIndex = currentUser.boards[boardIndex].lists.findIndex(
      (item) => item.id == selectedListsId
    );
    if (listIndex === -1) {
      console.error("List not found");
      return;
    }

    let taskIndex = currentUser.boards[boardIndex].lists[
      listIndex
    ].tasks.findIndex((item) => item.id == selectedTasksId);
    if (taskIndex === -1) {
      console.error("Task not found");
      return;
    }

    let task = currentUser.boards[boardIndex].lists[listIndex].tasks[taskIndex];
    task.status = task.status === "pending" ? "Completed" : "pending";

    const statusTasksBtn = document.getElementById("statusTasksBtn");
    statusTasksBtn.innerHTML =
      task.status !== "pending"
        ? '<img src="../assets/img/check_circle.png" width="16" height="16" alt="Chưa hoàn thành" />'
        : '<img src="../assets/icon/Img - Incomplete.svg" width="16" height="16" alt="Đã hoàn thành" />';
    setData("currentUser", currentUser);
    let userIndex = users.findIndex((user) => user.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = currentUser;
      setData("users", users);
    }
    renderBoard();
  });

function DeleteTasksCard() {
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
      let currentUser = getData("currentUser");
      let users = getData("users");

      let currentBoard = currentUser.boards.find((b) => b.id == boardId);
      if (!currentBoard) {
        console.error("Board not found");
        return;
      }

      let currentList = currentBoard.lists.find((l) => l.id == selectedListsId);
      let TaskIndex = currentList.tasks.findIndex(
        (t) => t.id == selectedTasksId
      );

      currentList.tasks.splice(TaskIndex, 1);
      const userIndex = users.findIndex(
        (u) => u.username === currentUser.username
      );

      if (userIndex !== -1) users[userIndex] = currentUser;
      setData("users", users);
      setData("currentUser", currentUser);

      renderBoard();
      hidenTaskDetailModal();
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}

document.getElementById("starredBoards").addEventListener("click", function () {
  window.location.href = `./Starred-Boards.html`;
});

document.getElementById("closedBoards").addEventListener("click", function () {
  window.location.href = `./Closed-Boards.html`;
});

document
  .getElementById("DeleteTasksCard")
  .addEventListener("click", DeleteTasksCard);
document
  .getElementById("cancelBtnTask")
  .addEventListener("click", hidenTaskDetailModal);

let myEditor;
document.addEventListener("DOMContentLoaded", function () {
  ClassicEditor.create(document.querySelector("#editorInput"))
    .then((editor) => {
      myEditor = editor;
    })
    .catch((error) => {
      console.error("Có lỗi xảy ra khi khởi tạo CKEditor:", error);
    });
});
const picker = new Litepicker({
  element: document.getElementById("inline-picker"),
  inlineMode: true,
  singleMode: true,
  autoApply: true,
  showTime: true,
  timeFormat: "HH:mm",
  format: "YYYY-MM-DD HH:mm",
  setup: (picker) => {
    picker.on("selected", (dateObj) => {
      try {
        const date = dateObj.dateInstance;
        if (!(date instanceof Date) || isNaN(date.getTime())) return;

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");

        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;

        if (document.getElementById("startCheckbox").checked) {
          document.getElementById(
            "startDateInput"
          ).value = `${month}-${day}-${year}`;
        }

        if (document.getElementById("endCheckbox").checked) {
          document.getElementById(
            "endDateInput"
          ).value = `${month}-${day}-${year}`;
          document.getElementById(
            "endTimerInput"
          ).value = `${formattedHours}:${minutes} ${ampm}`;
        }
      } catch (error) {
        console.error("Lỗi xử lý ngày:", error);
      }
    });
  },
});

const toggleInputState = (checkboxId, inputIds) => {
  const checkbox = document.getElementById(checkboxId);
  const inputs = inputIds.map((id) => document.getElementById(id));

  const updateState = () => {
    const isChecked = checkbox.checked;
    inputs.forEach((input) => (input.disabled = !isChecked));
  };

  checkbox.addEventListener("change", updateState);
  updateState();
};

toggleInputState("startCheckbox", ["startDateInput"]);
toggleInputState("endCheckbox", ["endDateInput", "endTimerInput"]);

document
  .getElementById("startDateInput")
  .addEventListener("input", function () {
    if (this.value && document.getElementById("endCheckbox").checked) {
      const [month, day, year] = this.value.split("-").map(Number);
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year > 0) {
        const newDate = new Date(year, month - 1, day);
        picker.setDate(newDate);
      }
    }
  });

document.getElementById("endTimerInput").addEventListener("input", function () {
  if (this.value && document.getElementById("endCheckbox").checked) {
    const [time, modifier] = this.value.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Validate giờ/phút
    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return;

    // Chuyển đổi sang 24h
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const currentDate = picker.getDate();
    if (currentDate && !isNaN(currentDate.getTime())) {
      currentDate.setHours(hours);
      currentDate.setMinutes(minutes);
      picker.setDate(currentDate);
    }
  }
});

const getInputValues = () => {
  try {
    const endDate = document.getElementById("endDateInput").value;
    const endTime = document.getElementById("endTimerInput").value;
    const dateRegex = /^\d{1,2}-\d{1,2}-\d{4}$/;
    const timeRegex = /^(1[0-2]|0?[1-9]):[0-5][0-9] [AP]M$/;
    if (!dateRegex.test(endDate) || !timeRegex.test(endTime)) {
      throw new Error(
        "Vui lòng nhập đúng định dạng (VD: 03-05-2025 và 11:59 PM)"
      );
    }

    const [month, day, year] = endDate.split("-").map(Number);
    const [time, modifier] = endTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31 ||
      hours < 1 ||
      hours > 12 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new Error("Giá trị không hợp lệ (VD: 31-04-2023 không tồn tại)");
    }
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const dateUTC = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    if (isNaN(dateUTC.getTime())) throw new Error("Ngày/giờ không hợp lệ");

    return {
      due_date: dateUTC.toISOString(),
    };
  } catch (error) {
    console.error("Lỗi:", error.message);
    return { startDate: "", due_date: "" };
  }
};

function ShowTimerDueDate() {
  let calendarContainer = document.querySelector(".calendar-container");

  if (
    calendarContainer.style.display === "none" ||
    calendarContainer.style.display === ""
  ) {
    calendarContainer.style.display = "block";
  } else {
    calendarContainer.style.display = "none";
  }
}

function showTaskDetailLabels() {
  let TaskDetailLabels = document.querySelector(".Task-Detail-Labels");

  if (
    TaskDetailLabels.style.display === "none" ||
    TaskDetailLabels.style.display === ""
  ) {
    TaskDetailLabels.style.display = "block";
  } else {
    TaskDetailLabels.style.display = "none";
  }
}
function showAddLabelDropdown() {
  let addLabelDropdown = document.querySelector(".Add-label-dropdown");

  if (
    addLabelDropdown.style.display === "none" ||
    addLabelDropdown.style.display === ""
  ) {
    addLabelDropdown.style.display = "block";
  } else {
    addLabelDropdown.style.display = "none";
  }
}
function showEditLabelDropdown() {
  let addLabelDropdown = document.querySelector(".Add-label-dropdown");
  const createLabelLayout = document.querySelectorAll(".Create-label-layout");
  const editLabelLayout = document.querySelectorAll(".Edit-label-layout");
  if (
    addLabelDropdown.style.display === "none" ||
    addLabelDropdown.style.display === ""
  ) {
    addLabelDropdown.style.display = "block";
    createLabelLayout.forEach((el) => {
      el.style.display = "none";
    });
    editLabelLayout.forEach((el) => {
      el.style.display = "block";
    });
  } else {
    addLabelDropdown.style.display = "none";
    addLabelDropdown.style.display = "block";
    createLabelLayout.forEach((el) => {
      el.style.display = "block";
    });
    editLabelLayout.forEach((el) => {
      el.style.display = "none";
    });
  }
}
document
  .getElementById("dueDateBtn")
  .addEventListener("click", ShowTimerDueDate);
document
  .getElementById("hidenDuedate")
  .addEventListener("click", ShowTimerDueDate);
document
  .getElementById("labelBtn")
  .addEventListener("click", showTaskDetailLabels);
document
  .getElementById("hidenLabel")
  .addEventListener("click", showTaskDetailLabels);
document
  .getElementById("Create-a-new-label")
  .addEventListener("click", showAddLabelDropdown);
document.getElementById("extiNewEditlabel").addEventListener("click", () => {
  showEditLabelDropdown();
  showAddLabelDropdown();
});
document.getElementById("extiNewEditlabel2").addEventListener("click", () => {
  showEditLabelDropdown();
  showAddLabelDropdown();
});
document
  .getElementById("editlabelbtn")
  .addEventListener("click", showEditLabelDropdown);

document.getElementById("saveDateBtn").addEventListener("click", () => {
  const values = getInputValues();
  setData("due-date", values);
  ShowTimerDueDate();
});
document.getElementById("removeDateBtn").addEventListener("click", () => {
  document.getElementById("startDateInput").value = "";
  document.getElementById("endDateInput").value = "";
  document.getElementById("endTimerInput").value = "";
});
document
  .getElementById("saveTaskDetailModal")
  .addEventListener("click", async function () {
    try {
      const inputText = myEditor.getData().trim();
      const messageBox = document.getElementById("messSaveTaskValidate");

      if (!inputText) {
        showValidationError(messageBox, "No description provided.");
        return;
      }

      const currentUser = getData("currentUser");
      const users = getData("users");
      const dueDate = getData("due-date");

      if (!currentUser || !users || !dueDate) {
        throw new Error("Missing critical data");
      }

      const currentBoard = currentUser.boards.find((b) => b.id == boardId);
      if (!currentBoard) {
        throw new Error("Board not found");
      }

      const currentList = currentBoard.lists.find(
        (l) => l.id == selectedListsId
      );
      if (!currentList) {
        throw new Error("List not found");
      }

      const taskIndex = currentList.tasks.findIndex(
        (t) => t.id == selectedTasksId
      );
      if (taskIndex === -1) {
        throw new Error("Task not found");
      }

      const updatedTask = {
        ...currentList.tasks[taskIndex],
        description: inputText,
        due_date: dueDate.due_date,
      };

      currentList.tasks[taskIndex] = updatedTask;

      const userIndex = users.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = currentUser;
      }
      await setData("users", users);
      await setData("currentUser", currentUser);
      renderBoard();
      hidenTaskDetailModal();
    } catch (error) {
      console.error("Error saving task:", error);
      showErrorMessage(error.message);
    }
  });

function showValidationError(container, message) {
  container.innerHTML = `<p style="font-style: italic; color: red;">${message}</p>`;
  setTimeout(() => (container.innerHTML = ""), 3000);
}

function showErrorMessage(message) {
  const errorContainer = document.getElementById("error-messages");
  if (errorContainer) {
    errorContainer.innerHTML = `<div class="alert">${message}</div>`;
    setTimeout(() => (errorContainer.innerHTML = ""), 5000);
  }
}

function rendertags() {
  
}
