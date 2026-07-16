const iconTieuChi = {
  luotXem: "👁",
  luotTheo: "❤",
  diemDanhGia: "★",
};

const SO_MUC_HIEN = 7;
let tieuChiHienTai = "luotXem";
let danhSachMoRong = false;

function xoaHetCon(el) {
  if (!el) return;
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function layGiaTriSo(truyen, tieuChi) {
  const giaTri = truyen[tieuChi];
  if (typeof giaTri === "number") return giaTri;
  return parseInt(String(giaTri || "0").replace(/,/g, ""), 10) || 0;
}

function xepHangTruyen(tieuChi) {
  const ds = [...danhSachTruyen];
  ds.sort((a, b) => layGiaTriSo(b, tieuChi) - layGiaTriSo(a, tieuChi));
  return ds;
}

// Hàm định dạng tạo các node phần tử (Không dùng innerHTML, an toàn DOM)
function dinhDangChiSo(truyen, tieuChi) {
  const giaTri = truyen[tieuChi];
  let chuoiSo = giaTri;

  if (tieuChi === "diemDanhGia") {
    chuoiSo = Number(giaTri).toFixed(1);
  }

  const spanIcon = document.createElement("span");
  spanIcon.className = "xh-chiso-icon";
  spanIcon.textContent = iconTieuChi[tieuChi];

  const spanText = document.createElement("span");
  spanText.className = "xh-chiso-so";
  spanText.textContent = chuoiSo;

  const fragment = document.createDocumentFragment();
  fragment.append(spanIcon, spanText);
  return fragment;
}

function renderTrangXepHang() {
  const el = document.getElementById("xhDanhSach");
  if (!el) return;

  xoaHetCon(el);

  const dsXepHang = xepHangTruyen(tieuChiHienTai);

  const gioiHan = danhSachMoRong ? dsXepHang.length : 3 + SO_MUC_HIEN;
  const dsHienThi = dsXepHang.slice(0, gioiHan);

  dsHienThi.forEach((truyen, chiSo) => {
    const a = document.createElement("a");
    a.className = "xh-hang-muc";
    a.href = `trangchitiet.html?id=${truyen.id}`;

    const hangSoNho = document.createElement("div");
    hangSoNho.className = "xh-hang-so-nho";
    hangSoNho.textContent = chiSo + 1;

    const img = document.createElement("img");
    img.src = truyen.anhBia;
    img.alt = truyen.ten;
    img.loading = "lazy";

    const info = document.createElement("div");
    info.className = "xh-hang-muc-info";

    const ten = document.createElement("div");
    ten.className = "xh-hang-muc-ten";
    ten.textContent = truyen.ten;

    const tacgia = document.createElement("div");
    tacgia.className = "xh-hang-muc-tacgia";
    tacgia.textContent = truyen.tacGia || "Đang cập nhật";

    info.appendChild(ten);
    info.appendChild(tacgia);

    const chiso = document.createElement("div");
    chiso.className = "xh-hang-muc-chiso";
    // Thêm các element span con vào div chỉ số
    chiso.appendChild(dinhDangChiSo(truyen, tieuChiHienTai));

    a.append(hangSoNho, img, info, chiso);
    el.appendChild(a);
  });

  if (dsXepHang.length > 3 + SO_MUC_HIEN) {
    const wrap = document.createElement("div");
    wrap.className = "xh-xem-them";

    const btn = document.createElement("button");
    btn.textContent = danhSachMoRong ? "▲ Thu gọn" : "▼ Xem thêm";
    btn.addEventListener("click", toggleDanhSachXepHang);

    wrap.appendChild(btn);
    el.appendChild(wrap);
  }
}

function toggleDanhSachXepHang() {
  danhSachMoRong = !danhSachMoRong;
  renderTrangXepHang();
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

function hienThiTruyen(idKhung, danhSach) {
  const khung = document.getElementById(idKhung);
  xoaHetCon(khung);

  danhSach.forEach((truyen) => {
    const div = document.createElement("div");
    div.className = "khungtruyenrieng";

    const a = document.createElement("a");
    a.href = `/trangchitiet.html?id=${truyen.id}`;

    const img = document.createElement("img");
    img.src = truyen.anhBia;
    img.alt = truyen.ten;

    const h3 = document.createElement("h3");
    h3.textContent = truyen.ten;

    a.append(img, h3);

    const span = document.createElement("span");
    span.textContent = truyen.theLoai ? truyen.theLoai.join(" • ") : "";

    div.append(a, span);
    khung.appendChild(div);
  });
}

function ganTimKiem() {
  const search = document.getElementById("inputsearch");
  const khungKetQua = document.getElementById("khungKetQua");
  const ketquatimkiem = document.getElementById("ketquatimkiem");
  const breadcrumb = document.querySelector(".breadcrumb");
  const xephang = document.getElementById("sectionXepHang");

  if (!search || !khungKetQua || !ketquatimkiem || !xephang) return;

  search.addEventListener("input", function () {
    const tuKhoa = search.value.trim().toLowerCase();

    if (tuKhoa === "") {
      ketquatimkiem.style.display = "none";
      if (breadcrumb) breadcrumb.style.display = "block";
      xephang.style.display = "block";
      return;
    }

    ketquatimkiem.style.display = "block";
    if (breadcrumb) breadcrumb.style.display = "none";
    xephang.style.display = "none";

    const ketQua = danhSachTruyen.filter(function (truyen) {
      const ten = (truyen.ten || "").toLowerCase();
      const tacGia = (truyen.tacGia || "").toLowerCase();
      const theLoai = (truyen.theLoai || []).join(" ").toLowerCase();
      return (
        ten.includes(tuKhoa) ||
        tacGia.includes(tuKhoa) ||
        theLoai.includes(tuKhoa)
      );
    });

    if (ketQua.length === 0) {
      xoaHetCon(khungKetQua);
      const p = document.createElement("p");
      p.textContent =
        "🔍 Không tìm thấy truyện phù hợp vui lòng nhập từ khóa khác";
      p.style.color = "white";
      p.style.fontSize = "20px";
      p.style.textAlign = "center";
      p.style.padding = "40px";
      khungKetQua.style.display = "block";
      khungKetQua.appendChild(p);
      return;
    }

    hienThiTruyen("khungKetQua", ketQua);
    khungKetQua.style.display = "grid";
  });
}

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

document.addEventListener("DOMContentLoaded", () => {
  ganSuKienTab();
  renderTrangXepHang();
  ganNutQuayLai();
  ganTimKiem();
  ganMenu();
});
