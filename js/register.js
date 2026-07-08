document.addEventListener("DOMContentLoaded", function () {
  // Toggle hiển thị mật khẩu cho password
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

  // Toggle hiển thị mật khẩu cho confirm password
  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword",
  );
  const confirmPasswordInput = document.getElementById("confirm-password");

  toggleConfirmPassword.addEventListener("click", function () {
    const type =
      confirmPasswordInput.getAttribute("type") === "password"
        ? "text"
        : "password";
    confirmPasswordInput.setAttribute("type", type);
    const icon = this.querySelector("i");
    icon.classList.toggle("bi-eye");
    icon.classList.toggle("bi-eye-slash");
  });

  // Xử lý đăng ký
  const registerForm = document.getElementById("registerForm");
  const fullnameInput = document.getElementById("fullname");
  const emailInput = document.getElementById("email");
  const passwordInput2 = document.getElementById("password");
  const confirmPasswordInput2 = document.getElementById("confirm-password");
  const agreeCheck = document.getElementById("agree");

  const fullnameError = document.getElementById("fullnameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmError = document.getElementById("confirmError");
  const agreeError = document.getElementById("agreeError");

  function getUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  }

  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput2.value.trim();
    const confirmPassword = confirmPasswordInput2.value.trim();
    const agreed = agreeCheck.checked;

    let isValid = true;

    // Reset lỗi
    fullnameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmError.textContent = "";
    agreeError.textContent = "";

    // Validate fullname
    if (!fullname) {
      fullnameError.textContent = "Vui lòng nhập họ và tên.";
      isValid = false;
    } else if (fullname.length < 2) {
      fullnameError.textContent = "Họ tên phải có ít nhất 2 ký tự.";
      isValid = false;
    }

    // Validate email
    if (!email) {
      emailError.textContent = "Vui lòng nhập email.";
      isValid = false;
    } else if (!validateEmail(email)) {
      emailError.textContent = "Email không hợp lệ.";
      isValid = false;
    } else {
      // Kiểm tra email đã tồn tại chưa
      const users = getUsers();
      if (users.some((user) => user.email === email)) {
        emailError.textContent = "Email này đã được đăng ký.";
        isValid = false;
      }
    }

    // Validate password
    if (!password) {
      passwordError.textContent = "Vui lòng nhập mật khẩu.";
      isValid = false;
    } else if (password.length < 6) {
      passwordError.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword) {
      confirmError.textContent = "Vui lòng xác nhận mật khẩu.";
      isValid = false;
    } else if (password !== confirmPassword) {
      confirmError.textContent = "Mật khẩu không khớp.";
      isValid = false;
    }

    // Validate agree
    if (!agreed) {
      agreeError.textContent = "Bạn phải đồng ý với điều khoản.";
      isValid = false;
    }

    if (!isValid) return;

    // Lưu user mới
    const users = getUsers();
    const newUser = {
      fullname: fullname,
      email: email,
      password: password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);

    // Tự động đăng nhập sau khi đăng ký
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("lastEmail", email);

    // Chuyển hướng về trang chủ với thông báo
    window.location.href = "trangchu.html?register=success";
  });

  // Nếu đã đăng nhập rồi, chuyển hướng về trang chủ
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    window.location.href = "trangchu.html";
  }

  // Tự động điền email nếu có rememberMe ở login
  const lastEmail = localStorage.getItem("lastEmail");
  if (lastEmail) {
    emailInput.value = lastEmail;
  }
});
