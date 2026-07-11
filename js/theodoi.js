function renderDanhSachTheoDoi() {
  const dsId = layDanhSachTheoDoi(); // luutru.js
  const dsTruyen = danhSachTruyen.filter((t) => dsId.includes(t.id));

  const grid = document.getElementById("tdDanhSach");
  const thongBaoRong = document.getElementById("tdRong");

  if (dsTruyen.length === 0) {
    thongBaoRong.style.display = "block";
    grid.innerHTML = "";
    return;
  }

  thongBaoRong.style.display = "none";

  grid.innerHTML = dsTruyen
    .map(
      (t) => `
    <div class="khungtruyenrieng td-the">
      <button class="td-nut-bo" data-id="${t.id}" title="Bỏ theo dõi">✕</button>
      <a href="trangchitiet.html?id=${t.id}">
        <img src="${t.anhBia}" alt="${t.ten}">
        <h3>${t.ten}</h3>
      </a>
      <span>${t.theLoai.join(" - ")}</span>
    </div>
  `,
    )
    .join("");

  ganNutBoTheoDoi();
}

function ganNutBoTheoDoi() {
  document.querySelectorAll(".td-nut-bo").forEach((nut) => {
    nut.addEventListener("click", () => {
      toggleTheoDoiId(parseInt(nut.dataset.id)); // luutru.js
      renderDanhSachTheoDoi();
    });
  });
}

function ganNutQuayLai() {
  const nut = document.getElementById("quaylai");
  if (!nut) return;
  window.addEventListener("scroll", () => {
    nut.style.display = window.scrollY > 300 ? "block" : "none";
  });
  nut.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function ganMenuToggle() {
  const btn = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  if (!btn || !menu) return;
  btn.addEventListener("click", () => menu.classList.toggle("menu-open"));
}

document.addEventListener("DOMContentLoaded", () => {
  renderDanhSachTheoDoi();
  ganNutQuayLai();
  ganMenuToggle();
});
function layTaiKhoanHienTai() {
  try {
    const chuoi =
      localStorage.getItem("currentUser");

    return chuoi
      ? JSON.parse(chuoi)
      : null;
  } catch (error) {
    return null;
  }
}

function renderDanhSachTheoDoi(
  tuKhoa = "",
) {
  const grid =
    document.getElementById("tdDanhSach");

  const thongBaoRong =
    document.getElementById("tdRong");

  const taiKhoan = layTaiKhoanHienTai();

  // Chưa đăng nhập
  if (!taiKhoan) {
    grid.innerHTML = "";

    thongBaoRong.style.display = "block";

    thongBaoRong.innerHTML = `
      Bạn cần
      <a href="login.html">đăng nhập</a>
      để xem danh sách truyện đang theo dõi.
    `;

    return;
  }

  // Hàm trong luutru.js
  // Tự lấy danh sách của tài khoản hiện tại
  const dsId = layDanhSachTheoDoi().map(Number);

  const tuKhoaThuong =
    tuKhoa.trim().toLowerCase();

  const dsTruyen = danhSachTruyen.filter(
    function (truyen) {
      const daTheoDoi = dsId.includes(
        Number(truyen.id),
      );

      const dungTuKhoa =
        tuKhoaThuong === "" ||
        truyen.ten
          .toLowerCase()
          .includes(tuKhoaThuong) ||
        truyen.tacGia
          .toLowerCase()
          .includes(tuKhoaThuong) ||
        truyen.theLoai
          .join(" ")
          .toLowerCase()
          .includes(tuKhoaThuong);

      return daTheoDoi && dungTuKhoa;
    },
  );

  // Tài khoản chưa theo dõi truyện nào
  if (dsId.length === 0) {
    thongBaoRong.style.display = "block";

    thongBaoRong.textContent =
      'Bạn chưa theo dõi truyện nào. Hãy vào một truyện và bấm nút "🔔 Theo Dõi" nhé!';

    grid.innerHTML = "";

    return;
  }

  thongBaoRong.style.display = "none";

  // Có truyện theo dõi nhưng không khớp từ khóa
  if (dsTruyen.length === 0) {
    grid.innerHTML = `
      <p style="
        color: white;
        text-align: center;
        grid-column: 1 / -1;
        padding: 40px;
      ">
        Không tìm thấy truyện phù hợp.
      </p>
    `;

    return;
  }

  grid.innerHTML = dsTruyen
    .map(
      (truyen) => `
        <div class="khungtruyenrieng td-the">
          <button
            type="button"
            class="td-nut-bo"
            data-id="${truyen.id}"
            title="Bỏ theo dõi"
          >
            ✕
          </button>

          <a href="trangchitiet.html?id=${truyen.id}">
            <img
              src="${truyen.anhBia}"
              alt="${truyen.ten}"
            >

            <h3>${truyen.ten}</h3>
          </a>

          <span>
            ${truyen.theLoai.join(" - ")}
          </span>
        </div>
      `,
    )
    .join("");
}

function ganSuKienDanhSachTheoDoi() {
  const grid =
    document.getElementById("tdDanhSach");

  const inputTimKiem =
    document.getElementById("inputsearch");

  // Sử dụng event delegation nên không cần
  // gắn lại sự kiện sau mỗi lần render
  grid.addEventListener(
    "click",
    function (event) {
      const nut = event.target.closest(
        ".td-nut-bo",
      );

      if (!nut) return;

      const idTruyen = Number(
        nut.dataset.id,
      );

      // Hàm trong luutru.js
      toggleTheoDoiId(idTruyen);

      renderDanhSachTheoDoi(
        inputTimKiem.value,
      );
    },
  );

  inputTimKiem.addEventListener(
    "input",
    function () {
      renderDanhSachTheoDoi(
        inputTimKiem.value,
      );
    },
  );
}

function ganNutQuayLai() {
  const nut =
    document.getElementById("quaylai");

  if (!nut) return;

  window.addEventListener(
    "scroll",
    function () {
      nut.style.display =
        window.scrollY > 300
          ? "block"
          : "none";
    },
  );

  nut.addEventListener(
    "click",
    function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  );
}

function ganMenuToggle() {
  const btn =
    document.querySelector(".menu-toggle");

  const menu =
    document.querySelector(".menu");

  if (!btn || !menu) return;

  btn.addEventListener(
    "click",
    function () {
      menu.classList.toggle("menu-open");
    },
  );
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    renderDanhSachTheoDoi();
    ganSuKienDanhSachTheoDoi();
    ganNutQuayLai();
    ganMenuToggle();
  },
);