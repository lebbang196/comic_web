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

  const daThem = [];

  danhsach.forEach(function (truyen) {
    const ten = truyen.querySelector("h3").textContent.trim();

    if (ten.toLowerCase().includes(tukhoa) && !daThem.includes(ten)) {
      daThem.push(ten);

      const clone = truyen.cloneNode(true);

      khungKetQua.appendChild(clone);
    }
  });

  // ĐẶT Ở ĐÂY
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
