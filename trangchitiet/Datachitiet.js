function taoChapter(
  tongChapter,
  chapterDacBiet = [],
  ngayBatDau = new Date(),
  soNgayMoiChap = 7,
) {
  const ds = [];

  for (let i = tongChapter; i >= 1; i--) {
    const soChapterLuiVe = tongChapter - i;
    const ngay = new Date(ngayBatDau);
    ngay.setDate(ngay.getDate() - soChapterLuiVe * soNgayMoiChap);

    ds.push({
      so: i,
      ngay: ngay.toLocaleDateString("vi-VN"),
      isMoi: soChapterLuiVe < 4,
    });
  }

  chapterDacBiet.forEach((chapter) => {
    const index = ds.findIndex((c) => c.so === chapter.so);
    if (index !== -1) {
      ds[index] = { ...ds[index], ...chapter };
    }
  });

  return ds;
}
const danhSachTruyen = [
  {
    id: 1,
    ten: "Thanh Gươm Diệt Quỷ",
    tenKhac: ["Kimetsu no Yaiba", "鬼滅の刃", "Demon Slayer"],
    tacGia: "Koyoharu Gotouge",
    tinhTrang: "Hoàn Thành",
    theLoai: ["Drama", "Fantasy", "Manga", "Shounen"],
    luotXem: "18,500,000",
    luotTheo: "1,200,000",
    diemDanhGia: 4.9,
    anhBia:
      "https://phongvu.vn/cong-nghe/wp-content/uploads/2025/08/hinh-nen-thanh-guom-diet-quy-55-576x1024.jpg",
    moTa: `Thanh Gươm Diệt Quỷ kể về câu chuyện diễn ra trong một thế giới nơi loài quỷ
          ăn thịt người hoành hành khắp nơi. Sau khi gia đình bị quỷ sát hại
          và em gái Nezuko bị biến thành quỷ, Kamado Tanjiro quyết tâm bước
          lên con đường trở thành kiếm sĩ diệt quỷ. Dưới sự dẫn dắt và rèn
          luyện của các kiếm sĩ thuộc Đội Diệt Quỷ, Tanjiro chính thức gia
          nhập tổ chức này và bắt đầu hành trình đầy nguy hiểm. Cùng với
          những người đồng đội của mình, cậu không ngừng chiến đấu chống lại
          những con quỷ ngày càng mạnh hơn, đồng thời tìm kiếm cách giúp em
          gái trở lại thành người. Cuộc chiến của Tanjiro không chỉ là hành
          trình báo thù cho gia đình, mà còn là nỗ lực chấm dứt bi kịch và
          đau thương do quỷ dữ gây ra.`,
    danhSachChapter: taoChapter(205),
    binhLuan: [],
  },
  {
    id: 2,
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
    moTa: `Yuji Itadori là một học sinh trung học bình thường với sức mạnh
          thể chất phi thường. Cuộc đời cậu thay đổi hoàn toàn khi cậu vô
          tình nuốt một ngón tay của Ryomen Sukuna — vị vua nguyền của thế
          giới chú thuật. Thay vì bị tiêu diệt, Yuji trở thành vật chứa của
          Sukuna và được nhận vào Trường Kỹ Thuật Chú Thuật Đô Thị Tokyo để
          trở thành một pháp sư chú thuật. Tại đây, cùng với Megumi
          Fushiguro và Nobara Kugisaki, Yuji bước vào thế giới nguy hiểm của
          những lời nguyền và chú thuật, đối mặt với những kẻ thù ngày càng
          mạnh hơn trong hành trình tìm kiếm tất cả các ngón tay của Sukuna
          để tiêu diệt chúng mãi mãi.`,
    danhSachChapter: taoChapter(266),
    binhLuan: [],
  },

  {
    id: 3,
    ten: "Thám Tử Conan",
    tenKhac: ["Detective Conan", "名探偵コナン"],
    tacGia: "Gosho Aoyama",
    tinhTrang: "Đang Ra",
    theLoai: [
      "Comedy",
      "Drama",
      "Manga",
      "Romance",
      "School Life",
      "Trinh Thám",
    ],
    luotXem: "22,100,000",
    luotTheo: "1,450,000",
    diemDanhGia: 4.8,
    anhBia:
      "https://i.pinimg.com/736x/af/f1/a3/aff1a34e425f8c69447c0cfda16d1753.jpg",
    moTa: `Shinichi Kudo là một học sinh trung học và thám tử thiên tài nổi tiếng 
          với khả năng suy luận xuất sắc. Cuộc đời cậu thay đổi hoàn toàn khi trong lúc
          điều tra một tổ chức tội phạm bí ẩn, cậu bị ép uống một loại thuốc độc khiến 
          cơ thể bị thu nhỏ thành hình dáng của một đứa trẻ. Để che giấu thân phận và 
          truy tìm tung tích của tổ chức này, Shinichi lấy tên mới là Edogawa Conan và 
          sống tại nhà thám tử Mori. Tại đây, cùng với những người bạn và đồng minh của 
          mình, Conan liên tục đối mặt với những vụ án phức tạp, những âm mưu nguy hiểm 
          và từng bước tiến gần hơn đến bí mật của Tổ chức Áo Đen trong hành trình tìm lại 
          cơ thể thật của mình.`,
    danhSachChapter: taoChapter(1120),
    binhLuan: [],
  },
  {
    id: 4,
    ten: "Black Clover - Thế Giới Phép Thuật",
    tenKhac: ["Black Clover", "ブラッククローバー"],
    tacGia: "Yuki Tabata",
    tinhTrang: "Hoàn Thành",
    theLoai: ["Action"],
    luotXem: "19,800,000",
    luotTheo: "540,000",
    diemDanhGia: 4.6,
    anhBia: "https://dicasgeeks.com.br/wp-content/uploads/2019/11/capa.jpg",
    moTa: `Black Clover kể về câu chuyện của Asta, một cậu bé sinh ra trong thế giới
          mà mọi người đều sở hữu ma pháp, ngoại trừ chính cậu. Dù không có
          phép thuật, Asta vẫn nuôi dưỡng ước mơ trở thành Ma Pháp Vương —
          người mạnh nhất Vương quốc Clover. Cùng với người bạn và cũng là
          đối thủ Yuno, Asta bước vào hành trình đầy thử thách với thanh kiếm
          phản ma thuật đặc biệt của mình. Gia nhập đoàn Hiệp sĩ Ma pháp Hắc
          Bộc Ngưu, Asta cùng những đồng đội chiến đấu chống lại các thế lực
          hắc ám, bảo vệ vương quốc và từng bước tiến gần hơn đến ước mơ trở
          thành Ma Pháp Vương.`,
    danhSachChapter: taoChapter(370),
    binhLuan: [],
  },
  {
    id: 5,
    ten: "Mairimashita! Iruma-kun",
    tenKhac: ["Welcome to Demon School! Iruma-kun"],
    tacGia: "Osamu Nishi",
    tinhTrang: "Đang Ra",
    theLoai: ["Comedy", "Drama", "Fantasy", "Manga", "School Life", "Shounen"],
    luotXem: "11,300,000",
    luotTheo: "310,000",
    diemDanhGia: 4.5,
    anhBia:
      "https://img10.hotstar.com/image/upload/f_auto,q_auto/sources/r1/cms/prod/9439/1734434359439-i",
    moTa: `Mairimashita! Iruma-kun kể về Suzuki Iruma, một cậu bé 14 tuổi có cuộc sống
          bất hạnh khi bị cha mẹ vô trách nhiệm bán cho một ác quỷ tên là
          Sullivan. Tuy nhiên, thay vì bị ăn thịt, Iruma lại được Sullivan
          nhận làm cháu nuôi và đưa đến sống tại Ma giới. Tại đây, Iruma phải
          che giấu thân phận con người của mình khi theo học tại Học viện Quỷ
          Babyls. Với tính cách tốt bụng, khả năng thích nghi đáng kinh ngạc
          cùng những người bạn mới, Iruma dần trở thành tâm điểm của hàng loạt
          sự kiện kỳ lạ và những cuộc phiêu lưu đầy thú vị trong thế giới quỷ
          đầy bí ẩn.`,
    danhSachChapter: taoChapter(280),
    binhLuan: [],
  },
  {
    id: 6,
    ten: "Wistoria Bản Hùng Ca Kiếm Và Pháp Trượng",
    tenKhac: ["Wistoria: Wand and Sword"],
    tacGia: "Hyun Sub Shin",
    tinhTrang: "Đang Ra",
    theLoai: [
      "Action",
      "Adventure",
      "Fantasy",
      "Comedy",
      "Manga",
      "School Life",
    ],
    luotXem: "2,100,000",
    luotTheo: "150,000",
    diemDanhGia: 4.4,
    anhBia:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx182300-IYkq5KrkQq1V.jpg",
    moTa: `Wistoria: Wand and Sword kể về Will Serfort, một chàng trai trẻ không thể
          sử dụng ma pháp trong một thế giới nơi sức mạnh phép thuật quyết
          định tất cả. Dù bị mọi người chế giễu và xem thường, Will vẫn quyết
          tâm theo học tại Học viện Pháp thuật Regarden với mục tiêu trở thành
          một trong những Magia Vander hùng mạnh nhất. Sở hữu kỹ năng kiếm
          thuật phi thường cùng ý chí kiên cường, Will bước vào hành trình
          vượt qua vô số thử thách, chiến đấu với quái vật và những đối thủ
          mạnh mẽ để chứng minh rằng sức mạnh không chỉ đến từ ma pháp. Đồng
          thời, cậu cũng nỗ lực thực hiện lời hứa năm xưa với người bạn thân
          của mình, người đang đứng trên đỉnh cao của thế giới phép thuật.`,
    danhSachChapter: taoChapter(65),
    binhLuan: [],
  },
  {
    id: 7,
    ten: "Blue Lock",
    tenKhac: ["ブルーロック"],
    tacGia: "Muneyuki Kaneshiro, Yusuke Nomura",
    tinhTrang: "Đang Ra",
    theLoai: ["Action", "Sport"],
    luotXem: "8,700,000",
    luotTheo: "620,000",
    diemDanhGia: 4.7,
    anhBia:
      "https://sm.ign.com/t/ign_pk/cover/b/blue-lock-/blue-lock-the-movie-episode-nagi_qgvd.600.jpg",
    moTa: `Blue Lock kể về hành trình của Yoichi Isagi, một tiền đạo trẻ đầy tiềm năng
          được chọn tham gia dự án Blue Lock — chương trình đào tạo bí mật do
          Liên đoàn Bóng đá Nhật Bản thành lập nhằm tạo ra tiền đạo ích kỷ và
          xuất sắc nhất thế giới. Tại đây, Isagi cùng hàng trăm cầu thủ trẻ
          tài năng khác phải cạnh tranh khốc liệt trong những trận đấu sinh
          tồn, nơi thất bại đồng nghĩa với việc mất cơ hội khoác áo đội tuyển
          quốc gia vĩnh viễn. Trải qua những thử thách đầy áp lực và những
          cuộc đối đầu căng thẳng, Isagi không ngừng khám phá bản thân, phát
          triển kỹ năng và theo đuổi giấc mơ trở thành tiền đạo số một thế
          giới.`,
    danhSachChapter: taoChapter(280),
    binhLuan: [],
  },
  {
    id: 8,
    ten: "Captain Tsubasa: Rising Sun",
    tenKhac: ["キャプテン翼"],
    tacGia: "Yoichi Takahashi",
    tinhTrang: "Đang Ra",
    theLoai: ["Manga", "Sport"],
    luotXem: "3,400,000",
    luotTheo: "190,000",
    diemDanhGia: 4.3,
    anhBia:
      "https://play-lh.googleusercontent.com/h9W8nSt2ZbzlmihOsqneMa7BWKVcIq7oRvUH3xq1GMgV4tSLOapAJzL6hgE0gEhVtdlTKiTbh9gGNo6W44Gh",
    moTa: `Captain Tsubasa: Rising Sun tiếp tục câu chuyện về Tsubasa Ozora và các đồng
          đội khi họ đại diện cho đội tuyển U-23 Nhật Bản tham gia đấu trường
          bóng đá quốc tế. Với khát vọng đưa bóng đá Nhật Bản vươn tầm thế
          giới, Tsubasa cùng những cầu thủ tài năng như Kojiro Hyuga, Genzo
          Wakabayashi và Taro Misaki phải đối mặt với các đội tuyển mạnh nhất
          hành tinh. Trên hành trình chinh phục vinh quang, họ không chỉ trải
          qua những trận đấu đầy kịch tính và cảm xúc mà còn phải vượt qua
          giới hạn của bản thân, tinh thần đồng đội và những thử thách khắc
          nghiệt để hiện thực hóa giấc mơ trở thành nhà vô địch thế giới.`,
    danhSachChapter: taoChapter(45),
    binhLuan: [],
  },
  {
    id: 9,
    ten: "Tôi Mộng Giữa Ban Ngày",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Manhua", "Ngôn Tình", "School Life", "Truyện Màu"],
    luotXem: "1,250,000",
    luotTheo: "88,000",
    diemDanhGia: 4.2,
    anhBia:
      "https://soaicacomic2.top/wp-content/uploads/2023/05/toi-mong-giua-ban-ngay-720x970.jpg",
    moTa: `Tôi Mộng Giữa Ban Ngày kể về câu chuyện tình cảm thanh xuân giữa Lâm Ngữ Kinh
          và Thẩm Quyện. Sau khi chuyển đến một ngôi trường mới, Lâm Ngữ Kinh
          tình cờ gặp Thẩm Quyện — một nam sinh nổi tiếng với vẻ ngoài lạnh
          lùng và thành tích học tập xuất sắc. Từ những hiểu lầm và cuộc gặp
          gỡ tình cờ, cả hai dần trở nên thân thiết, cùng nhau trải qua những
          tháng ngày học đường đầy cảm xúc, niềm vui và thử thách. Trên hành
          trình trưởng thành, họ không chỉ khám phá tình cảm của bản thân mà
          còn học cách đối mặt với quá khứ, vượt qua khó khăn và theo đuổi
          những ước mơ của riêng mình.`,
    danhSachChapter: taoChapter(40),
    binhLuan: [],
  },
  {
    id: 10,
    ten: "Còn Ra Thể Thống Gì Nữa",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action"],
    luotXem: "980,000",
    luotTheo: "62,000",
    diemDanhGia: 4.1,
    anhBia:
      "https://static2.vieon.vn/vieplay-image/poster_v4/2026/02/09/ehwpq0wc_660x946-conrathethongginua.png",
    moTa: `Còn Ra Thể Thống Gì Nữa kể về hành trình đầy hài hước và bất ngờ của nữ chính
          sau khi vô tình xuyên không vào một thế giới kỳ lạ và bị ràng buộc
          với một hệ thống nhiệm vụ bí ẩn. Để có thể sống sót và tìm cách trở
          về thế giới của mình, cô buộc phải hoàn thành hàng loạt nhiệm vụ oái
          oăm do hệ thống giao phó. Tuy nhiên, với tính cách thông minh, lém
          lỉnh và thường xuyên hành động ngoài dự đoán, nữ chính liên tục phá
          vỡ các quy tắc vốn có, khiến cho cả hệ thống lẫn những nhân vật xung
          quanh rơi vào những tình huống dở khóc dở cười. Hành trình của cô là
          chuỗi những cuộc phiêu lưu, tình huống hài hước và những bí mật dần
          được hé lộ về thế giới mà cô đang sống.`,
    danhSachChapter: taoChapter(30),
    binhLuan: [],
  },
  {
    id: 11,
    ten: "Thế Giới Sau Tận Thế",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action", "Comedy", "Manhwa", "Truyện Màu"],
    luotXem: "1,600,000",
    luotTheo: "105,000",
    diemDanhGia: 4.3,
    anhBia: "https://i.redd.it/ws2ml66sx55h1.jpeg",
    moTa: `Thế Giới Sau Tận Thế kể về hành trình sinh tồn và khám phá của những con
          người còn sống sót sau khi thế giới rơi vào thảm họa diệt vong.
          Trong bối cảnh xã hội sụp đổ, quái vật và những hiểm họa bí ẩn xuất
          hiện khắp nơi, nhân vật chính buộc phải chiến đấu để bảo vệ bản
          thân và những người đồng hành. Trên hành trình đầy nguy hiểm ấy,
          họ không chỉ đối mặt với các thế lực thù địch mà còn phải khám phá
          sự thật đằng sau ngày tận thế. Với lòng dũng cảm, ý chí sinh tồn và
          khát vọng xây dựng lại tương lai, họ từng bước vượt qua tuyệt vọng
          để tìm kiếm hy vọng trong một thế giới đã hoàn toàn thay đổi.`,
    danhSachChapter: taoChapter(55),
    binhLuan: [],
  },
  {
    id: 12,
    ten: "Ma Vương Tái Sinh Trở Thành Pháp Sư Mạnh Nhất",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action", "Adventure", "Fantasy", "Manga", "Romance"],
    luotXem: "2,050,000",
    luotTheo: "134,000",
    diemDanhGia: 4.4,
    anhBia: "/img/tt6.jpg",
    moTa: `Ma Vương Tái Sinh Trở Thành Pháp Sư Mạnh Nhất kể về Varvatos, Ma Vương mạnh
          nhất trong lịch sử, người đã thống trị thế giới bằng sức mạnh áp đảo
          của mình. Tuy nhiên, vì cảm thấy cô đơn khi không có ai đủ sức sánh
          ngang, Varvatos quyết định tái sinh vào tương lai với mong muốn có
          một cuộc sống bình thường. Sau khi đầu thai thành Ard Meteor, cậu
          phát hiện rằng sức mạnh và nền văn minh ma pháp của thế giới mới đã
          suy yếu đáng kể, khiến năng lực của cậu vẫn vượt xa mọi người xung
          quanh. Trong khi cố gắng tận hưởng cuộc sống học đường và kết bạn,
          Ard liên tục bị cuốn vào những âm mưu, trận chiến và bí mật của thế
          giới, đồng thời dần khám phá sự thật về quá khứ và vận mệnh của
          chính mình.`,
    danhSachChapter: taoChapter(48),
    binhLuan: [],
  },
  {
    id: 13,
    ten: "Bạo Thực Giả",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action"],
    luotXem: "890,000",
    luotTheo: "51,000",
    diemDanhGia: 4.0,
    anhBia: "https://truyenqq.com.vn/media/book/bao-thuc-gia.png",
    moTa: `Bạo Thực Giả kể về Fate Graphite, một chàng trai bị mọi người khinh thường
          vì sở hữu kỹ năng "Bạo Thực" tưởng chừng vô dụng. Tuy nhiên, Fate
          sớm phát hiện ra rằng kỹ năng này cho phép cậu hấp thụ sức mạnh,
          kỹ năng và năng lực của những kẻ mà mình đánh bại. Từ một người yếu
          đuối sống dưới đáy xã hội, Fate dần trở nên mạnh mẽ hơn sau mỗi trận
          chiến và bước vào hành trình khám phá bí mật đằng sau sức mạnh của
          bản thân. Trên con đường ấy, cậu phải đối mặt với những kẻ thù nguy
          hiểm, những âm mưu đen tối và số phận nghiệt ngã đang chờ đợi mình,
          đồng thời tìm kiếm ý nghĩa thực sự của sức mạnh mà cậu sở hữu.`,
    danhSachChapter: taoChapter(25),
    binhLuan: [],
  },
  {
    id: 14,
    ten: "Bá Vương Sủng Ái Cô Vợ Mù",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Chuyển Sinh", "Manhwa", "Ngôn Tình", "Truyện Màu"],
    luotXem: "1,780,000",
    luotTheo: "142,000",
    diemDanhGia: 4.5,
    anhBia: "/img/tt1.png",
    moTa: `Bá Vương Sủng Ái Cô Vợ Mù kể về câu chuyện tình yêu đầy cảm xúc giữa một tổng
          tài quyền lực và người vợ mù của anh. Vì những biến cố trong quá
          khứ, nữ chính phải sống trong bóng tối và chịu đựng nhiều đau khổ,
          hiểu lầm. Tưởng chừng cuộc hôn nhân của họ chỉ là sự sắp đặt, nhưng
          qua thời gian, nam chính dần bị thu hút bởi sự mạnh mẽ, lương thiện
          và kiên cường của cô. Trong khi cùng nhau đối mặt với những âm mưu,
          bí mật gia tộc và thử thách của số phận, cả hai dần nảy sinh tình
          cảm sâu sắc. Hành trình của họ là câu chuyện về tình yêu, sự hy sinh
          và niềm tin vào hạnh phúc giữa những nghịch cảnh của cuộc đời.`,
    danhSachChapter: taoChapter(60),
    binhLuan: [],
  },
  {
    id: 15,
    ten: "Ác Chi Hoàn",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action"],
    luotXem: "670,000",
    luotTheo: "38,000",
    diemDanhGia: 3.9,
    anhBia:
      "https://panomic1.info/wp-content/uploads/2026/04/z7754738904501_a90173d77d1d74041c4a64cf5af3a9eb-720x970.webp",
    moTa: `Ác Chi Hoàn kể về hành trình sinh tồn đầy căng thẳng của những con người bị
          cuốn vào một thế giới tàn khốc, nơi ranh giới giữa thiện và ác trở
          nên mờ nhạt. Khi những bí mật đen tối và các thế lực nguy hiểm dần
          lộ diện, nhân vật chính buộc phải chiến đấu không chỉ để bảo vệ bản
          thân mà còn để tìm ra sự thật đằng sau những bi kịch đang diễn ra.
          Trên hành trình ấy, họ phải đối mặt với sự phản bội, tuyệt vọng và
          những lựa chọn nghiệt ngã, đồng thời khám phá bản chất thực sự của
          con người khi bị đẩy đến giới hạn cuối cùng.`,
    danhSachChapter: taoChapter(20),
    binhLuan: [],
  },
  {
    id: 16,
    ten: "Thế Giới Này Không Tồn Tại Ma Quỷ",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action"],
    luotXem: "540,000",
    luotTheo: "29,000",
    diemDanhGia: 3.8,
    anhBia: "/img/tt2.png",
    moTa: `Thế Giới Này Không Tồn Tại Ma Quỷ kể về câu chuyện của một chàng trai vô tình
          phát hiện ra rằng thế giới mà mình đang sống không hề bình thường
          như vẻ bề ngoài. Mặc dù mọi người đều tin rằng ma quỷ chỉ là truyền
          thuyết, cậu lại dần khám phá ra sự tồn tại của những thế lực siêu
          nhiên và những bí mật bị che giấu từ lâu. Khi các sự kiện kỳ lạ liên
          tiếp xảy ra, cậu buộc phải bước vào cuộc chiến giữa con người và
          những thực thể bí ẩn, đồng thời tìm hiểu sự thật về thân thế và sức
          mạnh của chính mình. Hành trình ấy không chỉ thử thách lòng dũng cảm
          mà còn làm thay đổi hoàn toàn nhận thức của cậu về thế giới mà mình
          đang sống.`,
    danhSachChapter: taoChapter(18),
    binhLuan: [],
  },
  {
    id: 17,
    ten: "Phát Sóng Của Siêu Việt Giả",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action"],
    luotXem: "710,000",
    luotTheo: "44,000",
    diemDanhGia: 4.0,
    anhBia: "/img/tt3.png",
    moTa: `Phát Sóng Của Siêu Việt Giả kể về hành trình của một người sở hữu năng lực
          đặc biệt khi vô tình trở thành tâm điểm của một hệ thống phát sóng
          bí ẩn kết nối với vô số thế giới khác nhau. Mỗi hành động, trận
          chiến và quyết định của anh đều được phát trực tiếp đến hàng triệu
          khán giả, mang lại danh tiếng, phần thưởng và cả những hiểm họa
          khôn lường. Để tồn tại và ngày càng trở nên mạnh mẽ, anh phải hoàn
          thành những nhiệm vụ nguy hiểm, đối mặt với các đối thủ đáng gờm và
          khám phá bí mật đằng sau hệ thống phát sóng kỳ lạ này. Trên hành
          trình đó, anh dần nhận ra rằng vận mệnh của nhiều thế giới đang gắn
          liền với chính sự tồn tại của mình.`,
    danhSachChapter: taoChapter(22),
    binhLuan: [],
  },
  {
    id: 18,
    ten: "Tỏ Tình",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Manhua", "Ngôn Tình", "Romance", "Truyện Màu"],
    luotXem: "1,020,000",
    luotTheo: "76,000",
    diemDanhGia: 4.2,
    anhBia: "/img/tt4.png",
    moTa: `Tỏ Tình kể về câu chuyện tình yêu thanh xuân đầy ngọt ngào và cảm động giữa
          những con người trẻ tuổi đang trên hành trình trưởng thành. Từ một
          cuộc gặp gỡ tình cờ, nam và nữ chính dần bước vào cuộc sống của
          nhau, cùng trải qua những khoảnh khắc vui vẻ, những hiểu lầm và cả
          những thử thách của tuổi trẻ. Khi tình cảm ngày càng sâu đậm, họ
          phải học cách đối mặt với cảm xúc thật của bản thân, vượt qua những
          rào cản trong cuộc sống và dũng cảm thổ lộ tình yêu của mình. Đây là
          câu chuyện về tình yêu, sự trưởng thành và những rung động đẹp đẽ
          của tuổi thanh xuân.`,
    danhSachChapter: taoChapter(35),
    binhLuan: [],
  },
  {
    id: 19,
    ten: "Sức Mạnh Tối Đa? Ta Lại Là Vong Linh Sư",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Manhua", "Action", "Truyện Màu"],
    luotXem: "1,340,000",
    luotTheo: "97,000",
    diemDanhGia: 4.3,
    anhBia: "/img/tt5.png",
    moTa: `Sức Mạnh Tối Đa? Ta Lại Là Vong Linh Sư kể về hành trình của một chàng trai
          bất ngờ thức tỉnh với thiên phú cấp cao nhất trong một thế giới nơi
          sức mạnh quyết định tất cả. Tuy nhiên, điều khiến mọi người kinh
          ngạc là nghề nghiệp mà cậu nhận được lại là Vong Linh Sư — một nghề
          nghiệp hiếm và đầy bí ẩn. Với khả năng triệu hồi và điều khiển đội
          quân vong linh hùng mạnh, cậu nhanh chóng thể hiện sức mạnh vượt xa
          trí tưởng tượng của người khác. Trên con đường trở nên mạnh hơn,
          cậu phải đối mặt với những kẻ thù nguy hiểm, khám phá bí mật của thế
          giới và từng bước xây dựng đội quân bất tử của riêng mình để chinh
          phục mọi thử thách.`,
    danhSachChapter: taoChapter(38),
    binhLuan: [],
  },
  {
    id: 20,
    ten: "Kiếm Thực",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Sắp Ra Mắt",
    theLoai: ["Action"],
    luotXem: "0",
    luotTheo: "0",
    diemDanhGia: 0,
    anhBia: "/img/tt8.png",
    moTa: "Truyện sắp ra mắt — nội dung sẽ được cập nhật khi phát hành chương đầu tiên.",
    danhSachChapter: [],
    binhLuan: [],
  },
  {
    id: 21,
    ten: "Cuộc Sống Hiện Đại Của Đấng Tối Cao",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Sắp Ra Mắt",
    theLoai: ["Action"],
    luotXem: "0",
    luotTheo: "0",
    diemDanhGia: 0,
    anhBia: "/img/tt7.jpg",
    moTa: "Truyện sắp ra mắt — nội dung sẽ được cập nhật khi phát hành chương đầu tiên.",
    danhSachChapter: [],
    binhLuan: [],
  },
  {
    id: 22,
    ten: "Top Ranker",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Sắp Ra Mắt",
    theLoai: ["Action"],
    luotXem: "0",
    luotTheo: "0",
    diemDanhGia: 0,
    anhBia: "/img/tt9.png",
    moTa: "Truyện sắp ra mắt — nội dung sẽ được cập nhật khi phát hành chương đầu tiên.",
    danhSachChapter: [],
    binhLuan: [],
  },
  {
    id: 23,
    ten: "Chiện Lược Chinh Phục Tòa Tháp Của Gã Hanam",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Sắp Ra Mắt",
    theLoai: ["Action"],
    luotXem: "0",
    luotTheo: "0",
    diemDanhGia: 0,
    anhBia: "/img/tt10.png",
    moTa: "Truyện sắp ra mắt — nội dung sẽ được cập nhật khi phát hành chương đầu tiên.",
    danhSachChapter: [],
    binhLuan: [],
  },
  {
    id: 24,
    ten: "Sinh Tồn Với Tư Cách Là Một Huyết Vương",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action"],
    luotXem: "620,000",
    luotTheo: "41,000",
    diemDanhGia: 4.0,
    anhBia: "/img/tt12.png",
    moTa: `Sinh Tồn Với Tư Cách Là Một Huyết Vương kể về hành trình sinh tồn của nhân
          vật chính sau khi bất ngờ tái sinh hoặc thức tỉnh với thân phận của
          một Huyết Vương — thực thể sở hữu sức mạnh vượt xa con người thông
          thường. Trong một thế giới đầy rẫy quái vật, âm mưu và những thế lực
          hùng mạnh, cậu buộc phải học cách kiểm soát sức mạnh mới của mình để
          tồn tại. Trên hành trình ấy, cậu không chỉ chiến đấu chống lại kẻ
          thù bên ngoài mà còn phải đối mặt với bản năng và số phận của chính
          mình. Với ý chí kiên cường và khát vọng sinh tồn mãnh liệt, cậu từng
          bước khám phá bí mật về Huyết Vương và vươn lên trở thành một trong
          những tồn tại mạnh nhất thế giới.`,
    danhSachChapter: taoChapter(28),
    binhLuan: [],
  },
  {
    id: 25,
    ten: "Cách Thức Sinh Tồn Của Pháo Hôi Khuê Nữ",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Cổ Đại", "Manhua", "Ngôn Tình", "Truyện Màu", "Xuyên Không"],
    luotXem: "870,000",
    luotTheo: "59,000",
    diemDanhGia: 4.1,
    anhBia: "/img/tt13.png",
    moTa: `Cách Thức Sinh Tồn Của Pháo Hôi Khuê Nữ kể về một cô gái bất ngờ xuyên không
          vào một tiểu thuyết và trở thành nhân vật phụ có số phận bi thảm.
          Biết trước kết cục không mấy tốt đẹp đang chờ đợi mình, cô quyết
          tâm thay đổi vận mệnh bằng sự thông minh, khéo léo và khả năng nắm
          bắt tình huống. Trong quá trình tìm cách sinh tồn giữa những âm mưu,
          tranh đấu và các mối quan hệ phức tạp, cô dần thay đổi cái nhìn của
          những người xung quanh và tạo nên con đường riêng cho bản thân.
          Hành trình của cô là sự kết hợp giữa yếu tố hài hước, lãng mạn và
          những màn đấu trí đầy hấp dẫn nhằm thoát khỏi số phận của một nhân
          vật pháo hôi.`,
    danhSachChapter: taoChapter(33),
    binhLuan: [],
  },
  {
    id: 26,
    ten: "Toàn Dân Chuyển Chức Duy Ta Vô Chức Tàn Nhẫn",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action", "Chuyển Sinh", "Manhua", "Truyện Màu", "Xuyên Không"],
    luotXem: "1,450,000",
    luotTheo: "112,000",
    diemDanhGia: 4.3,
    anhBia: "/img/tt11.png",
    moTa: `Toàn Dân Chuyển Chức: Duy Ta Vô Chức Tàn Nhẫn kể về một thế giới nơi mọi
          người đều có thể thức tỉnh nghề nghiệp và trở nên mạnh mẽ thông qua
          việc chuyển chức. Trong ngày thức tỉnh định mệnh, khi tất cả đều
          nhận được những nghề nghiệp đầy tiềm năng, nhân vật chính lại trở
          thành một "Vô Chức" tưởng chừng vô dụng. Tuy nhiên, ẩn sau nghề
          nghiệp đặc biệt này là một sức mạnh đáng sợ và khả năng phát triển
          vượt xa mọi quy tắc thông thường. Bị xem thường và chế giễu, cậu
          quyết định bước lên con đường trở nên mạnh nhất, đối mặt với quái
          vật, các thế lực hùng mạnh và những bí mật của thế giới để chứng
          minh rằng kẻ bị coi là yếu nhất có thể trở thành tồn tại đáng sợ
          nhất.`,
    danhSachChapter: taoChapter(42),
    binhLuan: [],
  },
  {
    id: 27,
    ten: "Phối Sắc Giã",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action"],
    luotXem: "480,000",
    luotTheo: "27,000",
    diemDanhGia: 3.8,
    anhBia:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgdHCv00x-sIEPnpm6NvBW6FO4QwM_o72ZHA&s",
    moTa: `Phối Sắc Giã kể về hành trình của một nhân vật trẻ tuổi sở hữu năng lực đặc
          biệt liên quan đến màu sắc và nghệ thuật phối sắc trong một thế giới
          đầy bí ẩn. Với khả năng biến màu sắc thành sức mạnh, cậu dần khám
          phá những bí mật bị chôn giấu và bước vào cuộc chiến giữa các thế
          lực đối địch. Trên hành trình ấy, cậu gặp gỡ những người bạn đồng
          hành, đối mặt với vô số thử thách nguy hiểm và không ngừng hoàn
          thiện năng lực của bản thân. Câu chuyện là sự kết hợp giữa phiêu
          lưu, hành động và những bí ẩn xoay quanh sức mạnh đặc biệt mà cậu
          đang nắm giữ.`,
    danhSachChapter: taoChapter(15),
    binhLuan: [],
  },

  /*Them truyen khac tai day*/
];
function layTruyenTheoId(id) {
  return danhSachTruyen.find((truyen) => truyen.id === id);
}

function layTruyenLienQuan(idHienTai, soLuong = 4) {
  const truyenHienTai = layTruyenTheoId(idHienTai);

  let ungVien = danhSachTruyen.filter((t) => t.id !== idHienTai);

  if (truyenHienTai) {
    const cungTheLoai = ungVien.filter((t) =>
      t.theLoai.some((tl) => truyenHienTai.theLoai.includes(tl)),
    );
    if (cungTheLoai.length >= soLuong) {
      ungVien = cungTheLoai;
    }
  }

  for (let i = ungVien.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ungVien[i], ungVien[j]] = [ungVien[j], ungVien[i]];
  }

  return ungVien.slice(0, soLuong);
}
