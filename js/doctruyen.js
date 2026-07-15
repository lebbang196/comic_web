// Cấu hình dùng chung, tránh rải các giá trị cố định trong toàn bộ chương trình.
const CAU_HINH_DOC_TRUYEN = Object.freeze({
  trangDangNhap: "login.html",
  trangChiTiet: "trangchitiet.html",
  trangDocTruyen: "doctruyen.html",
  chapterMacDinh: 1,
  idToiDa: 1000000,
  chapterToiDa: 100000,
  binhLuanToiDaKyTu: 500,
  binhLuanToiDaMoiTruyen: 200,
  anhToiDaMoiChapter: 500,
  ketQuaTimKiemToiDa: 50,
  tuKhoaToiDaKyTu: 100,
  viTriHienNutLenDauTrang: 300,
  viTriBatDauSticky: 100,
  khoangCachMepMenu: 10,
  thoiGianDongMenu: 1000,
});

const KHO_LUU_TRU = Object.freeze({
  taiKhoanHienTai: "currentUser",
  binhLuan: "binhLuanTruyen",
  theoDoi: "theoDoiTheoTaiKhoan",
  tienDoDoc: "tienDoDoc",
});

const duLieuChuong =
  typeof chapters !== "undefined" && Array.isArray(chapters) ? chapters : [];
const duLieuTruyen =
  typeof danhSachTruyen !== "undefined" && Array.isArray(danhSachTruyen)
    ? danhSachTruyen
    : [];

function docJsonLocalStorage(khoa, giaTriMacDinh) {
  try {
    const chuoiJson = localStorage.getItem(khoa);
    if (chuoiJson === null) return giaTriMacDinh;

    const duLieu = JSON.parse(chuoiJson);
    return duLieu ?? giaTriMacDinh;
  } catch (loi) {
    console.warn(`Không đọc được dữ liệu JSON tại khóa ${khoa}.`, loi);
    return giaTriMacDinh;
  }
}

function ghiJsonLocalStorage(khoa, duLieu) {
  try {
    localStorage.setItem(khoa, JSON.stringify(duLieu));
    return true;
  } catch (loi) {
    console.warn(`Không lưu được dữ liệu JSON tại khóa ${khoa}.`, loi);
    return false;
  }
}

function laySoNguyenDuong(value, giaTriMacDinh, giaTriToiDa) {
  if (value === null || String(value).trim() === "") return giaTriMacDinh;

  const so = Number(value);
  if (!Number.isSafeInteger(so) || so < 1 || so > giaTriToiDa) {
    return giaTriMacDinh;
  }

  return so;
}

function gioiHanChuoi(value, soKyTuToiDa) {
  return String(value ?? "").trim().slice(0, soKyTuToiDa);
}

function xoaNoiDungPhanTu(phanTu) {
  if (!phanTu) return;

  while (phanTu.firstChild) {
    phanTu.removeChild(phanTu.firstChild);
  }
}

function taoDuongDan(tenTrang, thamSo = {}) {
  const query = new URLSearchParams();

  Object.entries(thamSo).forEach(([ten, giaTri]) => {
    if (giaTri !== null && giaTri !== undefined && giaTri !== "") {
      query.set(ten, String(giaTri));
    }
  });

  const chuoiQuery = query.toString();
  return chuoiQuery ? `${tenTrang}?${chuoiQuery}` : tenTrang;
}

function layTaiKhoanHienTai() {
  const taiKhoan = docJsonLocalStorage(KHO_LUU_TRU.taiKhoanHienTai, null);
  if (!taiKhoan || typeof taiKhoan !== "object" || Array.isArray(taiKhoan)) {
    return null;
  }

  const ten = gioiHanChuoi(
    taiKhoan.fullname || taiKhoan.username || taiKhoan.email,
    80,
  );

  return ten ? { ...taiKhoan, tenHienThi: ten } : null;
}

function layKhoaTaiKhoan(taiKhoan) {
  return gioiHanChuoi(
    taiKhoan?.email || taiKhoan?.username || taiKhoan?.fullname,
    120,
  ).toLowerCase();
}

function taoLinkDangNhap() {
  const trangHienTai = `${window.location.pathname}${window.location.search}`;
  return taoDuongDan(CAU_HINH_DOC_TRUYEN.trangDangNhap, {
    quaylai: trangHienTai,
  });
}

function hienThiLoiDocTruyen(thongBao) {
  const reader = document.getElementById("reader");
  if (!reader) return;

  xoaNoiDungPhanTu(reader);
  const tieuDe = document.createElement("h2");
  tieuDe.textContent = thongBao;
  reader.appendChild(tieuDe);
}

const thamSoUrl = new URLSearchParams(window.location.search);
const idTruyen = laySoNguyenDuong(
  thamSoUrl.get("id"),
  null,
  CAU_HINH_DOC_TRUYEN.idToiDa,
);
const soChapter = laySoNguyenDuong(
  thamSoUrl.get("chapter"),
  CAU_HINH_DOC_TRUYEN.chapterMacDinh,
  CAU_HINH_DOC_TRUYEN.chapterToiDa,
);

const truyen = duLieuTruyen.find((item) => item?.id === idTruyen) ?? null;
const chap =
  duLieuChuong.find(
    (item) => item?.id === idTruyen && item?.chapter === soChapter,
  ) ?? null;

function layBinhLuanCuaTruyen() {
  let danhSach = [];

  if (typeof layBinhLuanTruyen === "function" && truyen) {
    danhSach = layBinhLuanTruyen(truyen.id, truyen.binhLuan);
  } else if (truyen) {
    const khoBinhLuan = docJsonLocalStorage(KHO_LUU_TRU.binhLuan, {});
    danhSach = khoBinhLuan[String(truyen.id)] ?? [];
  }

  return Array.isArray(danhSach)
    ? danhSach.slice(-CAU_HINH_DOC_TRUYEN.binhLuanToiDaMoiTruyen)
    : [];
}

function luuBinhLuanMoi(binhLuan) {
  if (!truyen) return false;

  if (typeof themBinhLuan === "function") {
    themBinhLuan(truyen.id, binhLuan);
    return true;
  }

  const khoBinhLuan = docJsonLocalStorage(KHO_LUU_TRU.binhLuan, {});
  const khoaTruyen = String(truyen.id);
  const danhSachCu = Array.isArray(khoBinhLuan[khoaTruyen])
    ? khoBinhLuan[khoaTruyen]
    : [];

  khoBinhLuan[khoaTruyen] = [...danhSachCu, binhLuan].slice(
    -CAU_HINH_DOC_TRUYEN.binhLuanToiDaMoiTruyen,
  );

  return ghiJsonLocalStorage(KHO_LUU_TRU.binhLuan, khoBinhLuan);
}

function taoDongBinhLuan(binhLuan) {
  const item = document.createElement("div");
  item.classList.add("comment-item");

  const thoiGian = document.createElement("span");
  thoiGian.classList.add("comment-time");

  const ten = document.createElement("strong");
  ten.textContent = gioiHanChuoi(binhLuan.ten, 80) || "Người dùng";
  thoiGian.appendChild(ten);
  thoiGian.appendChild(
    document.createTextNode(` · ${gioiHanChuoi(binhLuan.thoiGian, 40)}`),
  );

  const noiDung = document.createElement("p");
  noiDung.classList.add("comment-text");
  noiDung.textContent = gioiHanChuoi(
    binhLuan.noiDung,
    CAU_HINH_DOC_TRUYEN.binhLuanToiDaKyTu,
  );

  item.append(thoiGian, noiDung);
  return item;
}

function renderBinhLuanChapter(commentList) {
  if (!commentList || !chap) return;

  xoaNoiDungPhanTu(commentList);
  const danhSach = layBinhLuanCuaTruyen().filter(
    (binhLuan) => binhLuan?.chapterSo === chap.chapter,
  );

  if (danhSach.length === 0) {
    const thongBao = document.createElement("p");
    thongBao.classList.add("comment-empty");
    thongBao.textContent =
      "Chưa có bình luận nào ở chapter này. Hãy là người đầu tiên!";
    commentList.appendChild(thongBao);
    return;
  }

  const fragment = document.createDocumentFragment();
  danhSach.forEach((binhLuan) => {
    fragment.appendChild(taoDongBinhLuan(binhLuan));
  });
  commentList.appendChild(fragment);
}

function khoiTaoBinhLuan() {
  const form = document.getElementById("commentForm");
  const input = document.getElementById("commentInput");
  const list = document.getElementById("commentList");
  const thongBaoDangNhap = document.getElementById("blThongBaoDangNhap");
  const linkDangNhap = document.getElementById("blLinkDangNhap");

  if (!form || !input || !list || !truyen || !chap) return;

  input.maxLength = CAU_HINH_DOC_TRUYEN.binhLuanToiDaKyTu;
  const taiKhoan = layTaiKhoanHienTai();

  form.hidden = !taiKhoan;
  if (thongBaoDangNhap) thongBaoDangNhap.hidden = Boolean(taiKhoan);
  if (linkDangNhap) linkDangNhap.href = taoLinkDangNhap();

  renderBinhLuanChapter(list);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const taiKhoanMoi = layTaiKhoanHienTai();
    if (!taiKhoanMoi) {
      window.location.assign(taoLinkDangNhap());
      return;
    }

    const noiDung = gioiHanChuoi(
      input.value,
      CAU_HINH_DOC_TRUYEN.binhLuanToiDaKyTu,
    );
    if (!noiDung) return;

    const bayGio = new Date();
    const binhLuan = {
      ten: taiKhoanMoi.tenHienThi,
      kyTuDau: taiKhoanMoi.tenHienThi.charAt(0).toUpperCase(),
      sao: 0,
      thoiGian: `${bayGio.toLocaleDateString("vi-VN")} ${bayGio.toLocaleTimeString(
        "vi-VN",
        { hour: "2-digit", minute: "2-digit" },
      )}`,
      noiDung,
      chapterSo: chap.chapter,
    };

    if (luuBinhLuanMoi(binhLuan)) {
      input.value = "";
      renderBinhLuanChapter(list);
    } else {
      alert("Không thể lưu bình luận. Vui lòng kiểm tra dung lượng trình duyệt.");
    }
  });
}

function dangTheoDoiTrongLocalStorage(taiKhoan) {
  if (!truyen) return false;

  const tatCaTheoDoi = docJsonLocalStorage(KHO_LUU_TRU.theoDoi, {});
  const khoaTaiKhoan = layKhoaTaiKhoan(taiKhoan);
  const danhSach = Array.isArray(tatCaTheoDoi[khoaTaiKhoan])
    ? tatCaTheoDoi[khoaTaiKhoan]
    : [];

  return danhSach.includes(truyen.id);
}

function kiemTraTheoDoi(taiKhoan) {
  if (typeof kiemTraDaTheoDoi === "function") {
    return Boolean(kiemTraDaTheoDoi(truyen.id));
  }
  return dangTheoDoiTrongLocalStorage(taiKhoan);
}

function daoTrangThaiTheoDoi(taiKhoan) {
  if (typeof toggleTheoDoiId === "function") {
    return Boolean(toggleTheoDoiId(truyen.id));
  }

  const tatCaTheoDoi = docJsonLocalStorage(KHO_LUU_TRU.theoDoi, {});
  const khoaTaiKhoan = layKhoaTaiKhoan(taiKhoan);
  const danhSachCu = Array.isArray(tatCaTheoDoi[khoaTaiKhoan])
    ? tatCaTheoDoi[khoaTaiKhoan]
    : [];
  const dangTheoDoi = danhSachCu.includes(truyen.id);

  tatCaTheoDoi[khoaTaiKhoan] = dangTheoDoi
    ? danhSachCu.filter((maTruyen) => maTruyen !== truyen.id)
    : [...new Set([...danhSachCu, truyen.id])];

  return ghiJsonLocalStorage(KHO_LUU_TRU.theoDoi, tatCaTheoDoi)
    ? !dangTheoDoi
    : dangTheoDoi;
}

function capNhatNutYeuThich(nut, dangTheoDoi) {
  let icon = nut.querySelector("i");
  if (!icon) {
    icon = document.createElement("i");
    nut.prepend(icon);
  }

  icon.className = dangTheoDoi
    ? "fa-solid fa-heart"
    : "fa-regular fa-heart";

  let nhan = nut.querySelector(".love-label");
  if (!nhan) {
    Array.from(nut.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) node.remove();
    });
    nhan = document.createElement("span");
    nhan.classList.add("love-label");
    nut.appendChild(nhan);
  }

  nhan.textContent = dangTheoDoi ? "Đã thích" : "Yêu thích";
  nut.classList.toggle("is-loved", dangTheoDoi);
  nut.setAttribute("aria-pressed", String(dangTheoDoi));
}

function khoiTaoYeuThich() {
  if (!truyen) return;

  const cacNut = document.querySelectorAll(".love");
  const taiKhoan = layTaiKhoanHienTai();
  const capNhatTatCa = (trangThai) => {
    cacNut.forEach((nut) => capNhatNutYeuThich(nut, trangThai));
  };

  capNhatTatCa(taiKhoan ? kiemTraTheoDoi(taiKhoan) : false);

  cacNut.forEach((nut) => {
    nut.addEventListener("click", () => {
      const taiKhoanMoi = layTaiKhoanHienTai();
      if (!taiKhoanMoi) {
        window.location.assign(taoLinkDangNhap());
        return;
      }

      capNhatTatCa(daoTrangThaiTheoDoi(taiKhoanMoi));
    });
  });
}

function luuTienDoHienTai() {
  if (!truyen || !chap) return;

  if (typeof luuTienDoDoc === "function") {
    luuTienDoDoc(truyen.id, chap.chapter);
    return;
  }

  const taiKhoan = layTaiKhoanHienTai();
  const khoaTaiKhoan = layKhoaTaiKhoan(taiKhoan) || "khach";
  const tienDo = docJsonLocalStorage(KHO_LUU_TRU.tienDoDoc, {});

  tienDo[khoaTaiKhoan] = {
    ...(tienDo[khoaTaiKhoan] ?? {}),
    [String(truyen.id)]: chap.chapter,
  };
  ghiJsonLocalStorage(KHO_LUU_TRU.tienDoDoc, tienDo);
}

function ganLienKetCoBan() {
  if (!truyen) return;

  document.querySelectorAll(".menus").forEach((menu) => {
    menu.href = taoDuongDan(CAU_HINH_DOC_TRUYEN.trangChiTiet, {
      id: truyen.id,
    });
  });
}

function ganDieuHuongChapter() {
  if (!truyen || !chap) return;

  const danhSachChap = duLieuChuong
    .filter((item) => item?.id === truyen.id)
    .slice()
    .sort((a, b) => a.chapter - b.chapter);
  const viTriHienTai = danhSachChap.findIndex(
    (item) => item.chapter === chap.chapter,
  );
  const chapTruoc = danhSachChap[viTriHienTai - 1];
  const chapSau = danhSachChap[viTriHienTai + 1];

  document.querySelectorAll(".nav_inline").forEach((nav) => {
    const cacNut = nav.querySelectorAll(".arrow-box");
    const nutTruoc = cacNut[0];
    const nutSau = cacNut[1];
    if (!nutTruoc || !nutSau) return;

    ganTrangThaiNutChapter(nutTruoc, chapTruoc, "Đây là chapter đầu tiên");
    ganTrangThaiNutChapter(nutSau, chapSau, "Đây là chapter cuối cùng");
  });
}

function ganTrangThaiNutChapter(nut, chapterDich, thongBaoBien) {
  if (!chapterDich) {
    nut.removeAttribute("href");
    nut.classList.add("disabled");
    nut.setAttribute("aria-disabled", "true");
    nut.title = thongBaoBien;
    return;
  }

  nut.href = taoDuongDan(CAU_HINH_DOC_TRUYEN.trangDocTruyen, {
    id: truyen.id,
    chapter: chapterDich.chapter,
  });
  nut.classList.remove("disabled");
  nut.setAttribute("aria-disabled", "false");
  nut.title = `Chapter ${chapterDich.chapter}`;
}

function renderNoiDungChapter() {
  if (!chap) return;

  document.querySelectorAll(".chapter-name").forEach((phanTu) => {
    phanTu.textContent = `Chapter ${chap.chapter}`;
  });

  const reader = document.getElementById("reader");
  if (!reader) return;

  xoaNoiDungPhanTu(reader);
  const fragment = document.createDocumentFragment();
  const danhSachAnh = Array.isArray(chap.images)
    ? chap.images.slice(0, CAU_HINH_DOC_TRUYEN.anhToiDaMoiChapter)
    : [];

  danhSachAnh.forEach((duongDanAnh, index) => {
    const anh = document.createElement("img");
    anh.src = String(duongDanAnh);
    anh.alt = `Trang ${index + 1} - Chapter ${chap.chapter}`;
    anh.loading = index < 2 ? "eager" : "lazy";
    fragment.appendChild(anh);
  });
  reader.appendChild(fragment);
}

function renderDanhSachChapter() {
  if (!truyen) return;

  const danhSach = duLieuChuong
    .filter((item) => item?.id === truyen.id)
    .slice()
    .sort((a, b) => a.chapter - b.chapter);

  document.querySelectorAll(".chapter-list").forEach((khung) => {
    xoaNoiDungPhanTu(khung);
    const fragment = document.createDocumentFragment();

    danhSach.forEach((item) => {
      const link = document.createElement("a");
      link.href = taoDuongDan(CAU_HINH_DOC_TRUYEN.trangDocTruyen, {
        id: truyen.id,
        chapter: item.chapter,
      });
      link.textContent = `Chapter ${item.chapter}`;
      link.classList.toggle("active", item.chapter === chap?.chapter);
      fragment.appendChild(link);
    });
    khung.appendChild(fragment);
  });
}

function taoTheTruyen(item) {
  const khung = document.createElement("div");
  khung.classList.add("khungtruyenrieng");

  const link = document.createElement("a");
  link.href = taoDuongDan(CAU_HINH_DOC_TRUYEN.trangChiTiet, { id: item.id });

  const anh = document.createElement("img");
  anh.src = String(item.anhBia ?? "");
  anh.alt = gioiHanChuoi(item.ten, 120);
  anh.loading = "lazy";

  const ten = document.createElement("h3");
  ten.textContent = gioiHanChuoi(item.ten, 120);

  const theLoai = document.createElement("span");
  theLoai.textContent = Array.isArray(item.theLoai)
    ? item.theLoai.slice(0, 10).join(" • ")
    : "";

  link.append(anh, ten);
  khung.append(link, theLoai);
  return khung;
}

function hienThiTruyen(khung, danhSach) {
  if (!khung) return;

  xoaNoiDungPhanTu(khung);
  const fragment = document.createDocumentFragment();
  danhSach
    .slice(0, CAU_HINH_DOC_TRUYEN.ketQuaTimKiemToiDa)
    .forEach((item) => fragment.appendChild(taoTheTruyen(item)));
  khung.appendChild(fragment);
}

function khoiTaoTimKiem() {
  const input = document.getElementById("inputsearch");
  const khungKetQua = document.getElementById("khungKetQua");
  const khuVucKetQua = document.getElementById("ketquatimkiem");
  const noiDungChinh = document.querySelector("main");

  if (!input || !khungKetQua || !khuVucKetQua || !noiDungChinh) return;
  input.maxLength = CAU_HINH_DOC_TRUYEN.tuKhoaToiDaKyTu;

  input.addEventListener("input", () => {
    const tuKhoa = gioiHanChuoi(
      input.value,
      CAU_HINH_DOC_TRUYEN.tuKhoaToiDaKyTu,
    ).toLocaleLowerCase("vi");

    if (!tuKhoa) {
      khuVucKetQua.hidden = true;
      noiDungChinh.hidden = false;
      xoaNoiDungPhanTu(khungKetQua);
      return;
    }

    khuVucKetQua.hidden = false;
    noiDungChinh.hidden = true;

    const ketQua = duLieuTruyen.filter((item) => {
      const ten = String(item.ten ?? "").toLocaleLowerCase("vi");
      const tacGia = String(item.tacGia ?? "").toLocaleLowerCase("vi");
      const theLoai = Array.isArray(item.theLoai)
        ? item.theLoai.join(" ").toLocaleLowerCase("vi")
        : "";
      return ten.includes(tuKhoa) || tacGia.includes(tuKhoa) || theLoai.includes(tuKhoa);
    });

    if (ketQua.length === 0) {
      xoaNoiDungPhanTu(khungKetQua);
      const thongBao = document.createElement("p");
      thongBao.classList.add("empty-search-result");
      thongBao.textContent =
        "Không tìm thấy truyện phù hợp, vui lòng nhập từ khóa khác.";
      khungKetQua.appendChild(thongBao);
      khungKetQua.style.display = "block";
      return;
    }

    hienThiTruyen(khungKetQua, ketQua);
    khungKetQua.style.display = "grid";
  });
}

function khoiTaoMenu() {
  const nutMenu = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  if (!nutMenu || !menu) return;

  nutMenu.addEventListener("click", (event) => {
    event.stopPropagation();
    menu.classList.toggle("active");
  });
  menu.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", () => menu.classList.remove("active"));
}

function khoiTaoDanhSachChapterNoi() {
  document.querySelectorAll(".check__line").forEach((nut) => {
    const menu = nut.querySelector(".chapter-list");
    if (!menu) return;

    let boDemDong;
    nut.addEventListener("mouseenter", () => {
      clearTimeout(boDemDong);
      menu.classList.add("show");

      requestAnimationFrame(() => {
        const viTri = menu.getBoundingClientRect();
        if (viTri.top < CAU_HINH_DOC_TRUYEN.khoangCachMepMenu) {
          nut.classList.remove("open-up");
        } else if (
          viTri.bottom >
          window.innerHeight - CAU_HINH_DOC_TRUYEN.khoangCachMepMenu
        ) {
          nut.classList.add("open-up");
        }
      });
    });

    nut.addEventListener("mouseleave", () => {
      boDemDong = setTimeout(() => {
        if (!nut.classList.contains("active")) menu.classList.remove("show");
      }, CAU_HINH_DOC_TRUYEN.thoiGianDongMenu);
    });

    nut.addEventListener("click", (event) => {
      event.stopPropagation();
      const dangMo = nut.classList.toggle("active");
      menu.classList.toggle("show", dangMo);
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".check__line").forEach((nut) => {
      nut.classList.remove("active");
      nut.querySelector(".chapter-list")?.classList.remove("show");
    });
  });
}

function khoiTaoStickyFooterDieuHuong() {
  const thanhDieuHuong = document.querySelector(".div_main.top");
  const mocFooter = document.querySelector(".div_main.bottom");
  const nutLenDauTrang = document.getElementById("btnScrollTop");
  if (!thanhDieuHuong || !mocFooter) return;

  let viTriCu = window.scrollY;

  nutLenDauTrang?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    const viTriMoi = window.scrollY;
    const daChamFooter =
      viTriMoi + window.innerHeight >= mocFooter.offsetTop;

    if (nutLenDauTrang) {
      nutLenDauTrang.hidden =
        viTriMoi <= CAU_HINH_DOC_TRUYEN.viTriHienNutLenDauTrang;
    }

    if (
      viTriMoi <= CAU_HINH_DOC_TRUYEN.viTriBatDauSticky ||
      daChamFooter
    ) {
      thanhDieuHuong.classList.remove("fixed-top", "fixed-bottom");
      viTriCu = viTriMoi;
      return;
    }

    const dangCuonXuong = viTriMoi > viTriCu;
    thanhDieuHuong.classList.toggle("fixed-bottom", dangCuonXuong);
    thanhDieuHuong.classList.toggle("fixed-top", !dangCuonXuong);
    document.querySelectorAll(".check__line").forEach((nut) => {
      nut.classList.toggle("open-up", dangCuonXuong);
    });
    viTriCu = viTriMoi;
  });
}

function khoiTaoTrangDocTruyen() {
  khoiTaoMenu();
  khoiTaoTimKiem();
  khoiTaoDanhSachChapterNoi();
  khoiTaoStickyFooterDieuHuong();

  if (!truyen) {
    hienThiLoiDocTruyen("Không tìm thấy truyện.");
    return;
  }

  ganLienKetCoBan();

  if (!chap) {
    hienThiLoiDocTruyen("Không tìm thấy chapter.");
    return;
  }

  ganDieuHuongChapter();
  renderNoiDungChapter();
  renderDanhSachChapter();
  khoiTaoBinhLuan();
  khoiTaoYeuThich();
  luuTienDoHienTai();
}

document.addEventListener("DOMContentLoaded", khoiTaoTrangDocTruyen);