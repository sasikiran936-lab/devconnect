let username = localStorage.getItem("username");

if (!username) {
  window.location.href = "login.html";
}

let posts = JSON.parse(localStorage.getItem("posts")) || [];

function save() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

/* TIME */
function timeAgo(date) {
  let sec = Math.floor((new Date() - new Date(date)) / 1000);
  let units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60]
  ];

  for (let [name, seconds] of units) {
    let count = Math.floor(sec / seconds);
    if (count > 0) return count + " " + name + " ago";
  }
  return "Just now";
}

/* RENDER */
function render() {
  let feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach((post, i) => {
    let liked = post.likedBy.includes(username);

    let div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <div onclick="openModal(${i})">
        <h4>${post.user}</h4>
        <p>${post.text}</p>
        <small>${timeAgo(post.time)}</small>
        ${post.image ? `<img src="${post.image}" class="post-img">` : ""}
      </div>

      <div class="actions">
        <button onclick="likePost(${i})">
          ❤️ ${post.likedBy.length}
        </button>

        <button onclick="editPost(${i})">✏️</button>
        <button onclick="deletePost(${i})">🗑️</button>
      </div>

      <div class="comment-box">
        <input id="c-${i}">
        <button onclick="addComment(${i})">➤</button>
      </div>

      ${post.comments.map((c, j) => `
        <div class="comment">
          ${c}
          <span>
            <button onclick="editComment(${i},${j})">✏️</button>
            <button onclick="deleteComment(${i},${j})">❌</button>
          </span>
        </div>
      `).join("")}
    `;

    feed.appendChild(div);
  });
}

/* POST */
function addPost() {
  let text = postInput.value;
  let file = imageInput.files[0];

  if (!text && !file) return;

  let reader = new FileReader();

  reader.onload = function () {
    posts.unshift({
      text,
      image: file ? reader.result : null,
      user: username,
      time: new Date(),
      likedBy: [],
      comments: []
    });
    save();
    render();
  };

  if (file) reader.readAsDataURL(file);
  else reader.onload();
}

/* LIKE */
function likePost(i) {
  let idx = posts[i].likedBy.indexOf(username);

  if (idx === -1) posts[i].likedBy.push(username);
  else posts[i].likedBy.splice(idx, 1);

  notify("Updated like");
  save();
  render();
}

/* EDIT */
function editPost(i) {
  let t = prompt("Edit:", posts[i].text);
  if (!t) return;
  posts[i].text = t;
  save();
  render();
}

/* DELETE */
function deletePost(i) {
  posts.splice(i,1);
  notify("Deleted");
  save();
  render();
}

/* COMMENTS */
function addComment(i) {
  let val = document.getElementById("c-"+i).value;
  if (!val) return;

  posts[i].comments.push(val);
  notify("Comment added");
  save();
  render();
}

function editComment(i,j){
  let val = prompt("Edit:", posts[i].comments[j]);
  if (!val) return;
  posts[i].comments[j]=val;
  save(); render();
}

function deleteComment(i,j){
  posts[i].comments.splice(j,1);
  save(); render();
}

/* MODAL */
function openModal(i){
  let p = posts[i];
  modalBody.innerHTML = `
    <h3>${p.user}</h3>
    <p>${p.text}</p>
    ${p.image ? `<img src="${p.image}" style="width:100%">` : ""}
  `;
  modal.style.display="block";
}

function closeModal(){
  modal.style.display="none";
}

/* MODE */
function toggleMode(){
  document.body.classList.toggle("light");
}

/* NOTIFY */
function notify(msg){
  let d=document.createElement("div");
  d.className="notify";
  d.innerText=msg;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),2000);
}

render();
