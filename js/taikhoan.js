document.addEventListener("DOMContentLoaded", function () {
    const khuChuaDangNhap = document.getElementById("khuChuaDangNhap");
    const khuDaDangNhap = document.getElementById("khuDaDangNhap");
    const nutTaiKhoan = document.getElementById("nutTaiKhoan");
    const bangTaiKhoan = document.getElementById("bangTaiKhoan");
    const nutDangXuat = document.getElementById("nutDangXuat");

    // Trang không có phần tài khoản thì dừng
    if (
        !khuChuaDangNhap ||
        !khuDaDangNhap ||
        !nutTaiKhoan ||
        !bangTaiKhoan ||
        !nutDangXuat
    ) {
        return;
    }

    let currentUser = null;

    try {
        currentUser = JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
        localStorage.removeItem("currentUser");
    }

    // Chưa đăng nhập
    if (!currentUser) {
        khuChuaDangNhap.classList.remove("tai-khoan-an");
        khuDaDangNhap.classList.add("tai-khoan-an");
        return;
    }

    // Đã đăng nhập
    khuChuaDangNhap.classList.add("tai-khoan-an");
    khuDaDangNhap.classList.remove("tai-khoan-an");

    document.getElementById("tenTaiKhoan").textContent =
        currentUser.fullname || currentUser.email;

    document.getElementById("hoTenTaiKhoan").textContent =
        currentUser.fullname || "Chưa cập nhật";

    document.getElementById("emailTaiKhoan").textContent =
        currentUser.email || "Chưa cập nhật";

    const ngayTao = currentUser.createdAt
        ? new Date(currentUser.createdAt).toLocaleDateString("vi-VN")
        : "Chưa có thông tin";

    document.getElementById("ngayTaoTaiKhoan").textContent = ngayTao;

    // Mở hoặc đóng bảng tài khoản
    nutTaiKhoan.addEventListener("click", function (event) {
        event.stopPropagation();
        bangTaiKhoan.classList.toggle("tai-khoan-an");
    });

    bangTaiKhoan.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // Bấm bên ngoài để đóng
    document.addEventListener("click", function () {
        bangTaiKhoan.classList.add("tai-khoan-an");
    });

    // Đăng xuất
    nutDangXuat.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("rememberMe");
        window.location.href = "trangchu.html";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    ganTaiKhoan();
});