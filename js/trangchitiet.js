function layThamSoURL(tenThamSo) {
  const cap = window.location.search
    .substring(1)
    .split("&")
    .find((item) => item.startsWith(`${tenThamSo}=`));
  return cap ? decodeURIComponent(cap.split("=")[1]) : null;
}

function safeParseJSON(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Lỗi parse dữ liệu ${key}:`, e);
    return fallback;
  }
}

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
    const breadcrumb = document.querySelector(".breadcrumb");

    if (containerChinh) containerChinh.classList.add("error-hidden");
    if (breadcrumb) breadcrumb.style.display = "none";
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
let currentUser = safeParseJSON("currentUser", null);
let thuTuChapter = "desc";
let chapterMoRong = false;
let saoDangChon = 0;

// --- 4. HIỂN THỊ CHI TIẾT THÔNG TIN TRUYỆN ---
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

  const btnTheoDoi = document.getElementById("btnTheoDoi");
  if (btnTheoDoi) {
    const iconHeart = btnTheoDoi.querySelector("i");

    const capNhatGiaoDienTheoDoi = () => {
      const hienTaiDangTheoDoi =
        typeof kiemTraDaTheoDoi === "function"
          ? kiemTraDaTheoDoi(idTruyen)
          : false;

      btnTheoDoi.classList.toggle("dang-theo-doi", hienTaiDangTheoDoi);

      if (iconHeart) {
        if (hienTaiDangTheoDoi) {
          iconHeart.className = "bi bi-check-lg";
        } else {
          iconHeart.className = "bi bi-heart";
        }
      }

      const textNodes = Array.from(btnTheoDoi.childNodes).filter(
        (node) => node.nodeType === Node.TEXT_NODE
      );
      textNodes.forEach((node) => node.remove());
      btnTheoDoi.appendChild(
        document.createTextNode(
          hienTaiDangTheoDoi ? " Bỏ theo dõi" : " Theo dõi"
        )
      );

      if (lblLuotTheoDoi) {
        lblLuotTheoDoi.textContent = (
          hienTaiDangTheoDoi ? soTheoDoiGoc + 1 : soTheoDoiGoc
        ).toLocaleString("vi-VN");
      }
    };

    capNhatGiaoDienTheoDoi();

    btnTheoDoi.addEventListener("click", () => {
      if (typeof toggleTheoDoiId === "function") {
        const ketQuaToggle = toggleTheoDoiId(idTruyen);
        if (ketQuaToggle !== false || currentUser) {
          capNhatGiaoDienTheoDoi();
        }
      } else {
        alert("Hệ thống lưu trữ đang bận, vui lòng thử lại sau!");
      }
    });
  }
}

// --- 5. XỬ LÝ HIỂN THỊ CHƯƠNG TRUYỆN ---
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
    thuTuChapter === "desc" ? b.so - a.so : a.so - b.so
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
          thuTuChapter === "desc" ? "Mới nhất trước" : "Cũ nhất trước";
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

// --- 6. ĐÁNH GIÁ SAO VÀ BÌNH LUẬN ---
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
  try {
    const kho = JSON.parse(localStorage.getItem("app_comments")) || {};
    return Array.isArray(kho[String(idTruyen)]) ? kho[String(idTruyen)] : [];
  } catch (e) {
    return [];
  }
}

// Hàm lưu trữ bình luận đồng bộ cục bộ
function luuBinhLuanCuaTruyen(dsBinhLuan) {
  try {
    const kho = JSON.parse(localStorage.getItem("app_comments")) || {};
    kho[String(idTruyen)] = dsBinhLuan;
    localStorage.setItem("app_comments", JSON.stringify(kho));
    return true;
  } catch (e) {
    return false;
  }
}

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

function thietLapFormBinhLuan() {
  const formBinhLuan = document.getElementById("formBinhLuan");
  const txtBinhLuan = document.getElementById("txtBinhLuan");
  const thongBaoDangNhapBL = document.getElementById("thongBaoDangNhapBL");

  if (!formBinhLuan) return;

  if (thongBaoDangNhapBL) {
    const linkLogin = thongBaoDangNhapBL.querySelector("a");
    if (linkLogin) {
      const duongDanHienTai = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      linkLogin.href = `login.html?quaylai=${duongDanHienTai}`;
    }
  }

  formBinhLuan.addEventListener("submit", function (e) {
    e.preventDefault();

    currentUser = safeParseJSON("currentUser", null); // Đọc lại phiên user mới nhất trước khi submit
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

    dsMoi.push({
      id: Date.now(),
      fullname: currentUser.fullname || currentUser.username || "Người dùng",
      email: currentUser.email || "Ẩn danh",
      noiDung: noiDung,
      ngayDang: new Date().toLocaleString("vi-VN"),
      saoDanhGia: saoDangChon,
    });

    luuBinhLuanCuaTruyen(dsMoi);

    const danhSachCoSao = dsMoi.filter((bl) => bl.saoDanhGia > 0);
    let diemTrungBinh = 0;
    if (danhSachCoSao.length > 0) {
      const tongSao = danhSachCoSao.reduce(
        (tong, bl) => tong + bl.saoDanhGia,
        0
      );
      diemTrungBinh = parseFloat((tongSao / danhSachCoSao.length).toFixed(1));
    }

    if (typeof truyen !== "undefined" && truyen) {
      truyen.diemDanhGia = diemTrungBinh;
    }

    const lblDiemTb = document.getElementById("lblDiemTb");
    if (lblDiemTb) {
      lblDiemTb.textContent =
        diemTrungBinh > 0 ? `${diemTrungBinh} / 5` : "Chưa có đánh giá";
    }

    if (txtBinhLuan) txtBinhLuan.value = "";
    saoDangChon = 0;
    document
      .querySelectorAll("#starsGroup .star-pick")
      .forEach((s) => s.classList.remove("active"));
    const lblDiem = document.getElementById("lblDiemDanhGia");
    if (lblDiem) lblDiem.textContent = "0/5";

    renderDanhSachBinhLuan();
  });

  const loggedIn = !!currentUser;
  formBinhLuan.classList.toggle("bl-login-hidden", !loggedIn);
  if (thongBaoDangNhapBL) {
    thongBaoDangNhapBL.classList.toggle("bl-login-hidden", loggedIn);
  }
}

// --- 7. RENDER TRUYỆN LIÊN QUAN ---
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

// --- 8. KHỞI CHẠY TRANG CHI TIẾT ---
document.addEventListener("DOMContentLoaded", () => {
  hienThiChiTietTruyen();
  renderDanhSachChapter();
  thietLapTuongTacChapter();
  thietLapDanhGiaSao();
  renderDanhSachBinhLuan();
  thietLapFormBinhLuan();
  renderTruyenLQuan();
});