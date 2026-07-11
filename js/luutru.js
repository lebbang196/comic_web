//THEO DÕI
const KHOA_THEO_DOI = "theoDoi";
function layDanhSachTheoDoi() {
  const chuoi = localStorage.getItem(KHOA_THEO_DOI);
  return chuoi ? JSON.parse(chuoi) : [];
}

function luuDanhSachTheoDoi(ds) {
  localStorage.setItem(KHOA_THEO_DOI, JSON.stringify(ds));
}

function kiemTraDaTheoDoi(idTruyen) {
  return layDanhSachTheoDoi().includes(idTruyen);
}

function toggleTheoDoiId(idTruyen) {
  let ds = layDanhSachTheoDoi();
  const dangTheoDoi = ds.includes(idTruyen);

  if (dangTheoDoi) {
    ds = ds.filter((id) => id !== idTruyen);
  } else {
    ds.push(idTruyen);
  }

  luuDanhSachTheoDoi(ds);
  return !dangTheoDoi;
}
//NÚT ĐỌC TIẾP
const KHOA_TIEN_DO_DOC = "tienDoDoc";

function layTatCaTienDoDoc() {
  const chuoi = localStorage.getItem(KHOA_TIEN_DO_DOC);
  return chuoi ? JSON.parse(chuoi) : {};
}

function luuTienDoDoc(idTruyen, soChapter) {
  const tienDo = layTatCaTienDoDoc();
  tienDo[idTruyen] = soChapter;
  localStorage.setItem(KHOA_TIEN_DO_DOC, JSON.stringify(tienDo));
}

function layChapterDangDocDo(idTruyen) {
  const tienDo = layTatCaTienDoDoc();
  return tienDo[idTruyen] || null;
}

const KHOA_BINH_LUAN_PREFIX = "binhLuan_";
function layBinhLuanTruyen(idTruyen, binhLuanGocTuData) {
  const khoa = KHOA_BINH_LUAN_PREFIX + idTruyen;
  const daLuu = localStorage.getItem(khoa);

  if (daLuu) {
    return JSON.parse(daLuu);
  }

  const dsBanDau = (binhLuanGocTuData || []).map((bl) => ({
    ...bl,
    chapterSo: null,
  }));
  localStorage.setItem(khoa, JSON.stringify(dsBanDau));
  return dsBanDau;
}

function themBinhLuan(idTruyen, binhLuanMoi) {
  const khoa = KHOA_BINH_LUAN_PREFIX + idTruyen;
  const ds = layBinhLuanTruyen(idTruyen, []);
  ds.unshift(binhLuanMoi);
  localStorage.setItem(khoa, JSON.stringify(ds));
  return ds;
}
