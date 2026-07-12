document.addEventListener("DOMContentLoaded", function () {
  // Lấy tham số thể loại từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const theloai = urlParams.get("theloai");

  const khung = document.getElementById("khungTruyenTheoLoai");
  const title = document.getElementById("theloai-title");
  const emptyMsg = document.getElementById("empty-message");

  // Kiểm tra nếu không có tham số theloai -> hiển thị tất cả
  let danhSachHienThi = [];
  let tieuDe = "📚 Tất Cả Thể Loại";

  if (theloai) {
    // Lọc truyện theo thể loại (không phân biệt hoa thường)
    danhSachHienThi = danhSachTruyen.filter((truyen) =>
      truyen.theLoai.some((tl) => tl.toLowerCase() === theloai.toLowerCase()),
    );
    tieuDe = `📚 Thể loại: ${theloai}`;
  } else {
    danhSachHienThi = danhSachTruyen;
  }

  title.textContent = tieuDe;

  // Nếu không có truyện, hiển thị thông báo
  if (danhSachHienThi.length === 0) {
    khung.innerHTML = "";
    emptyMsg.style.display = "block";
    return;
  } else {
    emptyMsg.style.display = "none";
  }

  // Render danh sách truyện (giống giao diện index)
  khung.innerHTML = danhSachHienThi
    .map(
      (truyen) => `
    <div class="khungtruyenrieng">
      <a href="trangchitiet.html?id=${truyen.id}">
        <img src="${truyen.anhBia}" alt="${truyen.ten}" />
        <h3>${truyen.ten}</h3>
      </a>
      <span>${truyen.theLoai.join(" - ")}</span>
    </div>
  `,
    )
    .join("");
});

//Tìm Kiếm Truyện
function hienThiTruyen(idKhung, danhSach) {
  const khung = document.getElementById(idKhung);
  khung.innerHTML = "";
  danhSach.forEach(function (truyen) {
    khung.innerHTML += `
      <div class="khungtruyenrieng">
        <a href="trangchitiet.html?id=${truyen.id}">
          <img src="${truyen.anhBia}" alt="${truyen.ten}">
          <h3>${truyen.ten}</h3>
        </a>
        <span>${truyen.theLoai.join(" • ")}</span>
      </div>
    `;
  });
}

function ganTimKiem() {
  const search = document.getElementById("inputsearch");
  const khungKetQua = document.getElementById("khungKetQua");
  const ketquatimkiem = document.getElementById("ketquatimkiem");
  const theloai = document.getElementById("theloai-page");
  search.addEventListener("input", function () {
    const tuKhoa = search.value.trim().toLowerCase();
    if (tuKhoa === "") {
      ketquatimkiem.style.display = "none";
      theloai.style.display = "block";
      return;
    }
    ketquatimkiem.style.display = "block";
    theloai.style.display = "none";
    const ketQua = danhSachTruyen.filter(function (truyen) {
      return (
        truyen.ten.toLowerCase().includes(tuKhoa) ||
        truyen.tacGia.toLowerCase().includes(tuKhoa) ||
        truyen.theLoai.join(" ").toLowerCase().includes(tuKhoa)
      );
    });
    if (ketQua.length === 0) {
      khungKetQua.style.display = "block";
      khungKetQua.innerHTML = `
      <p style="
        color:white;
        font-size:20px;
        text-align:center;
        padding:40px;
        ">
        🔍 Không tìm thấy truyện phù hợp vui lòng nhập từ khóa khác
      </p>
    `;
      return;
    }
    hienThiTruyen("khungKetQua", ketQua);
    khungKetQua.style.display = "grid";
  });
}
//Nút Menu
function ganMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    menu.classList.toggle("active");
  });
  menu.addEventListener("click", function (e) {
    e.stopPropagation();
  });
  document.addEventListener("click", function () {
    menu.classList.remove("active");
  });
}
document.addEventListener("DOMContentLoaded", function () {
  ganTimKiem();
  ganMenu();
});
