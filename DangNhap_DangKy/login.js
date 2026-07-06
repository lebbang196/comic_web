document.addEventListener("DOMContentLoaded", function () {
  // Toggle hiển thị mật khẩu
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    const icon = this.querySelector("i");
    icon.classList.toggle("bi-eye");
    icon.classList.toggle("bi-eye-slash");
  });

  // Xử lý đăng nhập
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput2 = document.getElementById("password");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  // Hàm lấy danh sách users từ localStorage
  function getUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  }

  // Hàm lưu users
  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Validate email
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput2.value.trim();

    let isValid = true;

    // Reset lỗi
    emailError.textContent = "";
    passwordError.textContent = "";

    // Validate email
    if (!email) {
      emailError.textContent = "Vui lòng nhập email.";
      isValid = false;
    } else if (!validateEmail(email)) {
      emailError.textContent = "Email không hợp lệ.";
      isValid = false;
    }

    // Validate password
    if (!password) {
      passwordError.textContent = "Vui lòng nhập mật khẩu.";
      isValid = false;
    } else if (password.length < 6) {
      passwordError.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
      isValid = false;
    }

    if (!isValid) return;

    // Kiểm tra tài khoản
    const users = getUsers();
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      // Lưu trạng thái đăng nhập
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      // Ghi nhớ đăng nhập nếu checkbox được chọn
      const remember = document.getElementById("remember").checked;
      if (remember) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      // Chuyển hướng về trang chủ với thông báo
      window.location.href = "/index.html?login=success";
    } else {
      // Kiểm tra xem email có tồn tại không để đưa ra thông báo phù hợp
      const userExists = users.some((user) => user.email === email);
      if (userExists) {
        passwordError.textContent = "Mật khẩu không chính xác.";
      } else {
        emailError.textContent = "Email chưa được đăng ký.";
      }
    }
  });

  // Nếu đã đăng nhập rồi, chuyển hướng về trang chủ
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    // Nếu đang ở trang login, chuyển về index
    window.location.href = "/index.html";
  }

  // Tự động điền email nếu có rememberMe
  const rememberMe = localStorage.getItem("rememberMe");
  if (rememberMe === "true") {
    const users = getUsers();
    if (users.length > 0) {
      // Có thể điền email của user cuối cùng đã đăng nhập
      // Ở đây đơn giản là lấy user đầu tiên trong danh sách
      // Hoặc có thể lưu riêng email đã nhớ
      const lastEmail = localStorage.getItem("lastEmail");
      if (lastEmail) {
        emailInput.value = lastEmail;
        document.getElementById("remember").checked = true;
      }
    }
  }
});
