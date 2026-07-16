function layTaiKhoanHienTai() {
  try {
    const chuoi = localStorage.getItem("currentUser");

    return chuoi ? JSON.parse(chuoi) : null;
  } catch (error) {
    return null;
  }
}

function renderDanhSachTheoDoi(tuKhoa = "") {
  const grid = document.getElementById("tdDanhSach");

  const thongBaoRong = document.getElementById("tdRong");

  const taiKhoan = layTaiKhoanHienTai();

  // Chưa đăng nhập
  if (!taiKhoan) {
    grid.replaceChildren();

    thongBaoRong.style.display = "block";
    thongBaoRong.replaceChildren();

    thongBaoRong.append("Bạn cần ");

    const link = document.createElement("a");
    link.href = "login.html";
    link.textContent = "đăng nhập";

    thongBaoRong.append(link);
    thongBaoRong.append(" để xem danh sách truyện đang theo dõi.");

    return;
  }

  // Hàm trong luutru.js
  // Tự lấy danh sách của tài khoản hiện tại
  const dsId = layDanhSachTheoDoi();

  const tuKhoaThuong = tuKhoa.trim().toLowerCase();

  const dsTruyen = danhSachTruyen.filter(function (truyen) {
    const daTheoDoi = dsId.includes(Number(truyen.id));

    const dungTuKhoa =
      tuKhoaThuong === "" ||
      truyen.ten.toLowerCase().includes(tuKhoaThuong) ||
      truyen.tacGia.toLowerCase().includes(tuKhoaThuong) ||
      truyen.theLoai.join(" ").toLowerCase().includes(tuKhoaThuong);

    return daTheoDoi && dungTuKhoa;
  });

  // Tài khoản chưa theo dõi truyện nào
  if (dsId.length === 0) {
    thongBaoRong.style.display = "block";

    thongBaoRong.textContent =
      'Bạn chưa theo dõi truyện nào. Hãy vào một truyện và bấm nút "🔔 Theo Dõi" nhé!';

    grid.replaceChildren();
    return;
  }

  thongBaoRong.style.display = "none";

  // Có truyện theo dõi nhưng không khớp từ khóa
  if (dsTruyen.length === 0) {
    grid.replaceChildren();

    const p = document.createElement("p");

    p.textContent = "Không tìm thấy truyện phù hợp.";

    p.style.color = "white";
    p.style.textAlign = "center";
    p.style.gridColumn = "1 / -1";
    p.style.padding = "40px";

    grid.append(p);
    return;
  }

  grid.replaceChildren();

  dsTruyen.forEach(function (truyen) {
    const khung = document.createElement("div");
    khung.className = "khungtruyenrieng td-the";

    const nut = document.createElement("button");
    nut.type = "button";
    nut.className = "td-nut-bo";
    nut.dataset.id = truyen.id;
    nut.title = "Bỏ theo dõi";
    nut.textContent = "✕";

    const link = document.createElement("a");
    link.href = "trangchitiet.html?id=" + truyen.id;

    const img = document.createElement("img");
    img.src = truyen.anhBia;
    img.alt = truyen.ten;

    const h3 = document.createElement("h3");
    h3.textContent = truyen.ten;

    const span = document.createElement("span");
    span.textContent = truyen.theLoai.join(" - ");

    link.append(img);
    link.append(h3);

    khung.append(nut);
    khung.append(link);
    khung.append(span);

    grid.append(khung);
  });
}

function ganSuKienDanhSachTheoDoi() {
  const grid = document.getElementById("tdDanhSach");

  const inputTimKiem = document.getElementById("inputsearch");

  // Sử dụng event delegation nên không cần
  // gắn lại sự kiện sau mỗi lần render
  grid.addEventListener("click", function (event) {
    const nut = event.target.closest(".td-nut-bo");

    if (!nut) return;

    const idTruyen = Number(nut.dataset.id);

    // Hàm trong luutru.js
    toggleTheoDoiId(idTruyen);

    renderDanhSachTheoDoi(inputTimKiem.value);
  });

  inputTimKiem.addEventListener("input", function () {
    renderDanhSachTheoDoi(inputTimKiem.value);
  });
}

function ganNutQuayLai() {
  const nut = document.getElementById("quaylai");

  if (!nut) return;

  window.addEventListener("scroll", function () {
    nut.style.display = window.scrollY > 300 ? "block" : "none";
  });

  nut.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
  renderDanhSachTheoDoi();
  ganSuKienDanhSachTheoDoi();
  ganNutQuayLai();
  ganMenu();
});
