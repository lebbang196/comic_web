// ==================================================
// 1. CẤU HÌNH ĐẶC THÙ TRANG CHỦ
// ==================================================
const CAU_HINH_TRANG_CHU = Object.freeze({
  anhNenSlide: ["img/bg1.png", "img/bg2.jpg", "img/bg3.jpg"],
  thoiGianChuyenNenMs: 5000,
  chieuCaoThuGonDeCu: "950px",
});

// ==================================================
// 2. LOGIC TÌM KIẾM TRÊN TRANG CHỦ (LỌC DATA GỐC)
// ==================================================
function taoTheTruyenTimKiem(item) {
  const khung = document.createElement("div");
  khung.classList.add("khungtruyenrieng");

  const link = document.createElement("a");
  // Hàm taoDuongDan lấy từ common.js
  link.href = taoDuongDan(CAU_HINH_HETHONG.trangChiTiet, { id: item.id });

  const anh = document.createElement("img");
  anh.src = String(item.anhBia ?? "");
  anh.alt = gioiHanChuoi(item.ten, 120);
  anh.loading = "lazy";

  const ten = document.createElement("h3");
  ten.textContent = gioiHanChuoi(item.ten, 120);

  const theLoai = document.createElement("span");
  theLoai.textContent = Array.isArray(item.theLoai) ? item.theLoai.slice(0, 10).join(" • ") : "";

  link.append(anh, ten);
  khung.append(link, theLoai);
  return khung;
}

function ganTimKiemTrangChu() {
  const input = document.getElementById("inputsearch");
  const ketQua = document.getElementById("khungKetQua");
  const khungKetQua = document.getElementById("ketquatimkiem");

  // Các danh mục nội dung cần ẩn đi khi người dùng đang tìm kiếm
  const cacMucNoiDung = [
    document.getElementById("theloai"),
    document.getElementById("phobien"),
    document.getElementById("moiramat"),
    document.getElementById("sapramat"),
    document.getElementById("decu"),
  ].filter(Boolean); // Lọc bỏ các phần tử bị null nếu lỡ sai ID trong HTML

  if (!input || !ketQua || !khungKetQua) return;

  input.maxLength = CAU_HINH_HETHONG.tuKhoaToiDaKyTu;

  input.addEventListener("input", function () {
    const tuKhoa = gioiHanChuoi(input.value, CAU_HINH_HETHONG.tuKhoaToiDaKyTu).toLowerCase();
    
    // Hàm xoaNoiDungPhanTu/replaceChildren dọn sạch kết quả cũ
    if (typeof ketQua.replaceChildren === "function") {
      ketQua.replaceChildren();
    } else {
      while (ketQua.firstChild) ketQua.removeChild(ketQua.firstChild);
    }

    // Nếu để trống ô tìm kiếm: Hiện lại toàn bộ danh mục trang chủ, ẩn khung tìm kiếm
    if (tuKhoa === "") {
      khungKetQua.style.display = "none";
      cacMucNoiDung.forEach((muc) => (muc.style.display = "block"));
      return;
    }

    // Nếu bắt đầu gõ: Ẩn các khối nội dung tĩnh, hiện khối tìm kiếm
    khungKetQua.style.display = "block";
    cacMucNoiDung.forEach((muc) => (muc.style.display = "none"));

    // Lọc dữ liệu từ mảng danhSachTruyen (Data gốc của hệ thống)
    if (typeof danhSachTruyen === "undefined" || !Array.isArray(danhSachTruyen)) {
      console.warn("Không tìm thấy mảng danhSachTruyen.");
      return;
    }

    const danhSachLoc = danhSachTruyen.filter((item) => {
      const ten = String(item?.ten ?? "").toLowerCase();
      const theLoai = Array.isArray(item?.theLoai) ? item.theLoai.join(" ").toLowerCase() : "";
      return ten.includes(tuKhoa) || theLoai.includes(tuKhoa);
    });

    if (danhSachLoc.length === 0) {
      const thongBao = document.createElement("p");
      thongBao.textContent = "Không tìm thấy truyện.";
      thongBao.style.cssText = "color: #fff; font-size: 22px; text-align: center; padding: 40px; width: 100%;";
      ketQua.appendChild(thongBao);
      return;
    }

    // Tạo Fragment render danh sách truyện tìm thấy tối đa theo cấu hình hệ thống
    const fragment = document.createDocumentFragment();
    danhSachLoc.slice(0, CAU_HINH_HETHONG.ketQuaTimKiemToiDa).forEach((item) => {
      fragment.appendChild(taoTheTruyenTimKiem(item));
    });
    ketQua.appendChild(fragment);
  });
}

// ==================================================
// 3. CÁC HIỆU ỨNG TƯƠNG TÁC GIAO DIỆN (UI EFFECTS)
// ==================================================
function ganNutXemThem() {
  const btnXemThem = document.getElementById("btnXemThem");
  const khungDeCu = document.querySelector(".khungtruyen_decu");
  if (!btnXemThem || !khungDeCu) return;

  let moRong = false;
  btnXemThem.addEventListener("click", function () {
    if (!moRong) {
      khungDeCu.style.maxHeight = khungDeCu.scrollHeight + "px";
      btnXemThem.textContent = "Thu Gọn";
    } else {
      khungDeCu.style.maxHeight = CAU_HINH_TRANG_CHU.chieuCaoThuGonDeCu;
      btnXemThem.textContent = "Xem Thêm";
    }
    moRong = !moRong;
  });
}

function ganHieuUngCuon() {
  const sections = document.querySelectorAll(".hidden");
  if (sections.length === 0) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  });

  sections.forEach((section) => observer.observe(section));
}

function ganNutKhamPha() {
  const btnKhamPha = document.querySelector(".content_background button");
  const mucTheLoai = document.getElementById("theloai");
  if (!btnKhamPha || !mucTheLoai) return;

  btnKhamPha.addEventListener("click", function () {
    mucTheLoai.scrollIntoView({ behavior: "smooth" });
  });
}

function ganChuyenNen() {
  const background = document.getElementById("background");
  const anhNen = CAU_HINH_TRANG_CHU.anhNenSlide;
  if (!background || anhNen.length === 0) return;

  let index = 0;
  setInterval(function () {
    index = (index + 1) % anhNen.length;
    background.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${anhNen[index]}')`;
  }, CAU_HINH_TRANG_CHU.thoiGianChuyenNenMs);
}

// ==================================================
// KHỞI CHẠY KHÔNG GIAN TRANG CHỦ
// ==================================================
document.addEventListener("DOMContentLoaded", function () {
  ganTimKiemTrangChu();
  ganNutXemThem();
  ganHieuUngCuon();
  ganNutKhamPha();
  ganChuyenNen();
});