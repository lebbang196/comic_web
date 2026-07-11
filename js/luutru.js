// ==================================================
// TÀI KHOẢN HIỆN TẠI
// ==================================================

function layTaiKhoanLuuTruHienTai() {
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

function layMaTaiKhoanLuuTru() {
  const taiKhoan =
    layTaiKhoanLuuTruHienTai();

  if (!taiKhoan) return null;

  return (
    taiKhoan.id ||
    taiKhoan.email ||
    taiKhoan.username ||
    taiKhoan.tenDangNhap ||
    taiKhoan.fullname ||
    null
  );
}

// Giữ tên này để tương thích với mã trước đó
function layMaTaiKhoanTheoDoi() {
  return layMaTaiKhoanLuuTru();
}

// ==================================================
// THEO DÕI THEO TÀI KHOẢN
// ==================================================

const KHOA_THEO_DOI_PREFIX = "theoDoi_";

function layKhoaTheoDoi() {
  const maTaiKhoan =
    layMaTaiKhoanLuuTru();

  if (!maTaiKhoan) return null;

  return (
    KHOA_THEO_DOI_PREFIX +
    String(maTaiKhoan).toLowerCase()
  );
}

function layDanhSachTheoDoi() {
  const khoa = layKhoaTheoDoi();

  if (!khoa) return [];

  try {
    const chuoi =
      localStorage.getItem(khoa);

    const danhSach = chuoi
      ? JSON.parse(chuoi)
      : [];

    if (!Array.isArray(danhSach)) {
      return [];
    }

    return danhSach
      .map(Number)
      .filter(Number.isFinite);
  } catch (error) {
    return [];
  }
}

function luuDanhSachTheoDoi(danhSach) {
  const khoa = layKhoaTheoDoi();

  if (!khoa) return false;

  localStorage.setItem(
    khoa,
    JSON.stringify(danhSach),
  );

  return true;
}

function kiemTraDaTheoDoi(idTruyen) {
  return layDanhSachTheoDoi().includes(
    Number(idTruyen),
  );
}

function toggleTheoDoiId(idTruyen) {
  if (!layTaiKhoanLuuTruHienTai()) {
    alert(
      "Bạn cần đăng nhập để theo dõi truyện!",
    );

    return false;
  }

  idTruyen = Number(idTruyen);

  let danhSach = layDanhSachTheoDoi();

  const dangTheoDoi =
    danhSach.includes(idTruyen);

  if (dangTheoDoi) {
    danhSach = danhSach.filter(
      (id) => id !== idTruyen,
    );
  } else {
    danhSach.push(idTruyen);
  }

  luuDanhSachTheoDoi(danhSach);

  return !dangTheoDoi;
}

// ==================================================
// ĐỌC TIẾP THEO TÀI KHOẢN
// ==================================================

const KHOA_TIEN_DO_DOC_PREFIX =
  "tienDoDoc_";

function layKhoaTienDoDoc() {
  const maTaiKhoan =
    layMaTaiKhoanLuuTru();

  if (!maTaiKhoan) return null;

  return (
    KHOA_TIEN_DO_DOC_PREFIX +
    String(maTaiKhoan).toLowerCase()
  );
}

function layTatCaTienDoDoc() {
  const khoa = layKhoaTienDoDoc();

  if (!khoa) return {};

  try {
    const chuoi =
      localStorage.getItem(khoa);

    const tienDo = chuoi
      ? JSON.parse(chuoi)
      : {};

    if (
      !tienDo ||
      typeof tienDo !== "object" ||
      Array.isArray(tienDo)
    ) {
      return {};
    }

    return tienDo;
  } catch (error) {
    return {};
  }
}

function luuTienDoDoc(
  idTruyen,
  soChapter,
) {
  const khoa = layKhoaTienDoDoc();

  // Chưa đăng nhập thì không lưu
  if (!khoa) return false;

  idTruyen = Number(idTruyen);
  soChapter = Number(soChapter);

  if (
    !Number.isFinite(idTruyen) ||
    !Number.isFinite(soChapter)
  ) {
    return false;
  }

  const tienDo = layTatCaTienDoDoc();

  tienDo[idTruyen] = soChapter;

  localStorage.setItem(
    khoa,
    JSON.stringify(tienDo),
  );

  return true;
}

function layChapterDangDocDo(idTruyen) {
  const tienDo = layTatCaTienDoDoc();

  const chapter = Number(
    tienDo[Number(idTruyen)],
  );

  if (
    Number.isFinite(chapter) &&
    chapter > 0
  ) {
    return chapter;
  }

  return null;
}

// ==================================================
// BÌNH LUẬN
// ==================================================

const KHOA_BINH_LUAN_PREFIX =
  "binhLuan_";

function layBinhLuanTruyen(
  idTruyen,
  binhLuanGocTuData,
) {
  const khoa =
    KHOA_BINH_LUAN_PREFIX + idTruyen;

  const daLuu =
    localStorage.getItem(khoa);

  if (daLuu) {
    try {
      const danhSach = JSON.parse(daLuu);

      return Array.isArray(danhSach)
        ? danhSach
        : [];
    } catch (error) {
      return [];
    }
  }

  const danhSachBanDau = (
    binhLuanGocTuData || []
  ).map((binhLuan) => ({
    ...binhLuan,
    chapterSo: null,
  }));

  localStorage.setItem(
    khoa,
    JSON.stringify(danhSachBanDau),
  );

  return danhSachBanDau;
}

function themBinhLuan(
  idTruyen,
  binhLuanMoi,
) {
  const khoa =
    KHOA_BINH_LUAN_PREFIX + idTruyen;

  const danhSach =
    layBinhLuanTruyen(idTruyen, []);

  danhSach.unshift(binhLuanMoi);

  localStorage.setItem(
    khoa,
    JSON.stringify(danhSach),
  );

  return danhSach;
}