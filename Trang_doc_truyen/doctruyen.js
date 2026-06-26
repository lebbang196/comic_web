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
        } else {
            navTop.classList.remove("fixed-bottom");
            navTop.classList.add("fixed-top");
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