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
      khungKetQua.innerHTML = `
      <p style="
        color:white;
        font-size:20px;
        text-align:center;
        padding:40px;
        ">
        🔍 Không tìm thấy truyện phù hợp vui lòng nhập từ khóa khác
      </p>
    `;
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
      khungDeCu.style.maxHeight = "5000px";
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
  btnKhamPha.addEventListener("click", function () {
    window.scrollTo({
      top: 700,
      behavior: "smooth",
    });
  });
}
//Hiệu Ứng Chuyển Đổi Nền
function ganChuyenNen() {
  const background = document.getElementById("background");
  const images = ["img/bg1.png", "img/bg2.jpg", "img/bg3.jpg"];
  let index = 0;
  setInterval(() => {
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
  menuToggle.addEventListener("click", function () {
    menu.classList.toggle("active");
  });
}
//Hiển Thị Truyện Thông Qua datachitiet.js
function hienThiTruyen(idKhung, danhSach) {
  const khung = document.getElementById(idKhung);
  khung.innerHTML = "";
  danhSach.forEach(function (truyen) {
    khung.innerHTML += `
      <div class="khungtruyenrieng">
        <a href="trangchitiet.html?id=${truyen.id}">
          <img src="${truyen.anhBia}" alt="${truyen.ten}">
          <h3>${truyen.ten}</h3>
        </a>
        <span>${truyen.theLoai.join(" • ")}</span>
      </div>
    `;
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
