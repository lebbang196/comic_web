window.onload = function () {
    const navTop = document.querySelector(".div_main.top");
    const navBottom = document.querySelector(".div_main.bottom");
    let lastScroll = 0;
    const btnScrollTop = document.getElementById("btnScrollTop");
    const loveBtns = document.querySelectorAll(".love");
    const storyId = "fav_" + window.location.pathname + "_" + document.title;

    function updateLoveUI(loved) {
        loveBtns.forEach(btn => {
            if (loved) {
                btn.classList.add("is-loved");
                btn.innerHTML = '<i class="fa-solid fa-heart" style="color: #ef4444;"></i> Đã thích';
            } else {
                btn.classList.remove("is-loved");
                btn.innerHTML = '<i class="fa-regular fa-heart"></i> Yêu thích';
            }
        });
    }

    let isLoved = localStorage.getItem(storyId) === "true";
    updateLoveUI(isLoved);

    loveBtns.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            isLoved = !isLoved;
            localStorage.setItem(storyId, isLoved);
            updateLoveUI(isLoved);
        });
    });
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
function toggleFavorite(title, link, image, btn) {
    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    let index = favorites.findIndex(
        item => item.link === link
    );

    if (index === -1) {
        favorites.push({ title, link, image });
        btn.innerHTML = "❤️";
    } else {
        favorites.splice(index, 1);
        btn.innerHTML = "🤍";
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
}
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
