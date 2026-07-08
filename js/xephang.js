const iconTieuChi = {
  luotXem: "👁",
  luotTheo: "❤",
  diemDanhGia: "★",
};

const SO_MUC_HIEN = 10;
let tieuChiHienTai = "luotXem";
let danhSachMoRong = false;

function layGiaTriSo(truyen, tieuChi) {
  const giaTri = truyen[tieuChi];

  if (typeof giaTri === "number") {
    return giaTri;
  }

  return parseInt(giaTri.replace(/,/g, "")) || 0;
}

function xepHangTruyen(tieuChi) {
  const ds = [...danhSachTruyen];

  ds.sort((a, b) => layGiaTriSo(b, tieuChi) - layGiaTriSo(a, tieuChi));

  return ds;
}

function dinhDangChiSo(truyen, tieuChi) {
  return `${iconTieuChi[tieuChi]} ${truyen[tieuChi]}`;
}
function ganSuKienTab() {
  const cacNut = document.querySelectorAll(".xh-tab-nut");

  cacNut.forEach((nut) => {
    nut.addEventListener("click", function () {
      cacNut.forEach((n) => n.classList.remove("active"));
      this.classList.add("active");
      tieuChiHienTai = this.dataset.key;
      danhSachMoRong = false;
      renderTrangXepHang();
    });
  });
}
function renderTop3(dsXepHang) {
  const el = document.getElementById("xhTop3");
  const top3 = dsXepHang.slice(0, 3);

  el.innerHTML = top3
    .map(
      (truyen, chiSo) => `
    <a class="xh-top3-the hang-${chiSo + 1}" href="trangchitiet.html?id=${truyen.id}">
      <div class="xh-hang-so">${chiSo + 1}</div>
      <img src="${truyen.anhBia}" alt="${truyen.ten}">
      <div class="xh-top3-info">
        <div class="xh-top3-ten">${truyen.ten}</div>
        <div class="xh-top3-chiso">${dinhDangChiSo(truyen, tieuChiHienTai)}</div>
      </div>
    </a>
  `,
    )
    .join("");
}

function renderDanhSach(dsXepHang) {
  const el = document.getElementById("xhDanhSach");
  const conLai = dsXepHang.slice(3);
  const dsHienThi = danhSachMoRong ? conLai : conLai.slice(0, SO_MUC_HIEN);
  const dsHtml = dsHienThi
    .map(
      (truyen, chiSo) => `
    <a class="xh-hang-muc" href="trangchitiet.html?id=${truyen.id}">
      <div class="xh-hang-so-nho">${chiSo + 4}</div>
      <img src="${truyen.anhBia}" alt="${truyen.ten}">
      <div class="xh-hang-muc-info">
        <div class="xh-hang-muc-ten">${truyen.ten}</div>
        <div class="xh-hang-muc-tacgia">${truyen.tacGia}</div>
      </div>
      <div class="xh-hang-muc-chiso">${dinhDangChiSo(truyen, tieuChiHienTai)}</div>
    </a>
  `,
    )
    .join("");

  const nutXemThemHtml =
    conLai.length > SO_MUC_HIEN
      ? `
    <div class="xh-xem-them">
      <button onclick="toggleDanhSachXepHang()">
        ${danhSachMoRong ? "▲ Thu gọn" : "▼ Xem thêm"}
      </button>
    </div>
  `
      : "";

  el.innerHTML = dsHtml + nutXemThemHtml;
}

function renderTrangXepHang() {
  const dsXepHang = xepHangTruyen(tieuChiHienTai);
  renderTop3(dsXepHang);
  renderDanhSach(dsXepHang);
}

function toggleDanhSachXepHang() {
  danhSachMoRong = !danhSachMoRong;
  const dsXepHang = xepHangTruyen(tieuChiHienTai);
  renderDanhSach(dsXepHang);
}

function ganNutQuayLai() {
  const nutQuayLai = document.getElementById("quaylai");
  if (!nutQuayLai) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      nutQuayLai.style.display = "block";
    } else {
      nutQuayLai.style.display = "none";
    }
  });

  nutQuayLai.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function ganMenuToggle() {
  const btnToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  if (!btnToggle || !menu) return;

  btnToggle.addEventListener("click", function () {
    menu.classList.toggle("menu-open");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  ganSuKienTab();
  renderTrangXepHang();
  ganNutQuayLai();
  ganMenuToggle();
});
