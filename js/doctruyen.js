// --- 1. CẤU HÌNH & KHỞI TẠO HỆ THỐNG ---
const CAU_HINH_DOC_TRUYEN = Object.freeze({
  trangDangNhap: "login.html",
  trangChiTiet: "trangchitiet.html",
  trangDocTruyen: "doctruyen.html",
  chapterMacDinh: 1,
  idToiDa: 1000000,
  chapterToiDa: 100000,
  binhLuanToiDaKyTu: 500,
  binhLuanToiDaMoiTruyen: 40,
  anhToiDaMoiChapter: 500,
  viTriHienNutLenDauTrang: 300,
  viTriBatDauSticky: 100,
  khoangCachMepMenu: 10,
  thoiGianDongMenu: 1000,
});

const KHO_BINH_LUAN_CHUNG = "app_comments";

const duLieuChuong = typeof chapters !== "undefined" && Array.isArray(chapters) ? chapters : [];
const duLieuTruyen = typeof danhSachTruyen !== "undefined" && Array.isArray(danhSachTruyen) ? danhSachTruyen : [];

// --- 2. CÁC HÀM TIỆN ÍCH CORE TRANG ---
function docJsonLocalStorage(khoa, giaTriMacDinh) {
  try {
    const chuoiJson = localStorage.getItem(khoa);
    return chuoiJson !== null ? JSON.parse(chuoiJson) : giaTriMacDinh;
  } catch (loi) {
    return giaTriMacDinh;
  }
}

function ghiJsonLocalStorage(khoa, duLieu) {
  try {
    localStorage.setItem(khoa, JSON.stringify(duLieu));
    return true;
  } catch (loi) {
    return false;
  }
}

function laySoNguyenDuong(value, giaTriMacDinh, giaTriToiDa) {
  if (value === null || String(value).trim() === "") return giaTriMacDinh;
  const so = Number(value);
  if (!Number.isSafeInteger(so) || so < 1 || so > giaTriToiDa) return giaTriMacDinh;
  return so;
}

function gioiHanChuoi(value, soKyTuToiDa) {
  return String(value ?? "").trim().slice(0, soKyTuToiDa);
}

function xoaNoiDungPhanTu(phanTu) {
  if (!phanTu) return;
  while (phanTu.firstChild) phanTu.removeChild(phanTu.firstChild);
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

function layTaiKhoanHienTai() {
  // Lấy dữ liệu từ cấu trúc phiên hoạt động của common.js thiết lập
  try {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || typeof user !== "object") return null;
    
    const tenHienThi = gioiHanChuoi(user.fullname || user.username || user.email, 80);
    if (!tenHienThi) return null;
    
    return { ...user, tenHienThi };
  } catch (e) {
    return null;
  }
}

function taoLinkDangNhap() {
  const trangHienTai = `${window.location.pathname}${window.location.search}`;
  return taoDuongDan(CAU_HINH_DOC_TRUYEN.trangDangNhap, { quaylai: trangHienTai });
}

function hienThiLoiDocTruyen(thongBao) {
  const reader = document.getElementById("reader");
  if (!reader) return;
  xoaNoiDungPhanTu(reader);
  const tieuDe = document.createElement("h2");
  tieuDe.style.textAlign = "center";
  tieuDe.style.padding = "40px 20px";
  tieuDe.textContent = thongBao;
  reader.appendChild(tieuDe);
}

// --- 3. ĐỌC THAM SỐ TRUYỆN ĐANG ĐỌC ---
const thamSoUrl = new URLSearchParams(window.location.search);
const idTruyen = laySoNguyenDuong(thamSoUrl.get("id"), null, CAU_HINH_DOC_TRUYEN.idToiDa);
const soChapter = laySoNguyenDuong(thamSoUrl.get("chapter"), CAU_HINH_DOC_TRUYEN.chapterMacDinh, CAU_HINH_DOC_TRUYEN.chapterToiDa);

const truyen = duLieuTruyen.find((item) => item?.id === idTruyen) ?? null;
const chap = duLieuChuong.find((item) => item?.id === idTruyen && item?.chapter === soChapter) ?? null;

// --- 4. QUẢN LÝ BÌNH LUẬN CHAPTER ---
function layBinhLuanCuaTruyen() {
  if (!truyen) return [];
  const khoBinhLuan = docJsonLocalStorage(KHO_BINH_LUAN_CHUNG, {});
  const danhSach = khoBinhLuan[String(truyen.id)];
  return Array.isArray(danhSach) ? danhSach.slice(-CAU_HINH_DOC_TRUYEN.binhLuanToiDaMoiTruyen) : [];
}

function luuBinhLuanMoi(binhLuan) {
  if (!truyen) return false;
  const khoBinhLuan = docJsonLocalStorage(KHO_BINH_LUAN_CHUNG, {});
  const khoaTruyen = String(truyen.id);
  const danhSachCu = Array.isArray(khoBinhLuan[khoaTruyen]) ? khoBinhLuan[khoaTruyen] : [];
  
  danhSachCu.push(binhLuan);
  khoBinhLuan[khoaTruyen] = danhSachCu.slice(-CAU_HINH_DOC_TRUYEN.binhLuanToiDaMoiTruyen);
  
  return ghiJsonLocalStorage(KHO_BINH_LUAN_CHUNG, khoBinhLuan);
}

function taoDongBinhLuan(binhLuan) {
  const item = document.createElement("div");
  item.classList.add("comment-item");

  const thoiGian = document.createElement("span");
  thoiGian.classList.add("comment-time");

  const ten = document.createElement("strong");
  ten.textContent = gioiHanChuoi(binhLuan.fullname || binhLuan.ten || binhLuan.email, 80) || "Người dùng";
  thoiGian.appendChild(ten);

  thoiGian.appendChild(document.createTextNode(` · ${gioiHanChuoi(binhLuan.ngayDang || binhLuan.thoiGian, 40)}`));

  const noiDung = document.createElement("p");
  noiDung.classList.add("comment-text");
  noiDung.textContent = gioiHanChuoi(binhLuan.noiDung, CAU_HINH_DOC_TRUYEN.binhLuanToiDaKyTu);

  item.append(thoiGian, noiDung);
  return item;
}

function renderBinhLuanChapter(commentList) {
  if (!commentList || !chap) return;
  xoaNoiDungPhanTu(commentList);
  
  const danhSach = layBinhLuanCuaTruyen()
    .filter((binhLuan) => Number(binhLuan?.chapterSo) === Number(chap.chapter))
    .reverse();
    
  if (danhSach.length === 0) {
    const thongBao = document.createElement("p");
    thongBao.classList.add("comment-empty");
    thongBao.textContent = "Chưa có bình luận nào ở chapter này. Hãy là người đầu tiên!";
    commentList.appendChild(thongBao);
    return;
  }

  const fragment = document.createDocumentFragment();
  danhSach.forEach((binhLuan) => fragment.appendChild(taoDongBinhLuan(binhLuan)));
  commentList.appendChild(fragment);
}

function khoiTaoBinhLuan() {
  const form = document.getElementById("commentForm");
  const input = document.getElementById("commentInput");
  const list = document.getElementById("commentList");
  const thongBaoDangNhap = document.getElementById("blThongBaoDangNhap");
  const linkDangNhap = document.getElementById("blLinkDangNhap");

  if (!form || !input || !list || !truyen || !chap) return;

  input.maxLength = CAU_HINH_DOC_TRUYEN.binhLuanToiDaKyTu;
  const taiKhoan = layTaiKhoanHienTai();

  form.style.display = taiKhoan ? "block" : "none";
  if (thongBaoDangNhap) thongBaoDangNhap.style.display = taiKhoan ? "none" : "block";
  if (linkDangNhap) linkDangNhap.href = taoLinkDangNhap();

  renderBinhLuanChapter(list);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const taiKhoanMoi = layTaiKhoanHienTai();
    if (!taiKhoanMoi) {
      window.location.assign(taoLinkDangNhap());
      return;
    }

    const noiDung = gioiHanChuoi(input.value, CAU_HINH_DOC_TRUYEN.binhLuanToiDaKyTu);
    if (!noiDung) return;

    const binhLuan = {
      id: Date.now(),
      fullname: taiKhoanMoi.fullname || taiKhoanMoi.tenHienThi || null,
      email: taiKhoanMoi.email || "Ẩn danh",
      noiDung,
      ngayDang: new Date().toLocaleString("vi-VN"),
      saoDanhGia: 0,
      chapterSo: Number(chap.chapter),
    };

    if (luuBinhLuanMoi(binhLuan)) {
      input.value = "";
      renderBinhLuanChapter(list);
    } else {
      alert("Không thể lưu bình luận. Vui lòng thử lại sau.");
    }
  });
}

// --- 5. TƯƠNG TÁC YÊU THÍCH (THEO DÕI) ---
function kiemTraTheoDoi() {
  if (!truyen || typeof kiemTraDaTheoDoi !== "function") return false;
  return Boolean(kiemTraDaTheoDoi(truyen.id));
}

function daoTrangThaiTheoDoi() {
  if (!truyen || typeof toggleTheoDoiId !== "function") return false;
  return Boolean(toggleTheoDoiId(truyen.id));
}

function capNhatNutYeuThich(nut, dangTheoDoi) {
  let icon = nut.querySelector("i");
  if (!icon) {
    icon = document.createElement("i");
    nut.prepend(icon);
  }
  icon.className = dangTheoDoi ? "fa-solid fa-heart" : "fa-regular fa-heart";

  let nhan = nut.querySelector(".love-label");
  if (!nhan) {
    Array.from(nut.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) node.remove();
    });
    nhan = document.createElement("span");
    nhan.classList.add("love-label");
    nut.appendChild(nhan);
  }

  nhan.textContent = dangTheoDoi ? " Đã thích" : " Yêu thích";
  nut.classList.toggle("is-loved", dangTheoDoi);
}

function khoiTaoYeuThich() {
  if (!truyen) return;

  const cacNut = document.querySelectorAll(".love");
  const taiKhoan = layTaiKhoanHienTai();
  
  const capNhatTatCa = (trangThai) => {
    cacNut.forEach((nut) => capNhatNutYeuThich(nut, trangThai));
  };

  capNhatTatCa(taiKhoan ? kiemTraTheoDoi() : false);

  cacNut.forEach((nut) => {
    nut.addEventListener("click", () => {
      const taiKhoanMoi = layTaiKhoanHienTai();
      if (!taiKhoanMoi) {
        window.location.assign(taoLinkDangNhap());
        return;
      }
      capNhatTatCa(daoTrangThaiTheoDoi());
    });
  });
}

// --- 6. TIẾN ĐỘ ĐỌC & LIÊN KẾT ĐIỀU HƯỚNG ---
function luuTienDoHienTai() {
  if (!truyen || !chap || typeof luuTienDoDoc !== "function") return;
  luuTienDoDoc(truyen.id, chap.chapter);
}

function ganLienKetCoBan() {
  if (!truyen) return;
  document.querySelectorAll(".menus").forEach((menu) => {
    menu.href = taoDuongDan(CAU_HINH_DOC_TRUYEN.trangChiTiet, { id: truyen.id });
  });
}

function ganDieuHuongChapter() {
  if (!truyen || !chap) return;

  const danhSachChap = duLieuChuong
    .filter((item) => item?.id === truyen.id)
    .slice()
    .sort((a, b) => a.chapter - b.chapter);
    
  const viTriHienTai = danhSachChap.findIndex((item) => item.chapter === chap.chapter);
  const chapTruoc = danhSachChap[viTriHienTai - 1];
  const chapSau = danhSachChap[viTriHienTai + 1];

  document.querySelectorAll(".nav_inline").forEach((nav) => {
    const cacNut = nav.querySelectorAll(".arrow-box");
    if (cacNut.length < 2) return;
    ganTrangThaiNutChapter(cacNut[0], chapTruoc, "Đây là chapter đầu tiên");
    ganTrangThaiNutChapter(cacNut[1], chapSau, "Đây là chapter cuối cùng");
  });
}

function ganTrangThaiNutChapter(nut, chapterDich, thongBaoBien) {
  if (!chapterDich) {
    nut.removeAttribute("href");
    nut.classList.add("disabled");
    nut.title = thongBaoBien;
    return;
  }
  nut.href = taoDuongDan(CAU_HINH_DOC_TRUYEN.trangDocTruyen, { id: truyen.id, chapter: chapterDich.chapter });
  nut.classList.remove("disabled");
  nut.title = `Chapter ${chapterDich.chapter}`;
}

// --- 7. RENDER NỘI DUNG CHAPTER CHÍNH ---
function renderNoiDungChapter() {
  if (!chap) return;

  document.querySelectorAll(".chapter-name").forEach((phanTu) => {
    phanTu.textContent = `Chapter ${chap.chapter}`;
  });

  const reader = document.getElementById("reader");
  if (!reader) return;

  xoaNoiDungPhanTu(reader);
  const fragment = document.createDocumentFragment();
  const danhSachAnh = Array.isArray(chap.images) ? chap.images.slice(0, CAU_HINH_DOC_TRUYEN.anhToiDaMoiChapter) : [];

  danhSachAnh.forEach((duongDanAnh, index) => {
    const anh = document.createElement("img");
    anh.src = String(duongDanAnh);
    anh.alt = `Trang ${index + 1} - Chapter ${chap.chapter}`;
    anh.loading = index < 2 ? "eager" : "lazy";
    fragment.appendChild(anh);
  });
  reader.appendChild(fragment);
}

function renderDanhSachChapter() {
  if (!truyen) return;

  const danhSach = duLieuChuong
    .filter((item) => item?.id === truyen.id)
    .slice()
    .sort((a, b) => a.chapter - b.chapter);

  document.querySelectorAll(".chapter-list").forEach((khung) => {
    xoaNoiDungPhanTu(khung);
    const fragment = document.createDocumentFragment();

    danhSach.forEach((item) => {
      const link = document.createElement("a");
      link.href = taoDuongDan(CAU_HINH_DOC_TRUYEN.trangDocTruyen, { id: truyen.id, chapter: item.chapter });
      link.textContent = `Chapter ${item.chapter}`;
      link.classList.toggle("active", item.chapter === chap?.chapter);
      fragment.appendChild(link);
    });
    khung.appendChild(fragment);
  });
}

// --- 8. HIỆU ỨNG GIAO DIỆN CHUYÊN BIỆT TRANG ĐỌC ---
function khoiTaoDanhSachChapterNoi() {
  document.querySelectorAll(".check__line").forEach((nut) => {
    const menu = nut.querySelector(".chapter-list");
    if (!menu) return;

    let boDemDong;
    nut.addEventListener("mouseenter", () => {
      clearTimeout(boDemDong);
      menu.classList.add("show");

      requestAnimationFrame(() => {
        const viTri = menu.getBoundingClientRect();
        if (viTri.top < CAU_HINH_DOC_TRUYEN.khoangCachMepMenu) {
          nut.classList.remove("open-up");
        } else if (viTri.bottom > document.documentElement.clientHeight - CAU_HINH_DOC_TRUYEN.khoangCachMepMenu) {
          nut.classList.add("open-up");
        }
      });
    });

    nut.addEventListener("mouseleave", () => {
      boDemDong = setTimeout(() => {
        if (!nut.classList.contains("active")) menu.classList.remove("show");
      }, CAU_HINH_DOC_TRUYEN.thoiGianDongMenu);
    });

    nut.addEventListener("click", (event) => {
      event.stopPropagation();
      const dangMo = nut.classList.toggle("active");
      menu.classList.toggle("show", dangMo);
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".check__line").forEach((nut) => {
      nut.classList.remove("active");
      nut.querySelector(".chapter-list")?.classList.remove("show");
    });
  });
}

function khoiTaoThanhDieuHuongNoi() {
  const thanhDieuHuong = document.querySelector(".div_main.top");
  const mocFooter = document.querySelector(".div_main.bottom");
  const nutLenDauTrang = document.getElementById("btnScrollTop");
  if (!thanhDieuHuong || !mocFooter) return;

  let viTriCu = window.scrollY;

  nutLenDauTrang?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    const viTriMoi = window.scrollY;
    const daChamFooter = viTriMoi + document.documentElement.clientHeight >= mocFooter.offsetTop;

    if (nutLenDauTrang) {
      nutLenDauTrang.style.display = viTriMoi > CAU_HINH_DOC_TRUYEN.viTriHienNutLenDauTrang ? "block" : "none";
    }

    if (viTriMoi <= CAU_HINH_DOC_TRUYEN.viTriBatDauSticky || daChamFooter) {
      thanhDieuHuong.classList.remove("fixed-top", "fixed-bottom");
      viTriCu = viTriMoi;
      return;
    }

    const dangCuonXuong = viTriMoi > viTriCu;
    thanhDieuHuong.classList.toggle("fixed-bottom", dangCuonXuong);
    thanhDieuHuong.classList.toggle("fixed-top", !dangCuonXuong);
    document.querySelectorAll(".check__line").forEach((nut) => {
      nut.classList.toggle("open-up", dangCuonXuong);
    });
    viTriCu = viTriMoi;
  });
}

// --- 9. KHỞI CHẠY CHỨC NĂNG TRANG ĐỌC TRUYỆN ---
function khoiTaoTrangDocTruyen() {
  // Bỏ khoiTaoMenu() và khoiTaoTimKiem() vì file common.js đã tự khởi chạy tự động
  khoiTaoDanhSachChapterNoi();
  khoiTaoThanhDieuHuongNoi();

  if (!truyen) {
    hienThiLoiDocTruyen("Không tìm thấy thông tin truyện trong hệ thống.");
    return;
  }

  ganLienKetCoBan();

  if (!chap) {
    hienThiLoiDocTruyen("Chương truyện chưa được cập nhật hoặc không tồn tại.");
    return;
  }

  ganDieuHuongChapter();
  renderNoiDungChapter();
  renderDanhSachChapter();
  khoiTaoBinhLuan();
  khoiTaoYeuThich();
  luuTienDoHienTai();
}

document.addEventListener("DOMContentLoaded", khoiTaoTrangDocTruyen);