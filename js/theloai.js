document.addEventListener("DOMContentLoaded", function () {
  // Lấy tham số thể loại từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const theloai = urlParams.get("theloai");

  const khung = document.getElementById("khungTruyenTheoLoai");
  const title = document.getElementById("theloai-title");
  const emptyMsg = document.getElementById("empty-message");

  // Kiểm tra nếu không có tham số theloai -> hiển thị tất cả
  let danhSachHienThi = [];
  let tieuDe = "📚 Tất cả thể loại";

  if (theloai) {
    // Lọc truyện theo thể loại (không phân biệt hoa thường)
    danhSachHienThi = danhSachTruyen.filter(truyen =>
      truyen.theLoai.some(tl => tl.toLowerCase() === theloai.toLowerCase())
    );
    tieuDe = `📚 Thể loại: ${theloai}`;
  } else {
    danhSachHienThi = danhSachTruyen;
  }

  title.textContent = tieuDe;

  // Nếu không có truyện, hiển thị thông báo
  if (danhSachHienThi.length === 0) {
    khung.innerHTML = "";
    emptyMsg.style.display = "block";
    return;
  } else {
    emptyMsg.style.display = "none";
  }

  // Render danh sách truyện (giống giao diện index)
  khung.innerHTML = danhSachHienThi.map(truyen => `
    <div class="khungtruyenrieng">
      <a href="/trangchitiet/trangchitiet.html?id=${truyen.id}">
        <img src="${truyen.anhBia}" alt="${truyen.ten}" />
        <h3>${truyen.ten}</h3>
      </a>
      <span>${truyen.theLoai.join(" - ")}</span>
    </div>
  `).join("");
});