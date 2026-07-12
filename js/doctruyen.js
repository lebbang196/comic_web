window.onload = function () {
  const navTop = document.querySelector(".div_main.top");
  const navBottom = document.querySelector(".div_main.bottom");
  let lastScroll = 0;
  const btnScrollTop = document.getElementById("btnScrollTop");

  const commentForm = document.getElementById("commentForm");
  const commentInput = document.getElementById("commentInput");
  const commentList = document.getElementById("commentList");

  function layTaiKhoanHienTai() {
    const c = localStorage.getItem("currentUser");
    return c ? JSON.parse(c) : null;
  }

  // Chỉ hiện bình luận CỦA đúng chapter đang đọc (chapterSo === chap.chapter)
  function renderBinhLuanChapter() {
    const tatCa = layBinhLuanTruyen(truyen.id, truyen.binhLuan); // luutru.js
    const cuaChapNay = tatCa.filter((bl) => bl.chapterSo === chap.chapter);

    if (cuaChapNay.length === 0) {
      commentList.innerHTML =
        '<p style="color: #aaa; font-size: 14px; text-align: center;">Chưa có bình luận nào ở chapter này. Hãy là người đầu tiên!</p>';
      return;
    }

    commentList.innerHTML = cuaChapNay
      .map(
        (bl) => `
        <div class="comment-item">
          <span class="comment-time"><strong>${bl.ten}</strong> · ${bl.thoiGian}</span>
          <p class="comment-text">${bl.noiDung}</p>
        </div>
      `,
      )
      .join("");
  }

  // Ẩn/hiện form theo trạng thái đăng nhập
  function apDungDangNhapBinhLuan() {
    const tk = layTaiKhoanHienTai();
    const thongBao = document.getElementById("blThongBaoDangNhap");

    if (tk) {
      thongBao.style.display = "none";
      commentForm.style.display = "flex";
    } else {
      thongBao.style.display = "block";
      commentForm.style.display = "none";

      const linkDN = document.getElementById("blLinkDangNhap");
      linkDN.href = `/login.html?quaylai=${encodeURIComponent(window.location.href)}`;
    }
  }

  if (commentForm && commentInput && commentList) {
    apDungDangNhapBinhLuan();
    renderBinhLuanChapter();

    commentForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const tk = layTaiKhoanHienTai();
      if (!tk) {
        alert("Bạn cần đăng nhập để bình luận!");
        return;
      }

      const text = commentInput.value.trim();
      if (!text) return;

      const now = new Date();
      const timeString =
        now.toLocaleDateString("vi-VN") +
        " " +
        now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

      themBinhLuan(truyen.id, {
        ten: tk.fullname,
        kyTuDau: tk.fullname.charAt(0).toUpperCase(),
        sao: 0,
        thoiGian: timeString,
        noiDung: text,
        chapterSo: chap.chapter, // đánh dấu bình luận thuộc chapter đang đọc
      });

      commentInput.value = "";
      renderBinhLuanChapter();
    });
  }

  btnScrollTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("scroll", function () {
    const currentScroll = window.scrollY;
    const bottomTop = navBottom.offsetTop;

    if (window.scrollY > 300) {
      btnScrollTop.style.display = "flex";
    } else {
      btnScrollTop.style.display = "none";
    }

    if (currentScroll <= 100) {
      navTop.classList.remove("fixed-top");
      navTop.classList.remove("fixed-bottom");
      lastScroll = currentScroll;
      return;
    }

    if (currentScroll + window.innerHeight >= bottomTop) {
      navTop.classList.remove("fixed-top");
      navTop.classList.remove("fixed-bottom");
      lastScroll = currentScroll;
      return;
    }

    if (currentScroll > lastScroll) {
      navTop.classList.remove("fixed-top");
      navTop.classList.add("fixed-bottom");

      document
        .querySelectorAll(".check__line")
        .forEach((btn) => btn.classList.add("open-up"));
    } else {
      navTop.classList.remove("fixed-bottom");
      navTop.classList.add("fixed-top");

      document
        .querySelectorAll(".check__line")
        .forEach((btn) => btn.classList.remove("open-up"));
    }
    lastScroll = currentScroll;
  });
};
document.querySelectorAll(".check__line").forEach((btn) => {
  const menu = btn.querySelector(".chapter-list");

  if (!menu) return;

  let timer;

  btn.addEventListener("mouseenter", () => {
    clearTimeout(timer);
    menu.classList.add("show");

    requestAnimationFrame(() => {
      const rect = menu.getBoundingClientRect();

      // Nếu mở lên bị đụng mép trên
      if (rect.top < 10) {
        btn.classList.remove("open-up");
      }
      // Nếu mở xuống bị đụng mép dưới
      else if (rect.bottom > window.innerHeight - 10) {
        btn.classList.add("open-up");
      }
    });
  });

  btn.addEventListener("mouseleave", () => {
    timer = setTimeout(() => {
      if (!btn.classList.contains("active")) {
        menu.classList.remove("show");
      }
    }, 1000);
  });

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    btn.classList.toggle("active");

    if (btn.classList.contains("active")) {
      menu.classList.add("show");
    } else {
      menu.classList.remove("show");
    }
  });
});

document.addEventListener("click", () => {
  document.querySelectorAll(".check__line").forEach((btn) => {
    btn.classList.remove("active");

    const menu = btn.querySelector(".chapter-list");
    if (menu) {
      menu.classList.remove("show");
    }
  });
});

// Lấy tham số URL
const params = new URLSearchParams(window.location.search);

const id = Number(params.get("id"));
const chapter = Number(params.get("chapter")) || 1;

const menus = document.querySelectorAll(".menus");

menus.forEach((menu) => {
  menu.href = `/trangchitiet.html?id=${id}`;
});
// Tìm chapter
const chap = chapters.find(
  (item) => item.id === id && item.chapter === chapter,
);

const truyen = danhSachTruyen.find((item) => item.id === id);
if (!truyen) {
  throw new Error("Không tìm thấy truyện");
}

// YÊU THÍCH - DÙNG CHUNG THEO DÕI THEO TÀI KHOẢN
const loveBtns = document.querySelectorAll(".love");

function updateLoveButton() {
  // Hàm trong luutru.js
  const isLoved = kiemTraDaTheoDoi(truyen.id);

  loveBtns.forEach((btn) => {
    if (isLoved) {
      btn.innerHTML = `
        <i class="fa-solid fa-heart"></i>
        Đã thích
      `;

      btn.classList.add("is-loved");
    } else {
      btn.innerHTML = `
        <i class="fa-regular fa-heart"></i>
        Yêu thích
      `;

      btn.classList.remove("is-loved");
    }
  });
}

loveBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Hàm trong luutru.js:
    // - Chưa đăng nhập: thông báo yêu cầu đăng nhập
    // - Đã đăng nhập: thêm hoặc xóa truyện
    toggleTheoDoiId(truyen.id);

    // Cập nhật cả hai nút yêu thích
    updateLoveButton();
  });
});

// Hiển thị đúng trạng thái khi mở trang
updateLoveButton();

if (!chap) {
  document.getElementById("reader").innerHTML =
    "<h2>Không tìm thấy chapter!</h2>";
  throw new Error("Không tìm thấy chapter");
}
//xem tiến độ đọc tiếp
luuTienDoDoc(truyen.id, chap.chapter);
// Hiện tên
document.querySelectorAll(".chapter-name").forEach((el) => {
  el.textContent = `Chapter ${chap.chapter}`;
});

// Hiện ảnh
const reader = document.getElementById("reader");
reader.innerHTML = "";

const html = chap.images
  .map(
    (img) => `
    <img src="${img}" alt="">
`,
  )
  .join("");

reader.innerHTML = html;

// Danh sách chapter
document.querySelectorAll(".chapter-list").forEach((list) => {
  list.innerHTML = "";

  chapters
    .filter((item) => item.id === id)
    .forEach((item) => {
      list.innerHTML += `
                <a
                    href="doctruyen.html?id=${id}&chapter=${item.chapter}"
                    class="${item.chapter === chapter ? "active" : ""}">
                    Chapter ${item.chapter}
                </a>
            `;
    });
});

//Hiển Thị Truyện
function hienThiTruyen(idKhung, danhSach) {
  const khung = document.getElementById(idKhung);
  khung.innerHTML = "";

  danhSach.forEach(function (t) {
    khung.innerHTML += `
      <div class="khungtruyenrieng">
        <a href="trangchitiet.html?id=${t.id}">
          <img src="${t.anhBia}" alt="${t.ten}">
          <h3>${t.ten}</h3>
        </a>
        <span>${t.theLoai.join(" • ")}</span>
      </div>
    `;
  });
}
//Tìm Kiếm Truyện
function ganTimKiem() {
  const search = document.getElementById("inputsearch");
  const khungKetQua = document.getElementById("khungKetQua");
  const ketquatimkiem = document.getElementById("ketquatimkiem");
  const main = document.querySelector("main");
  search.addEventListener("input", function () {
    const tuKhoa = search.value.trim().toLowerCase();
    if (tuKhoa === "") {
      ketquatimkiem.style.display = "none";
      main.style.display = "block";
      return;
    }
    ketquatimkiem.style.display = "block";
    main.style.display = "none";
    const ketQua = danhSachTruyen.filter(function (t) {
      return (
        t.ten.toLowerCase().includes(tuKhoa) ||
        t.tacGia.toLowerCase().includes(tuKhoa) ||
        t.theLoai.join(" ").toLowerCase().includes(tuKhoa)
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
document.addEventListener("DOMContentLoaded", function () {
  ganTimKiem();
  ganMenu();
});
