function layThamSoURL(tenThamSo) {
  const cap = window.location.search
    .substring(1)
    .split("&")
    .find((item) => item.startsWith(`${tenThamSo}=`));
  return cap ? decodeURIComponent(cap.split("=")[1]) : null;
}

// 🔐 [BẮT ĐẦU VÙNG TÀI KHOẢN - ĐỌC LOCALSTORAGE AN TOÀN]
// Chú thích: Hàm bọc try-catch giúp ứng dụng không bị crash nếu dữ liệu JSON của User trong LocalStorage bị hỏng.
function safeParseJSON(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Lỗi parse dữ liệu ${key}:`, e);
    return fallback;
  }
}
// 🔐 [KẾT THÚC VÙNG TÀI KHOẢN - ĐỌC LOCALSTORAGE AN TOÀN]

// --- 2. KIỂM TRA TRUYỆN & XỬ LÝ LỖI 404 ---
const idThamSo = layThamSoURL("id");
const idTruyen = idThamSo && idThamSo.trim() !== "" ? Number(idThamSo) : NaN;
const idHopLe = !isNaN(idTruyen) && Number.isInteger(idTruyen) && idTruyen > 0;
const truyen =
  idHopLe && typeof layTruyenTheoId === "function"
    ? layTruyenTheoId(idTruyen)
    : null;

if (!truyen) {
  document.addEventListener("DOMContentLoaded", () => {
    const containerChinh = document.getElementById("container-truyen");
    const khungLoi = document.getElementById("khung-loi");
    const lblNoiDungLoi = document.getElementById("lblNoiDungLoi");

    if (containerChinh) containerChinh.classList.add("error-hidden");
    if (khungLoi) {
      khungLoi.classList.remove("error-hidden");
      if (lblNoiDungLoi)
        lblNoiDungLoi.textContent =
          "Không tìm thấy truyện hoặc ID không hợp lệ trong hệ thống!";
    }
  });
  throw new Error("LỖI 404: Không tìm thấy truyện.");
}

// --- 3. KHỞI TẠO BIẾN TOÀN CỤC ---

// 🔐 [BẮT ĐẦU VÙNG TÀI KHOẢN - KHỞI TẠO THÔNG TIN USER]
// Chú thích: Lấy thông tin tài khoản đang đăng nhập từ LocalStorage để xử lý quyền hạn trên trang.
let currentUser = safeParseJSON("currentUser", null);
// 🔐 [KẾT THÚC VÙNG TÀI KHOẢN - KHỞI TẠO THÔNG TIN USER]

let thuTuChapter = "desc";
let chapterMoRong = false;
let saoDangChon = 0;

// --- 4. ĐIỀU CHỈNH MENU THEO TRẠNG THÁI ĐĂNG NHẬP ---

// 🔐 [BẮT ĐẦU VÙNG TÀI KHOẢN - THIẾT LẬP MENU ĐĂNG NHẬP/ĐĂNG XUẤT]
// Chú thích: Ẩn/Hiện khu vực "Đăng nhập/Đăng ký" hoặc hiển thị Tên tài khoản của người dùng trên thanh Header.
function thietLapMenu() {
  const khuChuaDangNhap = document.getElementById("khuChuaDangNhap");
  const khuDaDangNhap = document.getElementById("khuDaDangNhap");
  const tenTaiKhoan = document.getElementById("tenTaiKhoan");

  if (currentUser) {
    if (khuChuaDangNhap) khuChuaDangNhap.classList.add("tai-khoan-an");
    if (khuDaDangNhap) {
      khuDaDangNhap.classList.remove("tai-khoan-an");
      if (tenTaiKhoan) {
        // Thứ tự ưu tiên hiển thị tên: Họ tên đầy đủ -> Email tài khoản -> Tên mặc định "Độc giả"
        tenTaiKhoan.textContent =
          currentUser.fullname || currentUser.email || "Độc giả";
      }
    }
  } else {
    if (khuChuaDangNhap) khuChuaDangNhap.classList.remove("tai-khoan-an");
    if (khuDaDangNhap) khuDaDangNhap.classList.add("tai-khoan-an");
  }
}
// 🔐 [KẾT THÚC VÙNG TÀI KHOẢN - THIẾT LẬP MENU ĐĂNG NHẬP/ĐĂNG XUẤT]

// --- 5. HIỂN THỊ CHI TIẾT THÔNG TIN TRUYỆN ---
function hienThiChiTietTruyen() {
  document.title = `${truyen.ten} - Comic Web`;
  const brTenTruyen = document.getElementById("breadcrumbTenTruyen");
  const lblTenTruyen = document.getElementById("lblTenTruyen");
  if (brTenTruyen) brTenTruyen.textContent = truyen.ten;
  if (lblTenTruyen) lblTenTruyen.textContent = truyen.ten;

  const imgAnhBia = document.getElementById("imgAnhBia");
  if (imgAnhBia) {
    imgAnhBia.src = truyen.anhBia;
    imgAnhBia.alt = truyen.ten;
  }

  const boxTenKhac = document.getElementById("boxTenKhac");
  const lblTenKhac = document.getElementById("lblTenKhac");
  if (
    truyen.tenKhac &&
    Array.isArray(truyen.tenKhac) &&
    truyen.tenKhac.length > 0
  ) {
    if (boxTenKhac) boxTenKhac.classList.remove("alias-hidden");
    if (lblTenKhac) lblTenKhac.textContent = truyen.tenKhac.join(", ");
  } else if (boxTenKhac) {
    boxTenKhac.classList.add("alias-hidden");
  }

  const lblTacGia = document.getElementById("lblTacGia");
  if (lblTacGia) lblTacGia.textContent = truyen.tacGia || "Đang cập nhật";

  // Xử lý 3 Trạng thái truyện: Hoàn thành, Sắp ra mắt, Đang ra
  const lblTrangThai = document.getElementById("lblTrangThai");
  if (lblTrangThai) {
    const tinhTrang = truyen.tinhTrang || "Đang cập nhật";
    lblTrangThai.textContent = tinhTrang;

    let classTrangThai = "dang-ra";
    if (/hoàn thành/i.test(tinhTrang)) {
      classTrangThai = "hoan-thanh";
    } else if (/sắp ra mắt/i.test(tinhTrang)) {
      classTrangThai = "sap-ra-mat";
    }
    lblTrangThai.className = `tinh-trang-badge ${classTrangThai}`;
  }

  // Đánh giá sao trung bình
  const lblDiemTb = document.getElementById("lblDiemTb");
  const dungTichSao = document.getElementById("dungTichSao");
  const diemSo = Number(truyen.diemDanhGia) || 0.0;
  if (lblDiemTb) lblDiemTb.textContent = diemSo.toFixed(1);
  if (dungTichSao) {
    const lamTronSao = Math.round(diemSo);
    dungTichSao.textContent =
      "★".repeat(lamTronSao) + "☆".repeat(5 - lamTronSao);
  }

  const lblLuotXem = document.getElementById("lblLuotXem");
  if (lblLuotXem) lblLuotXem.textContent = truyen.luotXem || "0";

  // 🔐 [BẮT ĐẦU VÙNG TÀI KHOẢN - THỐNG KÊ LƯỢT THEO DÕI CỦA USER]
  // Chú thích: Đọc danh sách ID truyện theo dõi của user từ LocalStorage. Nếu user hiện tại đang theo dõi, hiển thị tăng thêm 1 lượt.
  const lblLuotTheoDoi = document.getElementById("lblLuotTheoDoi");
  let dsTheoDoi = safeParseJSON("danhSachTheoDoi", []);
  let dangTheoDoi = dsTheoDoi.includes(idTruyen);
  let soTheoDoiGoc =
    parseInt(String(truyen.luotTheo || "0").replace(/,/g, ""), 10) || 0;

  if (lblLuotTheoDoi) {
    lblLuotTheoDoi.textContent = (
      dangTheoDoi ? soTheoDoiGoc + 1 : soTheoDoiGoc
    ).toLocaleString("vi-VN");
  }
  // 🔐 [KẾT THÚC VÙNG TÀI KHOẢN - THỐNG KÊ LƯỢT THEO DÕI CỦA USER]

  // Khúc mô tả rút gọn / mở rộng
  const lblSynopsis = document.getElementById("lblSynopsis");
  const btnDocThemSynopsis = document.getElementById("btnDocThemSynopsis");
  const noiDungMoTa =
    truyen.moTa && truyen.moTa.trim() !== ""
      ? truyen.moTa
      : "Không có tóm tắt cho truyện này.";

  if (lblSynopsis) {
    lblSynopsis.textContent = noiDungMoTa;
    lblSynopsis.classList.add("synopsis-hidden");
  }

  if (btnDocThemSynopsis && lblSynopsis) {
    setTimeout(() => {
      const chieuCaoThuGon = lblSynopsis.clientHeight;
      lblSynopsis.classList.remove("synopsis-hidden");
      const chieuCaoThucTe = lblSynopsis.scrollHeight;
      lblSynopsis.classList.add("synopsis-hidden");

      if (chieuCaoThucTe > chieuCaoThuGon) {
        btnDocThemSynopsis.style.display = "inline-block";
        btnDocThemSynopsis.onclick = () => {
          const expanded = lblSynopsis.classList.toggle("synopsis-hidden");
          btnDocThemSynopsis.textContent = !expanded ? "Thu gọn" : "Đọc thêm";
        };
      } else {
        btnDocThemSynopsis.style.display = "none";
        lblSynopsis.classList.remove("synopsis-hidden");
      }
    }, 50);
  }

  // Hiển thị danh sách thẻ thể loại dưới dạng liên kết
  const boxTheLoai = document.getElementById("boxTheLoai");
  if (boxTheLoai) {
    boxTheLoai.textContent = "";
    if (truyen.theLoai && Array.isArray(truyen.theLoai)) {
      truyen.theLoai.forEach((tl) => {
        const tag = document.createElement("a");
        tag.className = "tag";
        tag.href = `theloai.html?theloai=${encodeURIComponent(tl)}`;
        tag.textContent = tl;
        boxTheLoai.appendChild(tag);
      });
    }
  }

  // 🔐 [BẮT ĐẦU VÙNG TÀI KHOẢN - TƯƠNG TÁC THEO DÕI TRUYỆN]
  // Chú thích: Thêm hoặc xóa ID truyện khỏi danh sách yêu thích của Tài khoản người dùng trong LocalStorage.
  const btnTheoDoi = document.getElementById("btnTheoDoi");
  if (btnTheoDoi) {
    const capNhatNutTheoDoi = (status) => {
      btnTheoDoi.innerHTML = status
        ? '<i class="bi bi-heart-break-fill"></i> Bỏ theo dõi'
        : '<i class="bi bi-heart"></i> Theo dõi';
      btnTheoDoi.classList.toggle("dang-theo-doi", status);
    };

    capNhatNutTheoDoi(dangTheoDoi);

    btnTheoDoi.addEventListener("click", () => {
      dsTheoDoi = safeParseJSON("danhSachTheoDoi", []);
      dangTheoDoi = dsTheoDoi.includes(idTruyen);

      if (dangTheoDoi) {
        dsTheoDoi = dsTheoDoi.filter((id) => id !== idTruyen);
        capNhatNutTheoDoi(false);
        if (lblLuotTheoDoi)
          lblLuotTheoDoi.textContent = soTheoDoiGoc.toLocaleString("vi-VN");
      } else {
        dsTheoDoi.push(idTruyen);
        capNhatNutTheoDoi(true);
        if (lblLuotTheoDoi)
          lblLuotTheoDoi.textContent = (soTheoDoiGoc + 1).toLocaleString(
            "vi-VN",
          );
      }
      localStorage.setItem("danhSachTheoDoi", JSON.stringify(dsTheoDoi));
    });
  }
  // 🔐 [KẾT THÚC VÙNG TÀI KHOẢN - TƯƠNG TÁC THEO DÕI TRUYỆN]
}

// --- 6. XỬ LÝ HIỂN THỊ CHƯƠNG TRUYỆN ---
function renderDanhSachChapter() {
  const listEl = document.getElementById("danhSachChapter");
  const btnXemThem = document.getElementById("btnXemThemChapter");
  const chapterDem = document.getElementById("chapterDem");
  if (!listEl) return;

  listEl.textContent = "";

  const mangChapter = Array.isArray(truyen.danhSachChapter)
    ? [...truyen.danhSachChapter]
    : [];
  if (chapterDem) chapterDem.textContent = `(${mangChapter.length})`;

  mangChapter.sort((a, b) =>
    thuTuChapter === "desc" ? b.so - a.so : a.so - b.so,
  );

  if (mangChapter.length > 0) {
    const mangGocTangDan = [...mangChapter].sort((a, b) => a.so - b.so);
    const btnDocTuDau = document.getElementById("btnDocTuDau");
    const btnDocMoiNhat = document.getElementById("btnDocMoiNhat");
    if (btnDocTuDau)
      btnDocTuDau.href = `doctruyen.html?id=${idTruyen}&chapter=${mangGocTangDan[0].so}`;
    if (btnDocMoiNhat)
      btnDocMoiNhat.href = `doctruyen.html?id=${idTruyen}&chapter=${mangGocTangDan[mangGocTangDan.length - 1].so}`;
  }

  const soLuongHienThi = chapterMoRong ? mangChapter.length : 5;

  for (let i = 0; i < Math.min(mangChapter.length, soLuongHienThi); i++) {
    const chap = mangChapter[i];
    const link = document.createElement("a");
    link.className = "chapter-item";
    link.href = `doctruyen.html?id=${idTruyen}&chapter=${chap.so}`;

    const spanSo = document.createElement("span");
    spanSo.className = "chapter-so";
    spanSo.textContent = `Chương ${chap.so}`;

    if (chap.isMoi) {
      const badgeMoi = document.createElement("span");
      badgeMoi.className = "chapter-moi-badge";
      badgeMoi.textContent = "NEW";
      spanSo.appendChild(badgeMoi);
    }

    const spanNgay = document.createElement("span");
    spanNgay.className = "chapter-ngay";
    spanNgay.textContent = chap.ngay || "Vừa xong";

    link.appendChild(spanSo);
    link.appendChild(spanNgay);
    listEl.appendChild(link);
  }

  if (btnXemThem) {
    btnXemThem.style.display =
      mangChapter.length <= 5 ? "none" : "inline-block";
    btnXemThem.textContent = chapterMoRong
      ? "Thu gọn danh sách"
      : "Xem thêm chương";
  }
}

function thietLapTuongTacChapter() {
  const btnDaoNguoc = document.getElementById("btnDaoNguoc");
  const btnXemThem = document.getElementById("btnXemThemChapter");
  if (btnDaoNguoc) {
    btnDaoNguoc.addEventListener("click", () => {
      thuTuChapter = thuTuChapter === "desc" ? "asc" : "desc";
      btnDaoNguoc.setAttribute("data-order", thuTuChapter);

      const textNode = btnDaoNguoc.querySelector(".sort-text");
      if (textNode) {
        textNode.textContent =
          thuTuChapter === "desc" ? " Mới nhất trước" : " Cũ nhất trước";
      }
      renderDanhSachChapter();
    });
  }

  if (btnXemThem) {
    btnXemThem.addEventListener("click", () => {
      chapterMoRong = !chapterMoRong;
      renderDanhSachChapter();
    });
  }
}

// --- 7. ĐÁNH GIÁ SAO VÀ BÌNH LUẬN ---
function thietLapDanhGiaSao() {
  const stars = document.querySelectorAll("#starsGroup .star-pick");
  const lblDiem = document.getElementById("lblDiemDanhGia");

  stars.forEach((star) => {
    star.addEventListener("click", function () {
      saoDangChon = Number(this.getAttribute("data-value")) || 0;
      stars.forEach((s) => {
        const val = Number(s.getAttribute("data-value"));
        s.classList.toggle("active", val <= saoDangChon);
      });
      if (lblDiem) lblDiem.textContent = `${saoDangChon}/5`;
    });
  });
}

function layKhoBinhLuan() {
  return safeParseJSON("app_comments", {})[idTruyen] || [];
}

function luuBinhLuanCuaTruyen(dsBinhLuan) {
  const toanBoBinhLuan = safeParseJSON("app_comments", {});
  toanBoBinhLuan[idTruyen] = dsBinhLuan.slice(-40); // Giữ tối đa 40 bình luận mới nhất
  localStorage.setItem("app_comments", JSON.stringify(toanBoBinhLuan));
}

// 🔐 [BẮT ĐẦU VÙNG TÀI KHOẢN - HIỂN THỊ THÔNG TIN USER TRONG BÌNH LUẬN]
// Chú thích: Đọc và hiển thị tên người dùng (fullname/email) của từng tài khoản tương ứng với mỗi bình luận.
function renderDanhSachBinhLuan() {
  const khuBinhLuan = document.getElementById("khuBinhLuan");
  if (!khuBinhLuan) return;

  khuBinhLuan.textContent = "";
  const dsSapXep = [...layKhoBinhLuan()].reverse();

  if (dsSapXep.length === 0) {
    const emptyP = document.createElement("p");
    emptyP.className = "empty-comment-text";
    emptyP.textContent =
      "Chưa có bình luận nào. Hãy là người đầu tiên bình luận và đánh giá!";
    khuBinhLuan.appendChild(emptyP);
    return;
  }

  dsSapXep.forEach((bl) => {
    const card = document.createElement("div");
    card.className = "binh-luan-item";

    const avatar = document.createElement("div");
    avatar.className = "bl-avatar";
    // 🔐 LẤY TÊN USER ĐỂ TẠO AVATAR CHỮ CÁI ĐẦU
    const tenHienThi = bl.fullname || bl.email || "Độc giả";
    avatar.textContent = tenHienThi.trim().charAt(0).toUpperCase();

    const body = document.createElement("div");
    body.className = "bl-noidung";

    const meta = document.createElement("div");
    meta.className = "bl-meta";

    const name = document.createElement("strong");
    name.textContent = tenHienThi;
    meta.appendChild(name);

    if (bl.saoDanhGia > 0) {
      const starsSpan = document.createElement("span");
      starsSpan.className = "bl-stars";
      starsSpan.textContent =
        "★".repeat(bl.saoDanhGia) + "☆".repeat(5 - bl.saoDanhGia);
      meta.appendChild(starsSpan);
    }

    const time = document.createElement("span");
    time.className = "bl-time";
    time.textContent = bl.ngayDang || "Gần đây";
    meta.appendChild(time);

    const content = document.createElement("p");
    content.textContent = bl.noiDung;

    body.appendChild(meta);
    body.appendChild(content);
    card.appendChild(avatar);
    card.appendChild(body);
    khuBinhLuan.appendChild(card);
  });
}
// 🔐 [KẾT THÚC VÙNG TÀI KHOẢN - HIỂN THỊ THÔNG TIN USER TRONG BÌNH LUẬN]

// 🔐 [BẮT ĐẦU VÙNG TÀI KHOẢN - KIỂM TRA QUYỀN ĐĂNG BÌNH LUẬN]
// Chú thích: Chặn người dùng chưa đăng nhập gửi bình luận, lưu thông tin tài khoản viết bình luận vào Database giả lập (LocalStorage).
function thietLapFormBinhLuan() {
  const formBinhLuan = document.getElementById("formBinhLuan");
  const txtBinhLuan = document.getElementById("txtBinhLuan");
  const thongBaoDangNhapBL = document.getElementById("thongBaoDangNhapBL");

  if (!formBinhLuan) return;

  formBinhLuan.addEventListener("submit", function (e) {
    e.preventDefault();

    // CHẶN BÌNH LUẬN NẾU CHƯA ĐĂNG NHẬP
    if (!currentUser) {
      alert("Vui lòng đăng nhập để thực hiện chức năng này!");
      return;
    }

    const noiDung = txtBinhLuan ? txtBinhLuan.value.trim() : "";
    if (noiDung.length < 1 || noiDung.length > 500) {
      alert("Nội dung bình luận phải từ 1 đến 500 ký tự!");
      return;
    }

    const dsMoi = layKhoBinhLuan();

    // ĐÍNH KÈM THÔNG TIN TÀI KHOẢN ĐANG ĐĂNG NHẬP VÀO BÌNH LUẬN MỚI
    dsMoi.push({
      id: Date.now(),
      fullname: currentUser.fullname || null,
      email: currentUser.email || "Ẩn danh",
      noiDung: noiDung,
      ngayDang: new Date().toLocaleString("vi-VN"),
      saoDanhGia: saoDangChon,
    });

    luuBinhLuanCuaTruyen(dsMoi);

    if (txtBinhLuan) txtBinhLuan.value = "";
    saoDangChon = 0;
    document
      .querySelectorAll("#starsGroup .star-pick")
      .forEach((s) => s.classList.remove("active"));
    const lblDiem = document.getElementById("lblDiemDanhGia");
    if (lblDiem) lblDiem.textContent = "0/5";

    renderDanhSachBinhLuan();
  });

  // ẨN FORM BÌNH LUẬN VÀ HIỂN THỊ THÔNG BÁO YÊU CẦU ĐĂNG NHẬP NẾU CHƯA CÓ USER
  const loggedIn = !!currentUser;
  formBinhLuan.classList.toggle("bl-login-hidden", !loggedIn);
  if (thongBaoDangNhapBL) {
    thongBaoDangNhapBL.classList.toggle("bl-login-hidden", loggedIn);
  }
}
// 🔐 [KẾT THÚC VÙNG TÀI KHOẢN - KIỂM TRA QUYỀN ĐĂNG BÌNH LUẬN]

// --- 8. RENDER TRUYỆN LIÊN QUAN ---
function renderTruyenLQuan() {
  const khuTruyenLQuan = document.getElementById("khuTruyenLQuan");
  if (!khuTruyenLQuan) return;

  khuTruyenLQuan.textContent = "";

  const dsLoc =
    typeof layTruyenLienQuan === "function"
      ? layTruyenLienQuan(idTruyen, 4)
      : typeof danhSachTruyen !== "undefined"
        ? danhSachTruyen.filter((t) => t.id !== idTruyen).slice(0, 4)
        : [];

  dsLoc.forEach((t) => {
    const card = document.createElement("a");
    card.className = "lien-quan-card";
    card.href = `trangchitiet.html?id=${t.id}`;

    const img = document.createElement("img");
    img.src = t.anhBia;
    img.alt = t.ten;

    const info = document.createElement("div");
    info.className = "lien-quan-info";

    const ten = document.createElement("div");
    ten.className = "lien-quan-ten";
    ten.textContent = t.ten;

    const tacGia = document.createElement("div");
    tacGia.className = "lien-quan-tacgia";
    tacGia.textContent = t.tacGia || "Đang cập nhật";

    info.appendChild(ten);
    info.appendChild(tacGia);
    card.appendChild(img);
    card.appendChild(info);
    khuTruyenLQuan.appendChild(card);
  });
}

// --- 9. NÚT QUAY LẠI ĐẦU TRANG---
const btnQuayLai = document.getElementById("quaylai");
if (btnQuayLai) {
  window.addEventListener("scroll", () => {
    btnQuayLai.style.display = window.scrollY > 300 ? "block" : "none";
  });

  btnQuayLai.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// --- 10. KHỞI CHẠY TRANG KHI SẴN SÀNG ---
document.addEventListener("DOMContentLoaded", () => {
  thietLapMenu();
  hienThiChiTietTruyen();
  renderDanhSachChapter();
  thietLapTuongTacChapter();
  thietLapDanhGiaSao();
  renderDanhSachBinhLuan();
  thietLapFormBinhLuan();
  renderTruyenLQuan();
});
