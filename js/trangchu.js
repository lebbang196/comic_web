//Nút Cuộn Lên Đầu Trang
function ganNutQuayLai() {
  const nutQuayLai = document.querySelector(".quaylai");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      //Nếu khoảng cách đã cuộn trên 300
      nutQuayLai.style.display = "block"; //Hiển thị nút quay lại
    } else {
      nutQuayLai.style.display = "none"; //Ẩn nút
    }
  });
  nutQuayLai.addEventListener("click", function () {
    //Khi người dùng nhấn vào nút quay lại
    window.scrollTo({
      top: 0, //Cuộn về vị trí 0px
      behavior: "smooth", // Hiệu ứng mượt
    });
  });
}
//Tìm Kiếm Truyện
function ganTimKiem() {
  const input = document.getElementById("inputsearch"); //Lấy ô tìm kiếm
  const ketQua = document.getElementById("khungKetQua"); //Lấy nơi chứa kết quả
  const khungKetQua = document.getElementById("ketquatimkiem"); //Lấy cả section
  //Danh sách các khung cần ẩn
  const cacMuc = [
    document.getElementById("theloai"),
    document.getElementById("phobien"),
    document.getElementById("moiramat"),
    document.getElementById("sapramat"),
    document.getElementById("decu"),
  ];
  input.addEventListener("input", function () {
    const tukhoa = input.value.trim().toLowerCase();
    ketQua.replaceChildren(); //Xóa kết quả cũ
    //Nếu ko nhập gì thì ẩn khung kết quả
    if (tukhoa === "") {
      khungKetQua.style.display = "none";
      cacMuc.forEach((muc) => (muc.style.display = "block"));
      return;
    }
    //Nếu có nhập thì hiển thị khung kết quả ẩn các khung khác
    khungKetQua.style.display = "block";
    cacMuc.forEach((muc) => (muc.style.display = "none"));
    const tatCaTruyen = document.querySelectorAll(".khungtruyenrieng"); //Lấy toàn bộ truyện
    const daThem = new Set(); //Dùng Set() để tránh tìm truyện bị trùng
    let dem = 0;
    tatCaTruyen.forEach(function (truyen) {
      const ten = truyen.querySelector("h3").textContent.trim(); //Lấy tên truyện
      const theLoai = truyen.querySelector("span").textContent.trim(); //Lấy thể loại
      //Nếu đã thêm rồi thì bỏ qua
      if (daThem.has(ten.toLowerCase())) {
        return;
      }
      //Kiểm tra chứa từ khóa
      if (
        ten.toLowerCase().includes(tukhoa) ||
        theLoai.toLowerCase().includes(tukhoa)
      ) {
        daThem.add(ten.toLowerCase()); //Thêm vào Set()
        //cloneNode(true) dùng để tạo một bản sao hoàn chỉnh của .khungtruyenrieng
        //appendChild() dùng để thêm bản sao này vào #khungKetQua
        ketQua.appendChild(truyen.cloneNode(true));
        dem++;
      }
    });
    //Nếu ko có kết quả thì báo ko tìm thấy truyện
    if (dem === 0) {
      const p = document.createElement("p");
      p.textContent = "Không tìm thấy truyện.";
      p.style.color = "#fff";
      p.style.fontSize = "22px";
      p.style.textAlign = "center";
      p.style.padding = "40px";
      ketQua.appendChild(p);
    }
  });
}
//Nút Xem Thêm
function ganNutXemThem() {
  const btnXemThem = document.getElementById("btnXemThem");
  const khungDeCu = document.querySelector(".khungtruyen_decu");
  let moRong = false;
  btnXemThem.addEventListener("click", function () {
    if (moRong === false) {
      khungDeCu.style.maxHeight = khungDeCu.scrollHeight + "px"; //Mở rộng khung
      btnXemThem.textContent = "Thu Gọn";
      moRong = true;
    } else {
      khungDeCu.style.maxHeight = "950px";
      btnXemThem.textContent = "Xem Thêm";
      moRong = false;
    }
  });
}
//Hiệu Ứng Khi Cuộn Xuống
function ganHieuUngCuon() {
  const sections = document.querySelectorAll(".hidden");
  //IntersectionObserver: theo dõi một phần tử đã xuất hiện trên màn hình hay chưa
  //entries: danh sách những phần tử đang được theo dõi
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show"); //Thêm class show
        observer.unobserve(entry.target); //Sau khi hiện nội dung thì ngừng theo dõi
      }
    });
  });
  //Cho observer theo dõi từng section
  sections.forEach(function (section) {
    observer.observe(section);
  });
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
  const images = ["img/bg1.png", "img/bg2.jpg", "img/bg3.jpg"]; //Tạo danh sách ảnh
  let index = 0;
  //Sau 5s sẽ chạy đoạn code bên trong
  setInterval(function () {
    index++;
    if (index >= images.length) {
      index = 0;
    }

    background.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${images[index]}')`;
  }, 5000);
}

//Nút Menu
function ganMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  //e: Event Object
  menuToggle.addEventListener("click", function (e) {
    //stopPropagation: ngăn sự kiện click lan trên các phần tử cha
    e.stopPropagation();
    menu.classList.toggle("active");
  });
  menu.addEventListener("click", function (e) {
    e.stopPropagation();
  });
  //Khi click bên ngoài thì xóa luôn class active
  document.addEventListener("click", function () {
    menu.classList.remove("active");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  ganNutQuayLai();
  ganTimKiem();
  ganNutXemThem();
  ganHieuUngCuon();
  ganNutKhamPha();
  ganChuyenNen();
  ganMenu();
});
