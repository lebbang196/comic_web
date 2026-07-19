// ==================================================
// 1. CẤU HÌNH HỆ THỐNG DÙNG CHUNG
// ==================================================
const CAU_HINH_HETHONG = Object.freeze({
  trangDangNhap: "login.html",
  trangChiTiet: "trangchitiet.html",
  trangDocTruyen: "doctruyen.html",
  trangChu: "trangchu.html",
  chapterMacDinh: 1,
  idToiDa: 1000000,
  chapterToiDa: 100000,
  binhLuanToiDaKyTu: 500,
  binhLuanToiDaMoiTruyen: 40,
  ketQuaTimKiemToiDa: 50,
  tuKhoaToiDaKyTu: 100,
  viTriHienNutLenDauTrang: 300,
});


// ==================================================
// 2. CÁC HÀM TIỆN ÍCH HỆ THỐNG (UTILITIES)
// ==================================================
function docJsonLocalStorage(khoa, giaTriMacDinh) {
  try {
    const chuoiJson = localStorage.getItem(khoa);
    if (chuoiJson === null) return giaTriMacDinh;
    const duLieu = JSON.parse(chuoiJson);
    return duLieu ?? giaTriMacDinh;
  } catch (loi) {
    console.warn(`Không đọc được dữ liệu tại khóa ${khoa}.`, loi);
    return giaTriMacDinh;
  }
}

function ghiJsonLocalStorage(khoa, duLieu) {
  try {
    localStorage.setItem(khoa, JSON.stringify(duLieu));
    return true;
  } catch (loi) {
    console.warn(`Không lưu được dữ liệu tại khóa ${khoa}.`, loi);
    return false;
  }
}

function laySoNguyenDuong(value, giaTriMacDinh, giaTriToiDa) {
  if (value === null || String(value).trim() === "") return giaTriMacDinh;
  const so = Number(value);
  if (!Number.isSafeInteger(so) || so < 1 || so > giaTriToiDa) {
    return giaTriMacDinh;
  }
  return so;
}

function gioiHanChuoi(value, soKyTuToiDa) {
  return String(value ?? "").trim().slice(0, soKyTuToiDa);
}

function taoDuongDan(tenTrang, thamSo = {}) {
  const query = new URLSearchParams();
  Object.entries(thamSo).forEach(([ten, giaTri]) => {
    if (giaTri !== null && giaTri !== undefined && giaTri !== "") {
      query.set(ten, String(giaTri));
    }
  });
  const chuoiQuery = query.toString();
  return chuoiQuery ? `${tenTrang}?${chuoiQuery}` : tenTrang;
}

// ==================================================
// 3. LOGIC QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN
// ==================================================
function layTaiKhoanLuuTruHienTai() {
  return docJsonLocalStorage("currentUser", null);
}

function layMaTaiKhoanLuuTru() {
  const taiKhoan = layTaiKhoanLuuTruHienTai();
  if (!taiKhoan) return null;
  return taiKhoan.id || taiKhoan.email || taiKhoan.username || taiKhoan.tenDangNhap || taiKhoan.fullname || null;
}

function layKhoaTheoDoi() {
  const maTaiKhoan = layMaTaiKhoanLuuTru();
  return maTaiKhoan ? KHOA_THEO_DOI_PREFIX + String(maTaiKhoan).toLowerCase() : null;
}

function layKhoaTienDoDoc() {
  const maTaiKhoan = layMaTaiKhoanLuuTru();
  return maTaiKhoan ? KHOA_TIEN_DO_DOC_PREFIX + String(maTaiKhoan).toLowerCase() : null;
}

// ==================================================
// 4. HỆ THỐNG LƯU TRỮ CORE (THEO DÕI / TIẾN ĐỘ / COMMENT)
// ==================================================
function layDanhSachTheoDoi() {
  const khoa = layKhoaTheoDoi();
  if (!khoa) return [];
  const ds = docJsonLocalStorage(khoa, []);
  return Array.isArray(ds) ? ds.map(Number).filter(Number.isFinite) : [];
}

function luuDanhSachTheoDoi(danhSach) {
  const khoa = layKhoaTheoDoi();
  return khoa ? ghiJsonLocalStorage(khoa, danhSach) : false;
}

function kiemTraDaTheoDoi(idTruyen) {
  return layDanhSachTheoDoi().includes(Number(idTruyen));
}

function toggleTheoDoiId(idTruyen) {
  if (!layTaiKhoanLuuTruHienTai()) {
    alert("Bạn cần đăng nhập để thực hiện tính năng này!");
    return false;
  }
  idTruyen = Number(idTruyen);
  let danhSach = layDanhSachTheoDoi();
  const dangTheoDoi = danhSach.includes(idTruyen);

  if (dangTheoDoi) {
    danhSach = danhSach.filter((id) => id !== idTruyen);
  } else {
    danhSach.push(idTruyen);
  }
  luuDanhSachTheoDoi(danhSach);
  return !dangTheoDoi;
}

function luuTienDoDoc(idTruyen, soChapter) {
  const khoa = layKhoaTienDoDoc();
  if (!khoa) return false;
  idTruyen = Number(idTruyen);
  soChapter = Number(soChapter);
  if (!Number.isFinite(idTruyen) || !Number.isFinite(soChapter)) return false;

  const tienDo = docJsonLocalStorage(khoa, {});
  tienDo[idTruyen] = soChapter;
  return ghiJsonLocalStorage(khoa, tienDo);
}

function layChapterDangDocDo(idTruyen) {
  const khoa = layKhoaTienDoDoc();
  if (!khoa) return null;
  const tienDo = docJsonLocalStorage(khoa, {});
  const chapter = Number(tienDo[Number(idTruyen)]);
  return Number.isFinite(chapter) && chapter > 0 ? chapter : null;
}

// ==================================================
// 5. GIAO DIỆN CHUNG (MENU / TÀI KHOẢN / CUỘN TRANG)
// ==================================================
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

function ganNutQuayLai() {
  const nut = document.getElementById("quaylai");
  if (!nut) return;

  window.addEventListener("scroll", function () {
    nut.style.display = window.scrollY > CAU_HINH_HETHONG.viTriHienNutLenDauTrang ? "block" : "none";
  });

  nut.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function ganTaiKhoanHeader() {
  const khuChuaDangNhap = document.getElementById("khuChuaDangNhap");
  const khuDaDangNhap = document.getElementById("khuDaDangNhap");
  const nutTaiKhoan = document.getElementById("nutTaiKhoan");
  const bangTaiKhoan = document.getElementById("bangTaiKhoan");
  const nutDangXuat = document.getElementById("nutDangXuat");
  const tenTaiKhoan = document.getElementById("tenTaiKhoan");

  if (!khuChuaDangNhap || !khuDaDangNhap) return;

  const currentUser = layTaiKhoanLuuTruHienTai();

  if (!currentUser) {
    khuChuaDangNhap.classList.remove("tai-khoan-an");
    khuDaDangNhap.classList.add("tai-khoan-an");
    return;
  }

  khuChuaDangNhap.classList.add("tai-khoan-an");
  khuDaDangNhap.classList.remove("tai-khoan-an");

  if (tenTaiKhoan) {
    tenTaiKhoan.textContent = gioiHanChuoi(currentUser.fullname || currentUser.username || currentUser.email, 20);
  }

  // Điền nốt thông tin phụ nếu các thẻ tồn tại trong bảng thông tin
  const hoTen = document.getElementById("hoTenTaiKhoan");
  const email = document.getElementById("emailTaiKhoan");
  const ngayTao = document.getElementById("ngayTaoTaiKhoan");
  
  if (hoTen) hoTen.textContent = currentUser.fullname || "Chưa cập nhật";
  if (email) email.textContent = currentUser.email || "Chưa cập nhật";
  if (ngayTao) {
    ngayTao.textContent = currentUser.createdAt
      ? new Date(currentUser.createdAt).toLocaleDateString("vi-VN")
      : "Chưa có thông tin";
  }

  if (nutTaiKhoan && bangTaiKhoan) {
    nutTaiKhoan.addEventListener("click", function (e) {
      e.stopPropagation();
      bangTaiKhoan.classList.toggle("tai-khoan-an");
    });
    bangTaiKhoan.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    document.addEventListener("click", function () {
      bangTaiKhoan.classList.add("tai-khoan-an");
    });
  }

  if (nutDangXuat) {
    nutDangXuat.addEventListener("click", function () {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("rememberMe");
      window.location.href = CAU_HINH_HETHONG.trangChu;
    });
  }
}
// ==================================================
// 6. HỆ THỐNG TÌM KIẾM TOÀN CỤC (MỚI TÍCH HỢP)
// ==================================================
function ganTimKiemHeThong() {
  const oTimKiem = document.getElementById("inputsearch");
  const khungKetQua = document.getElementById("khungKetQua");
  const vungKetQuaTimKiem = document.getElementById("ketquatimkiem");
  const menu = document.querySelector(".menu"); // Lấy thêm phần tử menu để xử lý mobile

  if (!oTimKiem || !khungKetQua || !vungKetQuaTimKiem) return;

  oTimKiem.addEventListener("input", function () {
    try {
      const vungNoiDungChinh = 
        document.getElementById("trangchu-page") || 
        document.getElementById("xephang-page") || 
        document.getElementById("theloai-page") || 
        document.getElementById("chitiet-page") || 
        document.getElementById("doctruyen-page") ||
        document.getElementById("tdDanhSach") ||       
        document.getElementById("container-truyen");   

      const tuKhoa = gioiHanChuoi(oTimKiem.value, CAU_HINH_HETHONG.tuKhoaToiDaKyTu).toLowerCase();

      // Trường hợp 1: Ô tìm kiếm trống -> Hiện lại nội dung gốc
      if (tuKhoa === "") {
        vungKetQuaTimKiem.style.display = "none";
        if (vungNoiDungChinh) vungNoiDungChinh.style.display = ""; 
        while (khungKetQua.firstChild) khungKetQua.removeChild(khungKetQua.firstChild);
        return;
      }

      // Trường hợp 2: Có từ khóa -> Xử lý mượt mà cho Mobile
      if (vungNoiDungChinh) {
        vungNoiDungChinh.style.display = "none";
      }
      vungKetQuaTimKiem.style.display = "block";

      // ĐÓNG MENU 3 GẠCH TRÊN MOBILE KHI ĐANG GÕ TÌM KIẾM ĐỂ TRÁNH CÀ GIỰT LAYOUT
      if (menu && menu.classList.contains("active")) {
        menu.classList.remove("active");
      }

      const duLieuGoc = typeof danhSachTruyen !== "undefined" && Array.isArray(danhSachTruyen) ? danhSachTruyen : [];
      
      const ketQuaLoc = duLieuGoc.filter((truyen) => {
        return (
          String(truyen.ten || "").toLowerCase().includes(tuKhoa) ||
          String(truyen.tacGia || "").toLowerCase().includes(tuKhoa) ||
          (Array.isArray(truyen.theLoai) && truyen.theLoai.join(" ").toLowerCase().includes(tuKhoa))
        );
      }).slice(0, CAU_HINH_HETHONG.ketQuaTimKiemToiDa); 

      while (khungKetQua.firstChild) khungKetQua.removeChild(khungKetQua.firstChild);

      if (ketQuaLoc.length === 0) {
        const p = document.createElement("p");
        p.textContent = "🔍 Không tìm thấy truyện phù hợp vui lòng nhập từ khóa khác";
        p.style.cssText = "color: white; font-size: 18px; text-align: center; padding: 40px; grid-column: 1 / -1;";
        khungKetQua.appendChild(p);
        return;
      }

      const fragment = document.createDocumentFragment();
      ketQuaLoc.forEach((truyen) => {
        const item = document.createElement("div");
        item.className = "khungtruyenrieng";

        const link = document.createElement("a");
        link.href = taoDuongDan(CAU_HINH_HETHONG.trangChiTiet, { id: truyen.id });

        const img = document.createElement("img");
        img.src = truyen.anhBia || "img/logo.png";
        img.alt = truyen.ten || "Truyện tranh";
        img.loading = "lazy";

        const h3 = document.createElement("h3");
        h3.textContent = truyen.ten;

        link.append(img, h3);

        const span = document.createElement("span");
        span.textContent = Array.isArray(truyen.theLoai) ? truyen.theLoai.join(" • ") : "Đang cập nhật";

        item.append(link, span);
        fragment.appendChild(item);
      });

      khungKetQua.appendChild(fragment);
    } catch (error) {
      console.error("Lỗi xử lý tìm kiếm đa trang:", error);
    }
  });
}
// Tự động kích hoạt tất cả cấu trúc giao diện dùng chung ở mọi trang khi DOM load xong
document.addEventListener("DOMContentLoaded", function () {
  ganMenu();
  ganNutQuayLai();
  ganTaiKhoanHeader();
  ganTimKiemHeThong();
});