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
const search = document.getElementById("inputsearch");

search.addEventListener("keyup", function () {
  let tukhoa = search.value.toLowerCase();

  let danhsach = document.querySelectorAll(".khungtruyenrieng");

  danhsach.forEach(function (truyen) {
    let tentruyen = truyen.querySelector("h3").textContent.toLowerCase();

    if (tentruyen.includes(tukhoa)) {
      truyen.style.display = "block";
    } else {
      truyen.style.display = "none";
    }
  });
});
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
const cards = document.querySelectorAll(".khungtruyenrieng");

cards.forEach(function (card) {
  card.addEventListener("click", function () {
    alert("Bạn đã chọn truyện này");
  });
});
const sections = document.querySelectorAll(".hidden");

window.addEventListener("scroll", function () {
  sections.forEach(function (section) {
    const vitri = section.getBoundingClientRect().top;

    if (vitri < window.innerHeight - 100) {
      section.classList.add("show");
    }
  });
});
const btnKhamPha = document.querySelector(".content_background button");

btnKhamPha.addEventListener("click", function () {
  window.scrollTo({
    top: 700,
    behavior: "smooth",
  });
});
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
