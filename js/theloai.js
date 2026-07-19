// --- 1. KHỞI TẠO BIẾN & DỮ LIỆU ---
const duLieuGocTruyen = typeof danhSachTruyen !== "undefined" && Array.isArray(danhSachTruyen) ? danhSachTruyen : [];

// --- 2. HÀM DỰNG GIAO DIỆN DANH SÁCH (RENDER) ---
function renderDanhSachTruyenTheoLoai(danhSach) {
  const khungChua = document.getElementById("khungTruyenTheoLoai");
  if (!khungChua) return;

  // Xóa sạch phần tử con cũ một cách an toàn và tối ưu hiệu năng
  while (khungChua.firstChild) {
    khungChua.removeChild(khungChua.firstChild);
  }

  // Sử dụng DocumentFragment để tránh hiện tượng lặp Reflow/Repaint trình duyệt
  const fragment = document.createDocumentFragment();

  danhSach.forEach((truyen) => {
    const theKhungRieng = document.createElement("div");
    theKhungRieng.className = "khungtruyenrieng";

    const theLink = document.createElement("a");
    // Đồng bộ hàm taoDuongDan từ common.js (nếu có) hoặc dùng chuỗi mặc định
    theLink.href = typeof taoDuongDan === "function" 
      ? taoDuongDan("trangchitiet.html", { id: truyen.id })
      : `trangchitiet.html?id=${truyen.id}`;

    const anhBia = document.createElement("img");
    anhBia.src = truyen.anhBia || "img/logo.png";
    anhBia.alt = truyen.ten || "Truyện tranh";
    anhBia.loading = "lazy";

    const tieuDeH3 = document.createElement("h3");
    tieuDeH3.textContent = truyen.ten;

    theLink.append(anhBia, tieuDeH3);

    const dongTheLoai = document.createElement("span");
    dongTheLoai.textContent = Array.isArray(truyen.theLoai) ? truyen.theLoai.join(" - ") : "Đang cập nhật";

    theKhungRieng.append(theLink, dongTheLoai);
    fragment.appendChild(theKhungRieng);
  });

  khungChua.appendChild(fragment);
}

// --- 3. ĐIỀU PHỐI LOGIC THỂ LOẠI ---
function phanTichVaTaiTheLoai() {
  const urlParams = new URLSearchParams(window.location.search);
  const thamSoTheLoai = urlParams.get("theloai");

  const tieuDeTrang = document.getElementById("theloai-title");
  const thongBaoTrong = document.getElementById("empty-message");

  let danhSachHienThi = [];
  let chuoiTieuDe = "📚 Tất Cả Thể Loại";

  if (thamSoTheLoai) {
    const theLoaiCanTim = String(thamSoTheLoai).trim().toLowerCase();
    
    // Lọc danh sách truyện tương thích với thể loại truyền vào từ URL
    danhSachHienThi = duLieuGocTruyen.filter((truyen) =>
      Array.isArray(truyen.theLoai) && truyen.theLoai.some((tl) => String(tl).toLowerCase() === theLoaiCanTim)
    );
    chuoiTieuDe = `📚 Thể loại: ${thamSoTheLoai}`;
  } else {
    danhSachHienThi = duLieuGocTruyen;
  }

  // Cập nhật tiêu đề trang
  if (tieuDeTrang) {
    tieuDeTrang.textContent = chuoiTieuDe;
  }

  // Xử lý kịch bản không tìm thấy truyện nào thuộc danh mục
  if (danhSachHienThi.length === 0) {
    if (thongBaoTrong) {
      thongBaoTrong.textContent = "Không có truyện nào thuộc thể loại này.";
      thongBaoTrong.style.display = "block";
    }
    const khungChua = document.getElementById("khungTruyenTheoLoai");
    if (khungChua) {
      while (khungChua.firstChild) khungChua.removeChild(khungChua.firstChild);
    }
    return;
  }

  if (thongBaoTrong) thongBaoTrong.style.display = "none";
  renderDanhSachTruyenTheoLoai(danhSachHienThi);
}

// --- 4. CHẠY KHI TRANG SẴN SÀNG ---
document.addEventListener("DOMContentLoaded", () => {
  phanTichVaTaiTheLoai();
  // Đã xóa bỏ khoiTaoNutQuayLaiDauTrang() và linkSanSuKienInputTimKiem() 
  // vì common.js đã tự động xử lý toàn cục, tránh xung đột gây giật menu.
});