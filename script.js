const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

$("#year").textContent = new Date().getFullYear();

const menuBtn = $("#menuBtn");
const nav = $("#nav");
menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
$$("nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

const themeBtn = $("#themeBtn");
if(localStorage.getItem("campusTheme") === "dark"){
  document.body.classList.add("dark");
  themeBtn.textContent = "☀";
}
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  localStorage.setItem("campusTheme", dark ? "dark" : "light");
  themeBtn.textContent = dark ? "☀" : "☾";
});

const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalText = $("#modalText");
function openModal(title,text){
  modalTitle.textContent = title;
  modalText.textContent = text;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
}
function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
}
$$(".learn-more").forEach(btn => btn.addEventListener("click", () => openModal(btn.dataset.title,btn.dataset.text)));
$("#closeModal").addEventListener("click",closeModal);
$("#modalOk").addEventListener("click",closeModal);
modal.addEventListener("click",e => { if(e.target === modal) closeModal(); });
document.addEventListener("keydown",e => { if(e.key === "Escape") closeModal(); });

$$(".resource").forEach(btn => btn.addEventListener("click", () => {
  openModal(btn.dataset.resource, "Cette section est prête à recevoir tes propres PDF, liens, fiches et ressources. Tu peux modifier facilement le contenu dans index.html.");
}));

const form = $("#todoForm");
const input = $("#todoInput");
const list = $("#todoList");
let todos = JSON.parse(localStorage.getItem("campusTodos") || "[]");

function saveTodos(){ localStorage.setItem("campusTodos", JSON.stringify(todos)); }

function renderTodos(){
  list.innerHTML = "";
  todos.forEach((todo,index) => {
    const li = document.createElement("li");
    li.className = "todo" + (todo.done ? " done" : "");
    li.innerHTML = `<input type="checkbox" ${todo.done ? "checked" : ""} aria-label="Tâche terminée">
      <label></label><button class="delete" aria-label="Supprimer">✕</button>`;
    li.querySelector("label").textContent = todo.text;
    li.querySelector("input").addEventListener("change", () => {
      todos[index].done = !todos[index].done; saveTodos(); renderTodos();
    });
    li.querySelector(".delete").addEventListener("click", () => {
      todos.splice(index,1); saveTodos(); renderTodos();
    });
    list.appendChild(li);
  });
  const done = todos.filter(t => t.done).length;
  $("#progressBar").style.width = todos.length ? `${done/todos.length*100}%` : "0%";
  $("#progressText").textContent = `${done} tâche${done > 1 ? "s" : ""} terminée${done > 1 ? "s" : ""} sur ${todos.length}`;
}
form.addEventListener("submit",e => {
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  todos.push({text,done:false});
  input.value = "";
  saveTodos(); renderTodos();
});
renderTodos();
