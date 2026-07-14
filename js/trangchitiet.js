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

// Xóa hết phần tử con của 1 khung bằng removeChild, thay cho innerHTML = ""
function xoaHetCon(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
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
  const h1 = document.createElement("h1");
  h1.style.color = "white";
  h1.style.textAlign = "center";
  h1.style.marginTop = "100px";
  h1.textContent = "Không tìm thấy truyện";
  xoaHetCon(document.body);
  document.body.appendChild(h1);
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

//HERO: ảnh, tên truyện, nút đọc,...
function renderHero() {
  const coChapter = truyen.danhSachChapter.length > 0;

  document.getElementById("anhBia").src = truyen.anhBia;
  document.getElementById("anhBia").alt = truyen.ten;
  document.getElementById("tenTruyen").textContent = truyen.ten;

  const tenKhacEl = document.getElementById("tenKhac");
  xoaHetCon(tenKhacEl);
  truyen.tenKhac.forEach((ten, idx) => {
    tenKhacEl.appendChild(document.createTextNode(ten));
    if (idx < truyen.tenKhac.length - 1) {
      tenKhacEl.appendChild(document.createElement("br"));
    }
  });

  document.getElementById("soSao").textContent = "★".repeat(
    Math.round(truyen.diemDanhGia),
  );
  document.getElementById("diemDanhGia").textContent = truyen.diemDanhGia;
  document.getElementById("tacGia").textContent = truyen.tacGia;

  const tinhTrang = document.getElementById("tinhTrang");
  tinhTrang.textContent = truyen.tinhTrang;
  tinhTrang.classList.add(layClassTinhTrang(truyen.tinhTrang));

  const theLoaiEl = document.getElementById("theLoai");
  xoaHetCon(theLoaiEl);
  truyen.theLoai.forEach((t) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = t;
    theLoaiEl.appendChild(span);
  });

  document.getElementById("luotXem").textContent = `👁 ${truyen.luotXem}`;
  document.getElementById("luotTheo").textContent = `❤ ${truyen.luotTheo}`;
  document.getElementById("synopsisText").textContent = truyen.moTa;

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

  xoaHetCon(chapterDanhSach);
  xoaHetCon(chapterXemThem);

  if (truyen.danhSachChapter.length === 0) {
    tongChapter.textContent = "(0)";
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

  dsHienThi.forEach((chapter) => {
    const a = document.createElement("a");
    a.className = "chapter-item";
    a.href = `/doctruyen.html?id=${truyen.id}&chapter=${chapter.so}`;

    const divSo = document.createElement("div");
    divSo.className = "chapter-so";
    divSo.appendChild(document.createTextNode(`Chapter ${chapter.so} `));

    if (chapter.isMoi) {
      const badge = document.createElement("span");
      badge.className = "chapter-moi-badge";
      badge.textContent = "MỚI";
      divSo.appendChild(badge);
    }

    const divNgay = document.createElement("div");
    divNgay.className = "chapter-ngay";
    divNgay.textContent = chapter.ngay;

    a.appendChild(divSo);
    a.appendChild(divNgay);
    chapterDanhSach.appendChild(a);
  });

  if (ds.length > 10) {
    const btn = document.createElement("button");
    btn.textContent = chapterMoRong ? "▲ Thu gọn" : "▼ Xem thêm";
    btn.addEventListener("click", toggleChapter);
    chapterXemThem.appendChild(btn);
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
  xoaHetCon(grid);

  ds.forEach((t) => {
    const a = document.createElement("a");
    a.className = "lien-quan-card";
    a.href = `/trangchitiet.html?id=${t.id}`;

    const img = document.createElement("img");
    img.src = t.anhBia;
    img.alt = t.ten;

    const info = document.createElement("div");
    info.className = "lien-quan-info";

    const ten = document.createElement("div");
    ten.className = "lien-quan-ten";
    ten.textContent = t.ten;

    const tacgia = document.createElement("div");
    tacgia.className = "lien-quan-tacgia";
    tacgia.textContent = t.tacGia;

    info.appendChild(ten);
    info.appendChild(tacgia);
    a.appendChild(img);
    a.appendChild(info);
    grid.appendChild(a);
  });
}

//BÌNH LUẬN
let dsBinhLuan = [];

function renderBinhLuan() {
  dsBinhLuan = layBinhLuanTruyen(truyen.id, truyen.binhLuan);
  document.getElementById("soBinhLuan").textContent = `(${dsBinhLuan.length})`;

  const danhSach = document.getElementById("danhSachBinhLuan");
  xoaHetCon(danhSach);

  dsBinhLuan.forEach((bl) => {
    const item = document.createElement("div");
    item.className = "binh-luan-item";

    const avatar = document.createElement("div");
    avatar.className = "bl-avatar";
    avatar.textContent = bl.kyTuDau;

    const noidung = document.createElement("div");
    noidung.className = "bl-noidung";

    const meta = document.createElement("div");
    meta.className = "bl-meta";

    const tenEl = document.createElement("strong");
    tenEl.textContent = bl.ten;
    meta.appendChild(tenEl);

    if (bl.sao) {
      const stars = document.createElement("span");
      stars.className = "bl-stars";
      stars.textContent = "★".repeat(bl.sao);
      meta.appendChild(stars);
    }

    const time = document.createElement("span");
    time.className = "bl-time";
    time.textContent = bl.thoiGian;
    meta.appendChild(time);

    if (bl.chapterSo) {
      const tag = document.createElement("span");
      tag.className = "bl-chapter-tag";
      tag.textContent = `📍 Chapter ${bl.chapterSo}`;
      meta.appendChild(tag);
    }

    const p = document.createElement("p");
    p.textContent = bl.noiDung;

    noidung.appendChild(meta);
    noidung.appendChild(p);
    item.appendChild(avatar);
    item.appendChild(noidung);
    danhSach.appendChild(item);
  });
}

function apDungTrangThaiDangNhap() {
  const taiKhoan = layTaiKhoanHienTai();

  const thongBaoChuaDangNhap = document.getElementById("blThongBaoDangNhap");
  const form = document.getElementById("blForm");
  const dongTuCach = document.getElementById("blDangBinhLuanVoi");

  if (dongTuCach) {
    dongTuCach.style.display = "none";
  }

  if (taiKhoan) {
    thongBaoChuaDangNhap.style.display = "none";
    form.style.display = "flex";
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
  // Lưu theo tài khoản đang đăng nhập
  dangTheoDoi = toggleTheoDoiId(truyen.id);
  const btn = document.getElementById("btnTheodoi");

  if (!btn) return;

  btn.textContent = dangTheoDoi ? "✅ Đang Theo Dõi" : "🔔 Theo Dõi";
  btn.classList.toggle("dang-theo-doi", dangTheoDoi);
}

function ganNutTheoDoi() {
  const btn = document.getElementById("btnTheodoi");

  if (!btn) return;

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
  xoaHetCon(khung);

  danhSach.forEach((t) => {
    const div = document.createElement("div");
    div.className = "khungtruyenrieng";

    const a = document.createElement("a");
    a.href = `/trangchitiet.html?id=${t.id}`;

    const img = document.createElement("img");
    img.src = t.anhBia;
    img.alt = t.ten;

    const h3 = document.createElement("h3");
    h3.textContent = t.ten;

    a.appendChild(img);
    a.appendChild(h3);

    const span = document.createElement("span");
    span.textContent = t.theLoai.join(" • ");

    div.appendChild(a);
    div.appendChild(span);
    khung.appendChild(div);
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
  ganMenu();
});
