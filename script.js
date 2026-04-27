let posts = JSON.parse(localStorage.getItem("posts")) || [];
let username = localStorage.getItem("username") || prompt("Enter username:");

localStorage.setItem("username", username);

/* SAVE */
function save() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

/* RENDER */
function render() {
  let feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach((post, index) => {
    let div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <h4>${post.user}</h4>
      <p>${post.text}</p>
      <small>${post.time}</small>

      ${post.image ? `<img src="${post.image}" class="post-img">` : ""}

      <div>
        <button onclick="likePost(${index})">
          <i class="fa-solid fa-heart"></i> ${post.likes}
        </button>

        <button onclick="deletePost(${index})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>

      <div>
        <input id="comment-${index}" placeholder="Comment">
        <button onclick="addComment(${index})">Add</button>
      </div>

      <div>
        ${(post.comments || []).map((c, i) => `
          <p class="comment">
            ${c}

            <span>
              <button onclick="editComment(${index}, ${i})">Edit</button>
              <button onclick="deleteComment(${index}, ${i})">X</button>
            </span>
          </p>
        `).join("")}
      </div>
    `;

    feed.appendChild(div);
  });
}

/* ADD POST */
function addPost() {
  let text = document.getElementById("postInput").value.trim();
  let file = document.getElementById("imageInput").files[0];

  if (!text && !file) return;

  if (file) {
    let reader = new FileReader();
    reader.onload = function () {
      posts.unshift({
        text,
        image: reader.result,
        likes: 0,
        comments: [],
        user: username,
        time: new Date().toLocaleString()
      });
      save();
      render();
    };
    reader.readAsDataURL(file);
  } else {
    posts.unshift({
      text,
      image: null,
      likes: 0,
      comments: [],
      user: username,
      time: new Date().toLocaleString()
    });
    save();
    render();
  }

  document.getElementById("postInput").value = "";
  document.getElementById("imageInput").value = "";
}

/* LIKE */
function likePost(i) {
  posts[i].likes++;
  save();
  render();
}

/* DELETE POST */
function deletePost(i) {
  posts.splice(i, 1);
  save();
  render();
}

/* COMMENTS */
function addComment(i) {
  let input = document.getElementById(`comment-${i}`);
  if (!input.value.trim()) return;

  posts[i].comments.push(input.value);
  save();
  render();
}

function deleteComment(p, c) {
  posts[p].comments.splice(c, 1);
  save();
  render();
}

function editComment(p, c) {
  let val = prompt("Edit:", posts[p].comments[c]);
  if (!val) return;

  posts[p].comments[c] = val;
  save();
  render();
}

/* MODE */
function toggleMode() {
  document.body.classList.toggle("light");
  localStorage.setItem("mode", document.body.classList.contains("light"));
}

if (localStorage.getItem("mode") === "true") {
  document.body.classList.add("light");
}

/* PROFILE NAV */
function goProfile() {
  window.location.href = "profile.html";
}

render();
