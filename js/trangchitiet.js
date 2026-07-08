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

function layClassTinhTrang(tinhTrang) {
  if (tinhTrang === "Đang Ra") return "dang-ra";
  if (tinhTrang === "Hoàn Thành") return "hoan-thanh";
  return "sap-ra-mat";
}

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
    btnDocDau.href =
      `./Trang_doc_truyen/doctruyen.html?id=${truyen.id}&chapter=${Math.min(...truyen.danhSachChapter.map(ch => ch.so))}`;

    btnDocMoi.href =
      `./Trang_doc_truyen/doctruyen.html?id=${truyen.id}&chapter=${Math.max(...truyen.danhSachChapter.map(ch => ch.so))}`;
  } else {
    btnDocDau.removeAttribute("href");
    btnDocDau.textContent = "⏳ Sắp ra mắt";
    btnDocMoi.style.display = "none";
  }
  document
    .getElementById("btnSynopsis")
    .addEventListener("click", toggleSynopsis);

  ganNutTheoDoi();
}

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
      <a class="chapter-item" href="./trangdoc.html?id=${truyen.id}&chapter=${chapter.so}">
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

function renderLienQuan() {
  const ds = layTruyenLienQuan(truyen.id, 4);
  const grid = document.getElementById("lienQuanGrid");

  grid.innerHTML = ds
    .map(
      (t) => `
      <a class="lien-quan-card" href="./trangchitiet.html?id=${t.id}">
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

function renderBinhLuan() {
  document.getElementById("soBinhLuan").textContent =
    `(${truyen.binhLuan.length})`;
  const danhSach = document.getElementById("danhSachBinhLuan");
  danhSach.innerHTML = truyen.binhLuan
    .map(
      (bl) => `
      <div class="binh-luan-item">
        <div class="bl-avatar">${bl.kyTuDau}</div>
        <div class="bl-noidung">
          <div class="bl-meta">
            <strong>${bl.ten}</strong>
            <span class="bl-stars">${"★".repeat(bl.sao)}</span>
            <span class="bl-time">${bl.thoiGian}</span>
          </div>
          <p>${bl.noiDung}</p>
        </div>
      </div>
    `,
    )
    .join("");
}

function chonSao(soSao) {
  saoDangChon = soSao;
  const allStars = document.querySelectorAll("#starPickWrap .star-pick");
  allStars.forEach((star) => {
    const giaTri = parseInt(star.dataset.star);
    if (giaTri <= soSao) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
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
  const inputTen = document.getElementById("blTen");
  const inputNoiDung = document.getElementById("blNoiDung");

  const ten = inputTen.value.trim();
  const noiDung = inputNoiDung.value.trim();

  if (!ten || !noiDung) {
    alert("Vui lòng nhập tên và nội dung bình luận!");
    return;
  }

  truyen.binhLuan.unshift({
    ten: ten,
    kyTuDau: ten.charAt(0).toUpperCase(),
    sao: saoDangChon || 5,
    thoiGian: "Vừa xong",
    noiDung: noiDung,
  });

  saoDangChon = 0;
  inputTen.value = "";
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
  dangTheoDoi = !dangTheoDoi;

  const btn = document.getElementById("btnTheodoi");
  btn.textContent = dangTheoDoi ? "✅ Đang Theo Dõi" : "🔔 Theo Dõi";
  btn.classList.toggle("dang-theo-doi");
}

function ganNutTheoDoi() {
  const btn = document.getElementById("btnTheodoi");
  if (btn) {
    btn.addEventListener("click", toggleTheoDoi);
  }
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

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("breadcrumb-ten").textContent = truyen.ten;
  document.title = truyen.ten + " - Comic Web";

  renderHero();
  renderChapter();
  renderLienQuan();
  renderBinhLuan();
  ganNutSapXep();
  ganChonSao();
  document
    .getElementById("btnGuiBinhLuan")
    .addEventListener("click", guiBinhLuan);
  ganHieuUngScroll();
  ganNutQuayLai();
  ganMenuToggle();
});
