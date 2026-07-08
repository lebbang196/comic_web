//Nút Cuộn Lên Đầu Trang
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
//Tìm Kiếm Truyện
const search = document.getElementById("inputsearch");
const khungKetQua = document.getElementById("khungKetQua");
const ketquatimkiem = document.getElementById("ketquatimkiem");
const sapramat = document.getElementById("sapramat");
const decu = document.getElementById("decu");
const phobien = document.getElementById("phobien");
const moiramat = document.getElementById("moiramat");
const theloai = document.getElementById("theloai");
search.addEventListener("input", function () {
  const tukhoa = search.value.toLowerCase().trim();
  khungKetQua.innerHTML = "";
  if (tukhoa === "") {
    ketquatimkiem.style.display = "none";
    theloai.style.display = "block";
    phobien.style.display = "block";
    moiramat.style.display = "block";
    sapramat.style.display = "block";
    decu.style.display = "block";
    return;
  }
  ketquatimkiem.style.display = "block";
  sapramat.style.display = "none";
  decu.style.display = "none";
  theloai.style.display = "none";
  phobien.style.display = "none";
  moiramat.style.display = "none";
  const danhsach = document.querySelectorAll("#decu .khungtruyenrieng");
  const danhsachtimkiem = [];
  danhsach.forEach(function (truyen) {
    const ten = truyen.querySelector("h3").textContent.trim();
    if (ten.toLowerCase().includes(tukhoa) && !danhsachtimkiem.includes(ten)) {
      danhsachtimkiem.push(ten);
      const clone = truyen.cloneNode(true);
      khungKetQua.appendChild(clone);
    }
  });
  if (khungKetQua.children.length === 0) {
    khungKetQua.innerHTML = `
      <p style="
        color:white;
        font-size:20px;
        text-align:center;
        width:100%;
        padding:40px;
      ">
        Không tìm thấy truyện phù hợp
      </p>
    `;
  }
});
//Nút Xem Thêm
const btnXemThem = document.getElementById("btnXemThem");
const khungDeCu = document.querySelector(".khungtruyen_decu");
let moRong = false;
btnXemThem.addEventListener("click", function () {
  if (moRong === false) {
    khungDeCu.style.maxHeight = "5000px";
    btnXemThem.textContent = "Thu Gọn";
    moRong = true;
  } else {
    khungDeCu.style.maxHeight = "950px";
    btnXemThem.textContent = "Xem Thêm";
    moRong = false;
  }
});
//Hiệu Ứng Khi Cuộn Xuống
const cards = document.querySelectorAll(".khungtruyenrieng");
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
//Nút Khám Phá
const btnKhamPha = document.querySelector(".content_background button");
btnKhamPha.addEventListener("click", function () {
  window.scrollTo({
    top: 700,
    behavior: "smooth",
  });
});
//Hiệu Ứng Chuyển Đổi Nền
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
//Nút Menu
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
menuToggle.addEventListener("click", function () {
  menu.classList.toggle("active");
});
