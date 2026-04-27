let username = localStorage.getItem("username");

if (!username) {
  location.href = "login.html";
}

let posts = JSON.parse(localStorage.getItem("posts")) || [];

function save() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

/* TIME */
function timeAgo(date) {
  let sec = Math.floor((new Date() - new Date(date)) / 1000);
  let min = Math.floor(sec / 60);
  let hr = Math.floor(sec / 3600);
  let day = Math.floor(sec / 86400);

  if (day > 0) return day + "d ago";
  if (hr > 0) return hr + "h ago";
  if (min > 0) return min + "m ago";
  return "now";
}

/* RENDER */
function render() {
  let feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach((p, i) => {
    let div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <div onclick="openModal(${i})">
        <b>${p.user}</b>
        <p>${p.text}</p>
        <small>${timeAgo(p.time)}</small>
        ${p.image ? `<img src="${p.image}">` : ""}
      </div>

      <button onclick="likePost(${i})">♥ ${p.likedBy.length}</button>
      <button onclick="editPost(${i})">✏️</button>
      <button onclick="deletePost(${i})">🗑</button>

      <div class="comment-box">
        <input id="c-${i}">
        <button onclick="addComment(${i})">➤</button>
      </div>

      ${p.comments.map((c,j)=>`
        <div class="comment">
          ${c}
          <span>
            <button onclick="editComment(${i},${j})">✏️</button>
            <button onclick="deleteComment(${i},${j})">✖</button>
          </span>
        </div>
      `).join("")}
    `;

    feed.appendChild(div);
  });
}

/* ADD POST */
function addPost() {
  let text = postInput.value.trim();
  let file = imageInput.files[0];

  if (!text && !file) return;

  let reader = new FileReader();

  reader.onload = function () {
    posts.unshift({
      user: username,
      text,
      image: file ? reader.result : null,
      time: new Date(),
      likedBy: [],
      comments: []
    });
    save();
    render();
  };

  if (file) reader.readAsDataURL(file);
  else reader.onload();

  postInput.value = "";
  imageInput.value = "";
}

/* LIKE */
function likePost(i) {
  let idx = posts[i].likedBy.indexOf(username);
  if (idx === -1) posts[i].likedBy.push(username);
  else posts[i].likedBy.splice(idx,1);

  notify("Like updated");
  save(); render();
}

/* EDIT/DELETE */
function editPost(i) {
  let t = prompt("Edit:", posts[i].text);
  if (!t) return;
  posts[i].text = t;
  save(); render();
}

function deletePost(i) {
  posts.splice(i,1);
  notify("Deleted");
  save(); render();
}

/* COMMENTS */
function addComment(i) {
  let val = document.getElementById("c-"+i).value;
  if (!val) return;

  posts[i].comments.push(val);
  save(); render();
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
    <b>${p.user}</b>
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

/* NAV */
function goProfile(){
  location.href="profile.html";
}

/* NOTIFY */
function notify(msg){
  let d=document.createElement("div");
  d.className="notify";
  d.innerText=msg;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),1500);
}

render();
