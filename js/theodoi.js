// --- 1. CẤU HÌNH HỆ THỐNG ---
const CAU_HINH_THEO_DOI = Object.freeze({
  viTriHienNutQuayLai: 300,
  trangDangNhap: "login.html",
});

const duLieuGocTruyen = typeof danhSachTruyen !== "undefined" && Array.isArray(danhSachTruyen) ? danhSachTruyen : [];

// --- 2. CÁC HÀM TIỆN ÍCH CORE ---
function layTaiKhoanHienTai() {
  try {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
}

function xoaTrangPhanTu(phanTu) {
  if (!phanTu) return;
  while (phanTu.firstChild) phanTu.removeChild(phanTu.firstChild);
}

// --- 3. ĐIỀU KHIỂN RENDER DANH SÁCH THEO DÕI ---
function renderDanhSachTheoDoi() {
  const grid = document.getElementById("tdDanhSach");
  const thongBaoRong = document.getElementById("tdRong");
  if (!grid || !thongBaoRong) return;

  xoaTrangPhanTu(grid);
  xoaTrangPhanTu(thongBaoRong);

  const taiKhoan = layTaiKhoanHienTai();

  // THỨ 1: Trường hợp chưa đăng nhập tài khoản
  if (!taiKhoan) {
    thongBaoRong.style.display = "block";
    thongBaoRong.appendChild(document.createTextNode("Bạn cần "));

    const linkDangNhap = document.createElement("a");
    const trangHienTai = `${window.location.pathname}${window.location.search}`;
    linkDangNhap.href = `${CAU_HINH_THEO_DOI.trangDangNhap}?quaylai=${encodeURIComponent(trangHienTai)}`;
    linkDangNhap.style.color = "#ff4757";
    linkDangNhap.style.textDecoration = "underline";
    linkDangNhap.textContent = "đăng nhập";

    thongBaoRong.append(linkDangNhap, " để xem danh sách truyện đang theo dõi.");
    return;
  }

  // Lấy danh sách ID đã theo dõi từ bộ nhớ luutru.js
  const dsIdTheoDoi = typeof layDanhSachTheoDoi === "function" ? layDanhSachTheoDoi() : [];

  // THỨ 2: Tài khoản đã đăng nhập nhưng chưa theo dõi bất kỳ truyện nào
  if (dsIdTheoDoi.length === 0) {
    thongBaoRong.style.display = "block";
    thongBaoRong.textContent = 'Bạn chưa theo dõi truyện nào. Hãy vào một truyện và bấm nút "❤ Theo Dõi" nhé!';
    return;
  }

  // Lọc truyện nguyên bản theo danh sách ID (Không lọc theo từ khóa nữa)
  const dsTruyenTheoDoi = duLieuGocTruyen.filter((truyen) => {
    if (!truyen) return false;
    return dsIdTheoDoi.includes(Number(truyen.id));
  });

  // Hiển thị danh sách truyện hợp lệ
  thongBaoRong.style.display = "none";
  const fragment = document.createDocumentFragment();

  dsTruyenTheoDoi.forEach((truyen) => {
    const theKhung = document.createElement("div");
    theKhung.className = "khungtruyenrieng td-the";

    // Nút gỡ nhanh truyện khỏi danh sách theo dõi
    const nutBoTheoDoi = document.createElement("button");
    nutBoTheoDoi.type = "button";
    nutBoTheoDoi.className = "td-nut-bo";
    nutBoTheoDoi.dataset.id = truyen.id;
    nutBoTheoDoi.title = "Bỏ theo dõi";
    nutBoTheoDoi.textContent = "✕";

    const theLink = document.createElement("a");
    theLink.href = `trangchitiet.html?id=${truyen.id}`;

    const anhBia = document.createElement("img");
    anhBia.src = truyen.anhBia || "img/logo.png";
    anhBia.alt = truyen.ten || "Truyện";
    anhBia.loading = "lazy";

    const tieuDeH3 = document.createElement("h3");
    tieuDeH3.textContent = truyen.ten;

    theLink.append(anhBia, tieuDeH3);

    const dongTheLoai = document.createElement("span");
    dongTheLoai.textContent = Array.isArray(truyen.theLoai) ? truyen.theLoai.join(" - ") : "Đang cập nhật";

    theKhung.append(nutBoTheoDoi, theLink, dongTheLoai);
    fragment.appendChild(theKhung);
  });

  grid.appendChild(fragment);
}

// --- 4. KHỞI TẠO CÁC SỰ KIỆN GIAO DIỆN CHUYÊN BIỆT ---
function khoiTaoSuKienTrangTheoDoi() {
  const grid = document.getElementById("tdDanhSach");

  if (grid) {
    // Sử dụng Event Delegation để gỡ nhanh truyện
    grid.addEventListener("click", (event) => {
      const nutBamXoa = event.target.closest(".td-nut-bo");
      if (!nutBamXoa) return;

      const idTruyen = Number(nutBamXoa.dataset.id);
      if (typeof toggleTheoDoiId === "function") {
        toggleTheoDoiId(idTruyen);
      }

      // Render lại danh sách sạch sau khi bỏ theo dõi
      renderDanhSachTheoDoi();
    });
  }
}

// --- 5. LẮP RÁP HOÀN CHỈNH ---
document.addEventListener("DOMContentLoaded", () => {
  renderDanhSachTheoDoi();
  khoiTaoSuKienTrangTheoDoi();
});