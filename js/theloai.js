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
  // Nếu không có truyện
  if (danhSachHienThi.length === 0) {
    khung.replaceChildren();
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  khung.replaceChildren();

  danhSachHienThi.forEach(function (truyen) {
    const div = document.createElement("div");
    div.className = "khungtruyenrieng";

    const a = document.createElement("a");
    a.href = "trangchitiet.html?id=" + truyen.id;

    const img = document.createElement("img");
    img.src = truyen.anhBia;
    img.alt = truyen.ten;

    const h3 = document.createElement("h3");
    h3.textContent = truyen.ten;

    const span = document.createElement("span");
    span.textContent = truyen.theLoai.join(" - ");

    a.appendChild(img);
    a.appendChild(h3);

    div.appendChild(a);
    div.appendChild(span);

    khung.appendChild(div);
  });
  ganTimKiem();
  ganMenu();
  ganNutQuayLai();
});
function hienThiTruyen(idKhung, danhSach) {
  const khung = document.getElementById(idKhung);

  khung.replaceChildren();

  danhSach.forEach(function (truyen) {
    const div = document.createElement("div");
    div.className = "khungtruyenrieng";

    const a = document.createElement("a");
    a.href = "trangchitiet.html?id=" + truyen.id;

    const img = document.createElement("img");
    img.src = truyen.anhBia;
    img.alt = truyen.ten;

    const h3 = document.createElement("h3");
    h3.textContent = truyen.ten;

    const span = document.createElement("span");
    span.textContent = truyen.theLoai.join(" • ");

    a.appendChild(img);
    a.appendChild(h3);

    div.appendChild(a);
    div.appendChild(span);

    khung.appendChild(div);
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
      khungKetQua.replaceChildren();
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
      khungKetQua.replaceChildren();

      const p = document.createElement("p");

      p.textContent =
        "🔍 Không tìm thấy truyện phù hợp vui lòng nhập từ khóa khác";

      p.style.color = "white";
      p.style.fontSize = "20px";
      p.style.textAlign = "center";
      p.style.padding = "40px";

      khungKetQua.appendChild(p);
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

  if (!menuToggle || !menu) return;

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
