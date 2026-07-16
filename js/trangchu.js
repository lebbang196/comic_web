//Nút Cuộn Lên Đầu Trang
function ganNutQuayLai() {
  const nutQuayLai = document.querySelector(".quaylai");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      nutQuayLai.style.display = "block";
    } else {
      nutQuayLai.style.display = "none";
    }
  });
  nutQuayLai.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
//Tìm Kiếm Truyện
function ganTimKiem() {
  const search = document.getElementById("inputsearch");
  const khungKetQua = document.getElementById("khungKetQua");
  const ketquatimkiem = document.getElementById("ketquatimkiem");
  const phobien = document.getElementById("phobien");
  const moiramat = document.getElementById("moiramat");
  const sapramat = document.getElementById("sapramat");
  const decu = document.getElementById("decu");
  const theloai = document.getElementById("theloai");
  search.addEventListener("input", function () {
    const tuKhoa = search.value.trim().toLowerCase();
    if (tuKhoa === "") {
      ketquatimkiem.style.display = "none";
      phobien.style.display = "block";
      moiramat.style.display = "block";
      sapramat.style.display = "block";
      decu.style.display = "block";
      theloai.style.display = "block";
      return;
    }
    ketquatimkiem.style.display = "block";
    phobien.style.display = "none";
    moiramat.style.display = "none";
    sapramat.style.display = "none";
    decu.style.display = "none";
    theloai.style.display = "none";
    const ketQua = danhSachTruyen.filter(function (truyen) {
      return (
        truyen.ten.toLowerCase().includes(tuKhoa) ||
        truyen.tacGia.toLowerCase().includes(tuKhoa) ||
        truyen.theLoai.join(" ").toLowerCase().includes(tuKhoa)
      );
    });
    if (ketQua.length === 0) {
      khungKetQua.style.display = "block";
      khungKetQua.textContent = "";

      const thongBao = document.createElement("p");

      thongBao.textContent =
        "🔍 Không tìm thấy truyện phù hợp vui lòng nhập từ khóa khác";

      thongBao.style.color = "white";
      thongBao.style.fontSize = "20px";
      thongBao.style.textAlign = "center";
      thongBao.style.padding = "40px";

      khungKetQua.appendChild(thongBao);
      return;
    }
    hienThiTruyen("khungKetQua", ketQua);
    khungKetQua.style.display = "grid";
  });
}
//Nút Xem Thêm
function ganNutXemThem() {
  const btnXemThem = document.getElementById("btnXemThem");
  const khungDeCu = document.querySelector(".khungtruyen_decu");
  let moRong = false;
  btnXemThem.addEventListener("click", function () {
    if (moRong === false) {
      khungDeCu.style.maxHeight = khungDeCu.scrollHeight + "px";
      btnXemThem.textContent = "Thu Gọn";
      moRong = true;
    } else {
      khungDeCu.style.maxHeight = "920px";
      btnXemThem.textContent = "Xem Thêm";
      moRong = false;
    }
  });
}
//Hiệu Ứng Khi Cuộn Xuống
function ganHieuUngCuon() {
  const sections = document.querySelectorAll(".hidden");
  function hienNoiDung() {
    sections.forEach(function (section) {
      const vitri = section.getBoundingClientRect().top;
      if (vitri < window.innerHeight - 100) {
        section.classList.add("show");
      }
    });
  }
  window.addEventListener("scroll", hienNoiDung);
  hienNoiDung();
}
//Nút Khám Phá
function ganNutKhamPha() {
  const btnKhamPha = document.querySelector(".content_background button");
  const mucTheLoai = document.getElementById("theloai");
  btnKhamPha.addEventListener("click", function () {
    mucTheLoai.scrollIntoView({
      behavior: "smooth",
    });
  });
}
//Hiệu Ứng Chuyển Đổi Nền
function ganChuyenNen() {
  const background = document.getElementById("background");
  const images = ["img/bg1.png", "img/bg2.jpg", "img/bg3.jpg"];
  let index = 0;
  setInterval(function () {
    index++;
    if (index >= images.length) {
      index = 0;
    }
    background.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
     url('${images[index]}')`;
  }, 5000);
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

//Hiển Thị Truyện Thông Qua datachitiet.js
function hienThiTruyen(idKhung, danhSach) {
  const khung = document.getElementById(idKhung);

  khung.textContent = "";

  danhSach.forEach(function (truyen) {
    const khungTruyen = document.createElement("div");
    khungTruyen.className = "khungtruyenrieng";

    const link = document.createElement("a");
    link.href = `trangchitiet.html?id=${truyen.id}`;

    const img = document.createElement("img");
    img.src = truyen.anhBia;
    img.alt = truyen.ten;

    const ten = document.createElement("h3");
    ten.textContent = truyen.ten;

    const theLoai = document.createElement("span");
    theLoai.textContent = truyen.theLoai.join(" • ");

    link.appendChild(img);
    link.appendChild(ten);

    khungTruyen.appendChild(link);
    khungTruyen.appendChild(theLoai);

    khung.appendChild(khungTruyen);
  });
}
function hienThiDuLieu() {
  //Hiển Thị Truyện Cho Truyện Phổ Biến
  const dsPhoBien = danhSachTruyen.filter(function (truyen) {
    return [1, 2, 3, 4, 5, 6, 7, 8, 11, 14].includes(truyen.id);
  });
  hienThiTruyen("dsPhoBien", dsPhoBien);
  //Hiển Thị Truyện Cho Truyện Mới Ra Mắt
  const dsMoiRa = danhSachTruyen.filter(function (truyen) {
    return [9, 11, 12, 13, 14, 15, 16, 10, 17, 19].includes(truyen.id);
  });
  hienThiTruyen("dsMoiRa", dsMoiRa);
  //Hiển Thị Truyện Cho Truyện Sắp Ra Mắt
  const dsSapRa = danhSachTruyen.filter(function (truyen) {
    return truyen.tinhTrang === "Sắp Ra Mắt";
  });
  hienThiTruyen("dsSapRa", dsSapRa);
  //Hiển Thị Truyện Cho Truyện Đề Cử
  const dsDeCu = danhSachTruyen;
  hienThiTruyen("dsDeCu", dsDeCu);
}

document.addEventListener("DOMContentLoaded", function () {
  ganNutQuayLai();
  ganTimKiem();
  ganNutXemThem();
  ganHieuUngCuon();
  ganNutKhamPha();
  ganChuyenNen();
  ganMenu();
  hienThiDuLieu();
});
