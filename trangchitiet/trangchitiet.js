function layThamSoURL(tenThamSo) {
  const chuoiTruyVan = window.location.search.substring(1);
  if (!chuoiTruyVan) return null;

  const cacCapKeyValue = chuoiTruyVan.split("&");
  for (let i = 0; i < cacCapKeyValue.length; i++) {
    const cap = cacCapKeyValue[i].split("=");
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
  const hero = document.getElementById("chitiet-hero");
  const coChapter = truyen.danhSachChapter.length > 0;
  const soChapterMoiNhat = coChapter
    ? Math.max(...truyen.danhSachChapter.map((c) => c.so))
    : null;

  hero.innerHTML = `
    <div class="chitiet-container">

      <div class="chitiet-cover-col">
        <div class="chitiet-cover">
          <img src="${truyen.anhBia}" alt="${truyen.ten}">
        </div>
        <div class="chitiet-alias">
          <strong>Tên khác:</strong><br>
          ${truyen.tenKhac.join("<br>")}
        </div>
        <div class="chitiet-btns">

          ${
            coChapter
              ? `
            <a
              class="btn-doc btn-doc-primary"
              href="./trangdoc.html?id=${truyen.id}&chapter=${truyen.danhSachChapter[0].so}">
              📖 Đọc từ đầu
            </a>

            <a
              class="btn-doc btn-doc-secondary"
              href="./trangdoc.html?id=${truyen.id}&chapter=${soChapterMoiNhat}">
              ⚡ Đọc chap mới
            </a>
          `
              : `
            <span class="btn-doc btn-doc-secondary" style="opacity:.5; cursor:not-allowed;">
              ⏳ Sắp ra mắt
            </span>
          `
          }

          <button id="btnTheodoi" class="btn-doc btn-doc-outline">
            🔔 Theo Dõi
          </button>
        </div>
      </div>

      <div class="chitiet-info-col">
        <h1 class="chitiet-title">${truyen.ten}</h1>
        <div class="chitiet-rating">
          <span class="chitiet-stars">
            ${"★".repeat(Math.round(truyen.diemDanhGia))}
          </span>
          <span class="chitiet-diem">${truyen.diemDanhGia}</span>
        </div>

        <div class="chitiet-meta">
          <div class="chitiet-meta-dong">
            <span class="meta-label">Tác giả</span>
            <span class="meta-value">${truyen.tacGia}</span>
          </div>

          <div class="chitiet-meta-dong">
            <span class="meta-label">Tình trạng</span>
            <span class="meta-value">
              <span class="tinh-trang-badge ${layClassTinhTrang(truyen.tinhTrang)}">
                ${truyen.tinhTrang}
              </span>
            </span>
          </div>
        </div>

        <div class="tag-list">
          ${truyen.theLoai.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>

        <div class="chitiet-stats">
          <div class="stat-item">👁 ${truyen.luotXem}</div>
          <div class="stat-item">❤ ${truyen.luotTheo}</div>
        </div>

        <div class="chitiet-mota">
          <div id="synopsisText" class="${synopsisMoRong ? "" : "synopsis-hidden"}">
            ${truyen.moTa}
          </div>
          <br>
          <button id="btnSynopsis" class="btn-doc btn-doc-outline" onclick="toggleSynopsis()">
            ${synopsisMoRong ? "▲ Thu gọn" : "▼ Xem thêm"}
          </button>
        </div>

      </div>

    </div>
  `;
  ganNutTheoDoi();
}

function renderChapter() {
  const section = document.getElementById("chapter-section");

  if (truyen.danhSachChapter.length === 0) {
    section.innerHTML = `
      <div class="chapter-header">
        <h2>Danh sách chapter <span class="chapter-dem">(0)</span></h2>
      </div>
      <p style="color:#aaa; text-align:center; padding: 20px 0;">
        Truyện chưa phát hành chapter nào. Vui lòng quay lại sau!
      </p>
    `;
    return;
  }

  let ds = [...truyen.danhSachChapter];
  ds.sort((a, b) => (thuTuChapter === "desc" ? b.so - a.so : a.so - b.so));
  const dsHienThi = chapterMoRong ? ds : ds.slice(0, 10);
  section.innerHTML = `
    <div class="chapter-header">
      <h2>
        Danh sách chapter
        <span class="chapter-dem">(${truyen.danhSachChapter.length})</span>
      </h2>

      <div class="chapter-filter">
        <button class="filter-btn ${thuTuChapter === "desc" ? "active" : ""}" onclick="doiThuTu('desc')">
          Mới nhất
        </button>
        <button class="filter-btn ${thuTuChapter === "asc" ? "active" : ""}" onclick="doiThuTu('asc')">
          Cũ nhất
        </button>
      </div>
    </div>

    <div class="chapter-grid">
      ${dsHienThi
        .map(
          (c) => `
        <div class="chapter-item" onclick="moChapter(${c.so})">
          <div>
            <div class="chapter-so">
              Chapter ${c.so}
              ${c.isMoi ? `<span class="chapter-moi-badge">MỚI</span>` : ""}
            </div>
          </div>
          <div class="chapter-ngay">${c.ngay}</div>
        </div>
      `,
        )
        .join("")}
    </div>

    ${
      ds.length > 10
        ? `
      <div class="chapter-xemthem">
        <button onclick="toggleChapter()">
          ${chapterMoRong ? "Thu gọn" : "Xem thêm"}
        </button>
      </div>
    `
        : ""
    }
  `;
}

function renderLienQuan() {
  const ds = layTruyenLienQuan(truyen.id, 4);

  const section = document.getElementById("sectionLQuan");

  section.innerHTML = `
    <h2>Truyện liên quan</h2>

    <div class="lien-quan-grid">
      ${ds
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
        .join("")}
    </div>
  `;
}

function renderBinhLuan() {
  const section = document.getElementById("sectionBLuan");

  section.innerHTML = `
    <h2>Bình luận <span class="chapter-dem">(${truyen.binhLuan.length})</span></h2>

    <!-- Form nhập bình luận mới -->
    <div class="bl-form">
      <input type="text" id="blTen" placeholder="Tên của bạn..." />
      <textarea id="blNoiDung" placeholder="Viết bình luận..."></textarea>

      <div class="bl-form-footer">
        <div class="danh-gia-box" style="background:none;padding:0">
          <span class="danh-gia-label">Đánh giá:</span>
          <span id="starPickWrap">
            ${[1, 2, 3, 4, 5]
              .map(
                (n) =>
                  `<span class="star-pick" data-star="${n}" onclick="chonSao(${n})">★</span>`,
              )
              .join("")}
          </span>
        </div>

        <button class="bl-gui-btn" onclick="guiBinhLuan()">Gửi bình luận</button>
      </div>
    </div>

    <!-- Danh sách bình luận -->
    <div id="danhSachBinhLuan">
      ${truyen.binhLuan
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
        .join("")}
    </div>
  `;
}
function doiThuTu(loai) {
  thuTuChapter = loai;
  renderChapter();
}

function toggleChapter() {
  chapterMoRong = !chapterMoRong;
  renderChapter();
}

function toggleSynopsis() {
  synopsisMoRong = !synopsisMoRong;

  const text = document.getElementById("synopsisText");
  const btn = document.getElementById("btnSynopsis");

  if (synopsisMoRong) {
    text.classList.remove("synopsis-hidden");
    btn.innerText = "▲ Thu gọn";
  } else {
    text.classList.add("synopsis-hidden");
    btn.innerText = "▼ Xem thêm";
  }
}

function moChapter(soChapter) {
  window.location.href = `./trangdoc.html?id=${truyen.id}&chapter=${soChapter}`;
}

function toggleTheoDoi() {
  dangTheoDoi = !dangTheoDoi;

  const btn = document.getElementById("btnTheodoi");

  if (dangTheoDoi) {
    btn.textContent = "✅ Đang Theo Dõi";
    btn.classList.add("dang-theo-doi");
  } else {
    btn.textContent = "🔔 Theo Dõi";
    btn.classList.remove("dang-theo-doi");
  }
}

function ganNutTheoDoi() {
  const btn = document.getElementById("btnTheodoi");
  if (btn) {
    btn.onclick = toggleTheoDoi;
  }
}

let saoDangChon = 0;

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
  renderBinhLuan();
}

function phanTuDaVaoKhungNhin(el) {
  const viTri = el.getBoundingClientRect();
  return viTri.top < window.innerHeight * 0.9;
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
  document.getElementById("breadcrumb-ten").textContent = truyen.ten;
  document.title = truyen.ten + " - Comic Web";

  renderHero();
  renderChapter();
  renderLienQuan();
  renderBinhLuan();
  ganHieuUngScroll();
  ganNutQuayLai();
  ganMenuToggle();
});
