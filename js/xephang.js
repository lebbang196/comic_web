// --- 1. CẤU HÌNH HỆ THỐNG XẾP HẠNG ---
const CAU_HINH_XEP_HANG = Object.freeze({
  iconTieuChi: {
    luotXem: "👁",
    luotTheo: "❤",
    diemDanhGia: "★",
  },
  soMucMacDinh: 10, // 3 + 7 mục như thiết kế cũ của bạn
  viTriHienNutQuayLai: 300,
});

let tieuChiHienTai = "luotXem";
let danhSachMoRong = false;

// Lấy danh sách gốc từ file dữ liệu hệ thống
const duLieuGocXepHang = typeof danhSachTruyen !== "undefined" && Array.isArray(danhSachTruyen) ? danhSachTruyen : [];

// --- 2. CÁC HÀM XỬ LÝ DỮ LIỆU & GIAO DIỆN ---
function layGiaTriSo(truyen, tieuChi) {
  if (!truyen) return 0;
  const giaTri = truyen[tieuChi];
  if (typeof giaTri === "number") return giaTri;
  return parseInt(String(giaTri || "0").replace(/,/g, ""), 10) || 0;
}

function xepHangTruyen(tieuChi) {
  return [...duLieuGocXepHang].sort((a, b) => layGiaTriSo(b, tieuChi) - layGiaTriSo(a, tieuChi));
}

function dinhDangChiSo(truyen, tieuChi) {
  const giaTri = truyen[tieuChi];
  const chuoiHienThi = tieuChi === "diemDanhGia" ? Number(giaTri || 0).toFixed(1) : giaTri;

  const fragment = document.createDocumentFragment();

  const spanIcon = document.createElement("span");
  spanIcon.className = "xh-chiso-icon";
  spanIcon.textContent = CAU_HINH_XEP_HANG.iconTieuChi[tieuChi] || "";

  const spanText = document.createElement("span");
  spanText.className = "xh-chiso-so";
  spanText.textContent = chuoiHienThi;

  fragment.append(spanIcon, spanText);
  return fragment;
}

function renderTrangXepHang() {
  const container = document.getElementById("xhDanhSach");
  if (!container) return;

  // Xóa nội dung cũ một cách an toàn
  while (container.firstChild) container.removeChild(container.firstChild);

  const dsXepHang = xepHangTruyen(tieuChiHienTai);
  const gioiHan = danhSachMoRong ? dsXepHang.length : CAU_HINH_XEP_HANG.soMucMacDinh;
  const dsHienThi = dsXepHang.slice(0, gioiHan);

  const fragmentDanhSach = document.createDocumentFragment();

  dsHienThi.forEach((truyen, index) => {
    if (!truyen) return;

    const theA = document.createElement("a");
    theA.className = "xh-hang-muc";
    theA.href = `trangchitiet.html?id=${truyen.id}`;

    const hangSo = document.createElement("div");
    hangSo.className = "xh-hang-so-nho";
    hangSo.textContent = index + 1;

    const img = document.createElement("img");
    img.src = truyen.anhBia || "img/logo.png";
    img.alt = truyen.ten || "Truyện tranh";
    img.loading = "lazy";

    const info = document.createElement("div");
    info.className = "xh-hang-muc-info";

    const ten = document.createElement("div");
    ten.className = "xh-hang-muc-ten";
    ten.textContent = truyen.ten;

    const tacGia = document.createElement("div");
    tacGia.className = "xh-hang-muc-tacgia";
    tacGia.textContent = truyen.tacGia || "Đang cập nhật";

    info.append(ten, tacGia);

    const chiSoKhung = document.createElement("div");
    chiSoKhung.className = "xh-hang-muc-chiso";
    chiSoKhung.appendChild(dinhDangChiSo(truyen, tieuChiHienTai));

    theA.append(hangSo, img, info, chiSoKhung);
    fragmentDanhSach.appendChild(theA);
  });

  container.appendChild(fragmentDanhSach);

  // Thêm nút Xem thêm / Thu gọn nếu tổng số truyện vượt mức giới hạn mặc định
  if (dsXepHang.length > CAU_HINH_XEP_HANG.soMucMacDinh) {
    const wrapNut = document.createElement("div");
    wrapNut.className = "xh-xem-them";

    const nutBam = document.createElement("button");
    nutBam.type = "button";
    nutBam.textContent = danhSachMoRong ? "▲ Thu gọn" : "▼ Xem thêm";
    nutBam.addEventListener("click", () => {
      danhSachMoRong = !danhSachMoRong;
      renderTrangXepHang();
    });

    wrapNut.appendChild(nutBam);
    container.appendChild(wrapNut);
  }
}

// --- 3. ĐĂNG KÝ SỰ KIỆN GIAO DIỆN CHUYÊN BIỆT ---
function khoiTaoSuKienTabs() {
  const cacNutTab = document.querySelectorAll(".xh-tab-nut");
  cacNutTab.forEach((nut) => {
    nut.addEventListener("click", function () {
      cacNutTab.forEach((tab) => tab.classList.remove("active"));
      this.classList.add("active");
      
      tieuChiHienTai = this.dataset.key || "luotXem";
      danhSachMoRong = false;
      renderTrangXepHang();
    });
  });
}

function khoiTaoNutQuayLai() {
  const nutQuayLai = document.getElementById("quaylai");
  if (!nutQuayLai) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > CAU_HINH_XEP_HANG.viTriHienNutQuayLai) {
      nutQuayLai.style.display = "block";
    } else {
      nutQuayLai.style.display = "none";
    }
  }, { passive: true });

  nutQuayLai.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// --- 4. KHỞI CHẠY TRANG XẾP HẠNG ---
document.addEventListener("DOMContentLoaded", () => {
  khoiTaoSuKienTabs();
  khoiTaoNutQuayLai();
  renderTrangXepHang();
});