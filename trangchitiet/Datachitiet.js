function taoChapter(tongChapter, chapterDacBiet = []) {
  const ds = [];
  for (let i = tongChapter; i >= 1; i--) {
    ds.push({
      so: i,
      ngay: "--/--/----",
      isMoi: false,
    });
  }
  chapterDacBiet.forEach((chapter) => {
    const index = ds.findIndex((c) => c.so === chapter.so);
    if (index !== -1) {
      ds[index] = {
        ...ds[index],
        ...chapter,
      };
    }
  });

  return ds;
}
const danhSachTruyen = [
  {
    id: 1,
    ten: "Chú Thuật Hồi Chiến",
    tenKhac: ["Jujutsu Kaisen", "呪術廻戦", "JJK"],
    tacGia: "Gege Akutami",
    tinhTrang: "Đang Ra",
    theLoai: ["Action", "Fantasy", "Shounen", "Horror"],
    luotXem: "15,200,000",
    luotTheo: "980,000",
    diemDanhGia: 4.8,
    anhBia:
      "https://t.ctcdn.com.br/BgnIXmwrGYCtXF919pg8qHMgTfo=/600x600/smart/i975461.jpeg",
    moTa: ` Yuji Itadori là một học sinh trung học bình thường với sức mạnh
              thể chất phi thường. Cuộc đời cậu thay đổi hoàn toàn khi cậu vô
              tình nuốt một ngón tay của Ryomen Sukuna — vị vua nguyền của thế
              giới chú thuật. Thay vì bị tiêu diệt, Yuji trở thành vật chứa của
              Sukuna và được nhận vào Trường Kỹ Thuật Chú Thuật Đô Thị Tokyo để
              trở thành một pháp sư chú thuật. Tại đây, cùng với Megumi
              Fushiguro và Nobara Kugisaki, Yuji bước vào thế giới nguy hiểm của
              những lời nguyền và chú thuật, đối mặt với những kẻ thù ngày càng
              mạnh hơn trong hành trình tìm kiếm tất cả các ngón tay của Sukuna
              để tiêu diệt chúng mãi mãi.`,
    danhSachChapter: taoChapter(266, [
      { so: 266, ngay: "20/06/2026", isMoi: true },
      { so: 265, ngay: "13/06/2026", isMoi: true },
      { so: 264, ngay: "06/06/2026", isMoi: true },
      { so: 263, ngay: "30/05/2026", isMoi: true },
    ]),

    binhLuan: [
      {
        ten: "OtakuVN",
        kyTuDau: "O",
        sao: 5,
        thoiGian: "2 giờ trước",
        noiDung: "Chương mới quá đỉnh!",
      },
      {
        ten: "MangaFan",
        kyTuDau: "M",
        sao: 5,
        thoiGian: "5 giờ trước",
        noiDung: "JJK vẫn luôn là bộ manga yêu thích của mình.",
      },
    ],
  },
  /*Them truyen khac tai day*/
];
function layTruyenTheoId(id) {
  return danhSachTruyen.find((truyen) => truyen.id === id);
}
function layTruyenLienQuan(idHienTai, soLuong = 4) {
  return danhSachTruyen
    .filter((truyen) => truyen.id !== idHienTai)
    .slice(0, soLuong);
}
