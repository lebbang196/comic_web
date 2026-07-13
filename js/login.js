document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailRow = document.getElementById("row-email");
  const passwordRow = document.getElementById("row-password");
  const emailMsg = document.getElementById("emailMsg");
  const passwordMsg = document.getElementById("passwordMsg");
  const loginForm = document.getElementById("loginForm");
  const togglePassword = document.getElementById("togglePassword");

  // Hàm kiểm tra email hợp lệ (regex)
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Hàm xóa trạng thái success/failure
  function resetRow(row) {
    row.classList.remove("success", "failure");
    const msg = row.querySelector(".notification");
    if (msg) msg.textContent = "";
  }

  // Hàm đặt lỗi cho một row
  function setError(row, message, msgElement) {
    row.classList.remove("success");
    row.classList.add("failure");
    if (msgElement) {
      msgElement.textContent = "\u274C " + message; // dấu X
    }
  }

  // Hàm đặt thành công cho một row
  function setSuccess(row, msgElement) {
    row.classList.remove("failure");
    row.classList.add("success");
    if (msgElement) {
      msgElement.textContent = "Thành công!";
    }
  }

  // ---- Validation cho Email (blur) ----
  function validateEmailOnBlur() {
    const email = emailInput.value.trim();

    // Xóa thông báo cũ
    emailMsg.textContent = "";

    if (email === "") {
      setError(emailRow, "Vui lòng nhập email!", emailMsg);
      return;
    }

    if (!isValidEmail(email)) {
      setError(emailRow, "Email không hợp lệ!", emailMsg);
      return;
    }

    setSuccess(emailRow, emailMsg);
  }

  // ---- Validation cho Password (blur) ----
  function validatePasswordOnBlur() {
    const password = passwordInput.value;

    passwordMsg.textContent = "";

    if (password === "") {
      setError(passwordRow, "Vui lòng nhập mật khẩu!", passwordMsg);
      return;
    }

    if (password.length < 8) {
      setError(passwordRow, "Mật khẩu phải có ít nhất 8 kí tự!", passwordMsg);
      return;
    }

    setSuccess(passwordRow, passwordMsg);
  }

  // Gán sự kiện blur
  emailInput.addEventListener("blur", validateEmailOnBlur);
  passwordInput.addEventListener("blur", validatePasswordOnBlur);

  // ---- Toggle hiển thị mật khẩu ----
  togglePassword.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    const icon = this.querySelector("i");
    icon.classList.toggle("bi-eye");
    icon.classList.toggle("bi-eye-slash");
  });

  // ---- Xử lý submit ----
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Gọi lại validation để cập nhật trạng thái mới nhất
    validateEmailOnBlur();
    validatePasswordOnBlur();

    // Kiểm tra xem cả hai row có success không
    const isEmailValid = emailRow.classList.contains("success");
    const isPasswordValid = passwordRow.classList.contains("success");

    if (!isEmailValid || !isPasswordValid) {
      alert("Form vẫn còn lỗi!");
      return;
    }

    // Nếu hợp lệ: kiểm tra tài khoản trong localStorage
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      alert("Form đã được gửi thành công! Chuyển hướng đến trang chủ!");
      window.location.href = "trangchu.html";
    } else {
      // Sai tài khoản – hiển thị lỗi chung
      const userExists = users.some((user) => user.email === email);
      if (userExists) {
        // Mật khẩu sai
        setError(passwordRow, "Mật khẩu không chính xác!", passwordMsg);
        // Đảm bảo email vẫn là success nếu hợp lệ
        if (isValidEmail(email)) {
          setSuccess(emailRow, emailMsg);
        }
      } else {
        // Email chưa đăng ký
        setError(emailRow, "Email chưa được đăng ký!", emailMsg);
        // Reset password row (vì chưa nhập)
        resetRow(passwordRow);
        passwordMsg.textContent = "";
      }
    }
  });

  // Nếu đã đăng nhập, chuyển hướng về trang chủ
  if (localStorage.getItem("currentUser")) {
    window.location.href = "trangchu.html";
  }
});
