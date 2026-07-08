window.onload = function () {
    const navTop = document.querySelector(".div_main.top");
    const navBottom = document.querySelector(".div_main.bottom");
    let lastScroll = 0;
    const btnScrollTop = document.getElementById("btnScrollTop");

    const commentForm = document.getElementById("commentForm");
    const commentInput = document.getElementById("commentInput");
    const commentList = document.getElementById("commentList");
    const commentStorageId = "comments_" + window.location.pathname + "_" + document.title;

    function loadComments() {
        commentList.innerHTML = "";
        let comments = JSON.parse(localStorage.getItem(commentStorageId)) || [];

        if (comments.length === 0) {
            commentList.innerHTML = '<p style="color: #aaa; font-size: 14px; text-align: center;">Chưa có bình luận nào. Hãy là người đầu tiên!</p>';
            return;
        }

        comments.reverse().forEach(item => {
            const div = document.createElement("div");
            div.className = "comment-item";
            div.innerHTML = `
        <span class="comment-time">${item.time}</span>
        <p class="comment-text">${item.text}</p>
            `;
            commentList.appendChild(div);
        });
    }

    if (commentForm && commentInput && commentList) {
        loadComments();

        commentForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const text = commentInput.value.trim();
            if (!text) return;

            const now = new Date();
            const timeString = now.toLocaleDateString("vi-VN") + " " + now.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });

            let comments = JSON.parse(localStorage.getItem(commentStorageId)) || [];
            comments.push({ text: text, time: timeString });

            localStorage.setItem(commentStorageId, JSON.stringify(comments));
            commentInput.value = "";
            loadComments();
        });
    }

    btnScrollTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", function () {
        const currentScroll = window.scrollY;
        const bottomTop = navBottom.offsetTop;

        if (window.scrollY > 300) {
            btnScrollTop.style.display = "flex";
        } else {
            btnScrollTop.style.display = "none";
        }

        if (currentScroll <= 100) {
            navTop.classList.remove("fixed-top");
            navTop.classList.remove("fixed-bottom");
            lastScroll = currentScroll;
            return;
        }

        if (currentScroll + window.innerHeight >= bottomTop) {
            navTop.classList.remove("fixed-top");
            navTop.classList.remove("fixed-bottom");
            lastScroll = currentScroll;
            return;
        }

        if (currentScroll > lastScroll) {
            navTop.classList.remove("fixed-top");
            navTop.classList.add("fixed-bottom");

            document.querySelectorAll(".check__line")
                .forEach(btn => btn.classList.add("open-up"));

        } else {
            navTop.classList.remove("fixed-bottom");
            navTop.classList.add("fixed-top");

            document.querySelectorAll(".check__line")
                .forEach(btn => btn.classList.remove("open-up"));
        }
        lastScroll = currentScroll;
    });
};
document.querySelectorAll(".check__line").forEach(btn => {
    const menu = btn.querySelector(".chapter-list");

    if (!menu) return;

    let timer;

    btn.addEventListener("mouseenter", () => {
        clearTimeout(timer);
        menu.classList.add("show");

        requestAnimationFrame(() => {
            const rect = menu.getBoundingClientRect();

            // Nếu mở lên bị đụng mép trên
            if (rect.top < 10) {
                btn.classList.remove("open-up");
            }
            // Nếu mở xuống bị đụng mép dưới
            else if (rect.bottom > window.innerHeight - 10) {
                btn.classList.add("open-up");
            }
        });
    });

    btn.addEventListener("mouseleave", () => {
        timer = setTimeout(() => {
            if (!btn.classList.contains("active")) {
                menu.classList.remove("show");
            }
        }, 1000);
    });

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.classList.toggle("active");

        if (btn.classList.contains("active")) {
            menu.classList.add("show");
        } else {
            menu.classList.remove("show");
        }
    });
});

document.addEventListener("click", () => {
    document.querySelectorAll(".check__line").forEach(btn => {
        btn.classList.remove("active");

        const menu = btn.querySelector(".chapter-list");
        if (menu) {
            menu.classList.remove("show");
        }
    });
});


// Lấy tham số URL
const params = new URLSearchParams(window.location.search);

const id = Number(params.get("id"));
const chapter = Number(params.get("chapter")) || 1;

// Tìm chapter
const chap = chapters.find(item =>
    item.id === id &&
    item.chapter === chapter
);

const truyen = danhSachTruyen.find(item =>
    item.id === id
);
if (!truyen) {
    throw new Error("Không tìm thấy truyện");
}

// Yêu thích
const loveBtns = document.querySelectorAll(".love");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const link = `/trangchitiet/trangchitiet.html?id=${truyen.id}`;

function updateLoveButton() {
    const isLoved = favorites.some(item => item.link === link);

    loveBtns.forEach(btn => {
        if (isLoved) {
            btn.innerHTML = `
            <i class="fa-solid fa-heart"></i>
            Đã thích
            `;
            btn.classList.add("is-loved");
        } else {
            btn.innerHTML = `
            <i class="fa-regular fa-heart"></i>
            Yêu thích
            `;
            btn.classList.remove("is-loved");
        }
    });
}
updateLoveButton();

loveBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        const index = favorites.findIndex(item => item.link === link);

        if (index === -1) {
            favorites.push({
                title: truyen.ten,
                image: truyen.anhBia,
                link: link
            });
        } else {
            favorites.splice(index, 1);
        }

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

        updateLoveButton();
    });
});

if (!chap) {
    document.getElementById("reader").innerHTML =
        "<h2>Không tìm thấy chapter!</h2>";
    throw new Error("Không tìm thấy chapter");
}

// Hiện tên
document.querySelectorAll(".chapter-name").forEach(el => {
    el.textContent = `Chapter ${chap.chapter}`;
});

// Hiện ảnh
const reader = document.getElementById("reader");
reader.innerHTML = "";

const html = chap.images.map(img => `
    <img src="${img}" alt="">
`).join("");

reader.innerHTML = html;

// Danh sách chapter
document.querySelectorAll(".chapter-list").forEach(list => {
    list.innerHTML = "";

    chapters
        .filter(item => item.id === id)
        .forEach(item => {
            list.innerHTML += `
                <a
                    href="doctruyen.html?id=${id}&chapter=${item.chapter}"
                    class="${item.chapter === chapter ? "active" : ""}">
                    Chapter ${item.chapter}
                </a>
            `;
        });
});