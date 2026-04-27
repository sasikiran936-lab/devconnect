let username = localStorage.getItem("username") || "";

if (!username) {
  username = prompt("Enter your username:");
  localStorage.setItem("username", username);
}

let posts = JSON.parse(localStorage.getItem("posts")) || [];

function save() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

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

      <div class="actions">
        <button onclick="likePost(${index})">
          <i class="fa-solid fa-heart"></i> ${post.likes}
        </button>

        <button onclick="deletePost(${index})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>

      <div class="comment-box">
        <input id="comment-${index}" placeholder="Write a comment">
        <button onclick="addComment(${index})">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </div>

      <div>
        ${(post.comments || []).map((c, i) => `
  <p class="comment">
    <i class="fa-solid fa-comment"></i> 
    ${c}

    <button onclick="editComment(${index}, ${i})">
      <i class="fa-solid fa-pen"></i>
    </button>

    <button onclick="deleteComment(${index}, ${i})">
      <i class="fa-solid fa-trash"></i>
    </button>
  </p>
`).join("")}
      </div>
    `;

    feed.appendChild(div);
  });
}

function addPost() {
  let input = document.getElementById("postInput");
  let text = input.value.trim();

  if (!text) return;

  posts.unshift({
  text,
  likes: 0,
  comments: [],
  user: username,
  time: new Date().toLocaleString()
});

  save();
  render();
  input.value = "";
}

function likePost(index) {
  posts[index].likes++;
  save();
  render();
}

function deletePost(index) {
  posts.splice(index, 1);
  save();
  render();
}

function addComment(index) {
  let input = document.getElementById(`comment-${index}`);
  let text = input.value.trim();

  if (!text) return;

  posts[index].comments.push(text);
  save();
  render();
}
function deleteComment(postIndex, commentIndex) {
  posts[postIndex].comments.splice(commentIndex, 1);
  save();
  render();
}

function editComment(postIndex, commentIndex) {
  let current = posts[postIndex].comments[commentIndex];

  let updated = prompt("Edit comment:", current);

  if (!updated) return;

  posts[postIndex].comments[commentIndex] = updated;
  save();
  render();
}

function changeUser() {
  let newName = prompt("Enter new username:");
  if (!newName) return;

  username = newName;
  localStorage.setItem("username", username);
}
function toggleMode() {
  document.body.classList.toggle("light");

  let mode = document.body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("mode", mode);
}

/* Load saved mode */
let savedMode = localStorage.getItem("mode");
if (savedMode === "light") {
  document.body.classList.add("light");
}
function goProfile() {
  window.location.href = "profile.html";
}

render();
