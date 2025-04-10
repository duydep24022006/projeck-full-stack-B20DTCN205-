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
          is_starred: true, // Đánh dấu bảng là yêu thích (starred)
          created_at: "2025-02-28T12:30:00Z", // Thời gian tạo bảng
          lists: [
            // Các danh sách trong bảng
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
function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

function validateUsername(username) {
  return username.length >= 3;
}

function validateForm() {
  let usersData = getData("users");
  let users = Array.isArray(usersData) ? usersData : usersData.users || [];
  const email = document.getElementById("emailInput").value;
  const username = document.getElementById("userNameInput").value;
  const password = document.getElementById("passwordInput").value;

  if (!email || !username || !password) {
    showNotification("");
    return false;
  }
  if (!validateEmail(email)) {
    showNotification("Email không hợp lệ!");
    document.getElementById("emailInput").value = "";
    document.getElementById("userNameInput").value = "";
    document.getElementById("passwordInput").value = "";
    return false;
  }
  if (!validateUsername(username)) {
    showNotification("tên đăng nhập không hợp lệ!");
    document.getElementById("emailInput").value = "";
    document.getElementById("userNameInput").value = "";
    document.getElementById("passwordInput").value = "";
    return false;
  }
  if (!validatePassword(password)) {
    showNotification("Mât khẩu không hợp lệ!");

    document.getElementById("emailInput").value = "";
    document.getElementById("userNameInput").value = "";
    document.getElementById("passwordInput").value = "";
    return false;
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    email.value = "";
    username.value = "";
    password.value = "";
    showNotification("Emall đã tồn tại!");
    return false;
  }

  const newUser = {
    id: Date.now() + Math.floor(Math.random()),
    username: username,
    email: email,
    password: password,
    created_at: new Date().toISOString(),
    boards: [],
  };
  users.push(newUser);
  setData("users", users);
  showNotificationSuccess();
  window.location.href = "./Sign-inLayout.html";
  return true;
}

function showNotification(mess) {
  let messengerErrorContainer = document.getElementsByClassName(
    "messengerLogin-error"
  )[0];
  let errorMessChild = document.getElementById("error-messChild");

  if (!messengerErrorContainer) {
    console.error("Không tìm thấy messengerErrorContainer!");
    return;
  }

  if (!errorMessChild) {
    console.error("Không tìm thấy errorMessChild!");
    return;
  }
  errorMessChild.innerHTML =
    mess ||
    `Mật khẩu không được bỏ trống </br>
    hoặc Tên người dùng không được bỏ trống</br>
    hoặc Email không được bỏ trống`;
  messengerErrorContainer.style.visibility = "visible";
  messengerErrorContainer.style.opacity = "1";
  messengerErrorContainer.classList.add("show");

  setTimeout(() => {
    messengerErrorContainer.classList.remove("show");
    messengerErrorContainer.style.opacity = "0";
    setTimeout(() => {
      messengerErrorContainer.style.visibility = "hidden";
    }, 1000);
  }, 3000);
}

function showNotificationSuccess() {
  const notification = document.getElementsByClassName(
    "messengerLogin-Success"
  )[0];

  if (!notification) {
    console.error("Không tìm thấy messengerLogin-Success!");
    return;
  }

  notification.style.visibility = "visible";
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.style.visibility = "hidden";
    }, 1000);
  }, 5000);
}
function hiddenmessengerError() {
  const messengerErrorContainer = document.getElementsByClassName(
    "messengerLogin-error"
  )[0];
  if (!messengerErrorContainer) {
    console.error("Không tìm thấy messengerErrorContainer!");
    return;
  }
  messengerErrorContainer.style.opacity = "0";

  messengerErrorContainer.classList.remove("show");
  messengerErrorContainer.style.visibility = "hidden";
}
function setData(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

function getData(name) {
  return JSON.parse(localStorage.getItem(name)) || data.users;
}
document
  .getElementById("BaseCloseButton")
  .addEventListener("click", hiddenmessengerError);

window.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("registerBtn")
    .addEventListener("click", validateForm);
});
