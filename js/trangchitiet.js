/*HÀM TỰ TÁCH THAM SỐ TỪ URL*/
function layThamSoURL(tenThamSo) {
  const chuoi = window.location.search.substring(1);
  if (!chuoi) return null;
  const danhSach = chuoi.split("&");
  for (let i = 0; i < danhSach.length; i++) {
    const cap = danhSach[i].split("=");
    if (decodeURIComponent(cap[0]) === tenThamSo) {
      return cap[1] ? decodeURIComponent(cap[1]) : "";
    }
  }
  return null;
}

//Các biến nhớ trạng thái của trang
let dangTheoDoi = false;
let synopsisMoRong = false;
let thuTuChapter = "desc";
let chapterMoRong = false;
let saoDangChon = 0;

const idTruyen = parseInt(layThamSoURL("id")) || 1;
const truyen = layTruyenTheoId(idTruyen);

if (!truyen) {
  document.body.innerHTML =
    "<h1 style='color:white;text-align:center;margin-top:100px'>Không tìm thấy truyện</h1>";
  throw new Error("Không tìm thấy truyện");
}
function layTaiKhoanHienTai() {
  const chuoi = localStorage.getItem("currentUser");
  return chuoi ? JSON.parse(chuoi) : null;
}
function layClassTinhTrang(tinhTrang) {
  if (tinhTrang === "Đang Ra") return "dang-ra";
  if (tinhTrang === "Hoàn Thành") return "hoan-thanh";
  return "sap-ra-mat";
}
//HERO: ảnh, tên truyện,nút đọc,...
function renderHero() {
  const coChapter = truyen.danhSachChapter.length > 0;
  let soChapterMoiNhat = null;
  if (coChapter) {
    soChapterMoiNhat = Math.max(...truyen.danhSachChapter.map((ch) => ch.so));
  }

  document.getElementById("anhBia").src = truyen.anhBia;
  document.getElementById("anhBia").alt = truyen.ten;
  document.getElementById("tenTruyen").textContent = truyen.ten;
  document.getElementById("tenKhac").innerHTML = truyen.tenKhac.join("<br>");
  document.getElementById("soSao").textContent = "★".repeat(
    Math.round(truyen.diemDanhGia),
  );
  document.getElementById("diemDanhGia").textContent = truyen.diemDanhGia;
  document.getElementById("tacGia").textContent = truyen.tacGia;

  const tinhTrang = document.getElementById("tinhTrang");
  tinhTrang.textContent = truyen.tinhTrang;
  tinhTrang.classList.add(layClassTinhTrang(truyen.tinhTrang));

  document.getElementById("theLoai").innerHTML = truyen.theLoai
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");
  document.getElementById("luotXem").textContent = `👁 ${truyen.luotXem}`;
  document.getElementById("luotTheo").textContent = `❤ ${truyen.luotTheo}`;
  document.getElementById("synopsisText").innerHTML = truyen.moTa;

  const btnDocDau = document.getElementById("btnDocDau");
  const btnDocMoi = document.getElementById("btnDocMoi");
  if (coChapter) {
    btnDocDau.href = `/doctruyen.html?id=${truyen.id}&chapter=${Math.min(...truyen.danhSachChapter.map((ch) => ch.so))}`;
    btnDocMoi.href = `/doctruyen.html?id=${truyen.id}&chapter=${Math.max(...truyen.danhSachChapter.map((ch) => ch.so))}`;
  } else {
    btnDocDau.removeAttribute("href");
    btnDocDau.textContent = "⏳ Sắp ra mắt";
    btnDocMoi.style.display = "none";
  }

  hienNutDocTiep(coChapter);
  document
    .getElementById("btnSynopsis")
    .addEventListener("click", toggleSynopsis);

  ganNutTheoDoi();
}
//HÀM RIÊNG CHO NÚT ĐỌC TIẾP
function hienNutDocTiep(coChapter) {
  const btnDocTiep = document.getElementById("btnDocTiep");
  if (!coChapter) {
    btnDocTiep.style.display = "none";
    return;
  }

  const chapterDaDoc = layChapterDangDocDo(truyen.id);
  const chapterVanConTonTai =
    chapterDaDoc && truyen.danhSachChapter.some((c) => c.so === chapterDaDoc);

  if (chapterVanConTonTai) {
    btnDocTiep.href = `/doctruyen.html?id=${truyen.id}&chapter=${chapterDaDoc}`;
    btnDocTiep.textContent = `▶ Đọc Tiếp - Chapter ${chapterDaDoc}`;
    btnDocTiep.style.display = "block";
  } else {
    btnDocTiep.style.display = "none";
  }
}
//DS CHAPTER
function renderChapter() {
  const tongChapter = document.getElementById("tongChapter");
  const chapterDanhSach = document.getElementById("chapterDanhSach");
  const chapterXemThem = document.getElementById("chapterXemThem");
  const thongBao = document.getElementById("chapterThongBao");
  if (truyen.danhSachChapter.length === 0) {
    tongChapter.textContent = "(0)";
    chapterDanhSach.innerHTML = "";
    chapterXemThem.innerHTML = "";
    thongBao.style.display = "block";
    return;
  }

  thongBao.style.display = "none";
  tongChapter.textContent = `(${truyen.danhSachChapter.length})`;
  let ds = [...truyen.danhSachChapter];
  ds.sort((a, b) => {
    if (thuTuChapter === "desc") {
      return b.so - a.so;
    }
    return a.so - b.so;
  });
  const dsHienThi = chapterMoRong ? ds : ds.slice(0, 10);
  chapterDanhSach.innerHTML = dsHienThi
    .map(
      (chapter) => `
      <a class="chapter-item"
        href="doctruyen.html?id=${truyen.id}&chapter=${chapter.so}">
        <div class="chapter-so">
          Chapter ${chapter.so}
          ${chapter.isMoi ? `<span class="chapter-moi-badge">MỚI</span>` : ""}
        </div>
        <div class="chapter-ngay">${chapter.ngay}</div>
      </a>
    `,
    )
    .join("");

  if (ds.length > 10) {
    chapterXemThem.innerHTML = `
      <button onclick="toggleChapter()">
        ${chapterMoRong ? "▲ Thu gọn" : "▼ Xem thêm"}
      </button>
    `;
  } else {
    chapterXemThem.innerHTML = "";
  }
}

function doiThuTu(loai) {
  thuTuChapter = loai;
  document
    .getElementById("btnMoiNhat")
    .classList.toggle("active", loai === "desc");
  document
    .getElementById("btnCuNhat")
    .classList.toggle("active", loai === "asc");
  renderChapter();
}

function ganNutSapXep() {
  document
    .getElementById("btnMoiNhat")
    .addEventListener("click", () => doiThuTu("desc"));
  document
    .getElementById("btnCuNhat")
    .addEventListener("click", () => doiThuTu("asc"));
  document.getElementById("btnMoiNhat").classList.add("active");
}

function toggleChapter() {
  chapterMoRong = !chapterMoRong;
  renderChapter();
}
//TRUYỆN LIÊN QUAN
function renderLienQuan() {
  const ds = layTruyenLienQuan(truyen.id, 4);
  const grid = document.getElementById("lienQuanGrid");

  grid.innerHTML = ds
    .map(
      (t) => `
      <a class="lien-quan-card" href="trangchitiet.html?id=${t.id}">
        <img src="${t.anhBia}" alt="${t.ten}">
        <div class="lien-quan-info">
          <div class="lien-quan-ten">${t.ten}</div>
          <div class="lien-quan-tacgia">${t.tacGia}</div>
        </div>
      </a>
    `,
    )
    .join("");
}
//BÌNH LUẬN
let dsBinhLuan = [];

function renderBinhLuan() {
  dsBinhLuan = layBinhLuanTruyen(truyen.id, truyen.binhLuan);
  document.getElementById("soBinhLuan").textContent = `(${dsBinhLuan.length})`;
  const danhSach = document.getElementById("danhSachBinhLuan");
  danhSach.innerHTML = dsBinhLuan
    .map(
      (bl) => `
      <div class="binh-luan-item">
        <div class="bl-avatar">${bl.kyTuDau}</div>
        <div class="bl-noidung">
          <div class="bl-meta">
            <strong>${bl.ten}</strong>
            ${bl.sao ? `<span class="bl-stars">${"★".repeat(bl.sao)}</span>` : ""}
            <span class="bl-time">${bl.thoiGian}</span>
            ${
              bl.chapterSo
                ? `<span class="bl-chapter-tag">📍 Chapter ${bl.chapterSo}</span>`
                : ""
            }
          </div>
          <p>${bl.noiDung}</p>
        </div>
      </div>
    `,
    )
    .join("");
}

function apDungTrangThaiDangNhap() {
  const taiKhoan = layTaiKhoanHienTai();

  const thongBaoChuaDangNhap = document.getElementById("blThongBaoDangNhap");
  const form = document.getElementById("blForm");

  if (taiKhoan) {
    thongBaoChuaDangNhap.style.display = "none";
    form.style.display = "flex";
    document.getElementById("blDangBinhLuanVoi").textContent =
      `Đang bình luận với tư cách: ${taiKhoan.fullname}`;
  } else {
    thongBaoChuaDangNhap.style.display = "block";
    form.style.display = "none";

    const linkDangNhap = document.getElementById("blLinkDangNhap");
    const urlHienTai = encodeURIComponent(window.location.href);
    linkDangNhap.href = `/login.html?quaylai=${urlHienTai}`;
  }
}

function chonSao(soSao) {
  saoDangChon = soSao;
  const allStars = document.querySelectorAll("#starPickWrap .star-pick");
  allStars.forEach((star) => {
    const giaTri = parseInt(star.dataset.star);
    star.classList.toggle("active", giaTri <= soSao);
  });
}

function ganChonSao() {
  const allStars = document.querySelectorAll("#starPickWrap .star-pick");
  allStars.forEach((star) => {
    star.addEventListener("click", () => {
      chonSao(parseInt(star.dataset.star));
    });
  });
}

function guiBinhLuan() {
  const taiKhoan = layTaiKhoanHienTai();
  if (!taiKhoan) {
    alert("Bạn cần đăng nhập để bình luận!");
    return;
  }

  const inputNoiDung = document.getElementById("blNoiDung");
  const noiDung = inputNoiDung.value.trim();

  if (!noiDung) {
    alert("Vui lòng nhập nội dung bình luận!");
    return;
  }

  dsBinhLuan = themBinhLuan(truyen.id, {
    ten: taiKhoan.fullname,
    kyTuDau: taiKhoan.fullname.charAt(0).toUpperCase(),
    sao: saoDangChon || 5,
    thoiGian: "Vừa xong",
    noiDung: noiDung,
    chapterSo: null,
  });

  saoDangChon = 0;
  inputNoiDung.value = "";

  renderBinhLuan();
}

function toggleSynopsis() {
  synopsisMoRong = !synopsisMoRong;

  const text = document.getElementById("synopsisText");
  const btn = document.getElementById("btnSynopsis");
  text.classList.toggle("synopsis-hidden");
  btn.textContent = synopsisMoRong ? "▲ Thu gọn" : "▼ Xem thêm";
}
function toggleTheoDoi() {
  // toggleTheoDoiId() trong luutru.js
  dangTheoDoi = toggleTheoDoiId(truyen.id);
  const btn = document.getElementById("btnTheodoi");
  btn.textContent = dangTheoDoi ? "✅ Đang Theo Dõi" : "🔔 Theo Dõi";
  btn.classList.toggle("dang-theo-doi", dangTheoDoi);
}

function ganNutTheoDoi() {
  const btn = document.getElementById("btnTheodoi");
  if (!btn) return;

  // Đọc trạng thái đã lưu
  dangTheoDoi = kiemTraDaTheoDoi(truyen.id);
  btn.textContent = dangTheoDoi ? "✅ Đang Theo Dõi" : "🔔 Theo Dõi";
  btn.classList.toggle("dang-theo-doi", dangTheoDoi);

  btn.addEventListener("click", toggleTheoDoi);
}

function phanTuDaVaoKhungNhin(el) {
  return el.getBoundingClientRect().top < window.innerHeight * 0.9;
}

function ganHieuUngScroll() {
  const cacIdCanHieuUng = ["sectionLQuan", "sectionBLuan"];

  function kiemTraVaHienThi() {
    cacIdCanHieuUng.forEach((id) => {
      const el = document.getElementById(id);
      if (el && phanTuDaVaoKhungNhin(el)) {
        el.classList.add("section-show");
        el.classList.remove("section-hidden");
      }
    });
  }
  window.addEventListener("scroll", kiemTraVaHienThi);
  kiemTraVaHienThi();
}

function ganNutQuayLai() {
  const nut = document.getElementById("quaylai");
  if (!nut) return;
  window.addEventListener("scroll", () => {
    nut.style.display = window.scrollY > 300 ? "block" : "none";
  });
  nut.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function ganMenuToggle() {
  const btn = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    menu.classList.toggle("menu-open");
  });
}

//Tìm Kiếm Truyện
function hienThiTruyen(idKhung, danhSach) {
  const khung = document.getElementById(idKhung);
  khung.innerHTML = "";
  danhSach.forEach(function (t) {
    khung.innerHTML += `
      <div class="khungtruyenrieng">
        <a href="trangchitiet.html?id=${t.id}">
          <img src="${t.anhBia}" alt="${t.ten}">
          <h3>${t.ten}</h3>
        </a>
        <span>${t.theLoai.join(" • ")}</span>
      </div>
    `;
  });
}

function ganTimKiem() {
  const search = document.getElementById("inputsearch");
  const khungKetQua = document.getElementById("khungKetQua");
  const ketquatimkiem = document.getElementById("ketquatimkiem");
  const breadcrumb = document.querySelector(".breadcrumb");
  const hero = document.querySelector(".chitiet-hero");
  const chapter = document.getElementById("chapter-section");
  const lienquan = document.getElementById("sectionLQuan");
  const binhluan = document.getElementById("sectionBLuan");
  search.addEventListener("input", function () {
    const tuKhoa = search.value.trim().toLowerCase();
    if (tuKhoa === "") {
      ketquatimkiem.style.display = "none";
      breadcrumb.style.display = "block";
      hero.style.display = "block";
      chapter.style.display = "block";
      lienquan.style.display = "block";
      binhluan.style.display = "block";
      return;
    }
    ketquatimkiem.style.display = "block";
    breadcrumb.style.display = "none";
    hero.style.display = "none";
    chapter.style.display = "none";
    lienquan.style.display = "none";
    binhluan.style.display = "none";
    const ketQua = danhSachTruyen.filter(function (t) {
      return (
        t.ten.toLowerCase().includes(tuKhoa) ||
        t.tacGia.toLowerCase().includes(tuKhoa) ||
        t.theLoai.join(" ").toLowerCase().includes(tuKhoa)
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

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("breadcrumb-ten").textContent = truyen.ten;
  document.title = truyen.ten + " - Comic Web";

  renderHero();
  renderChapter();
  renderLienQuan();
  renderBinhLuan();
  apDungTrangThaiDangNhap();
  ganNutSapXep();
  ganChonSao();
  document
    .getElementById("btnGuiBinhLuan")
    .addEventListener("click", guiBinhLuan);
  ganHieuUngScroll();
  ganNutQuayLai();
  ganMenuToggle();
  ganTimKiem();
});
