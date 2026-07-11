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
