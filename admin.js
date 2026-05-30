/* ===================================================
   admin.js — Gestion CRUD des livres (LireMonde)
   Connexion : http://localhost:3000/livres (json-server)
=================================================== */

/* ========== SÉLECTEURS ========== */
const tableBody      = document.getElementById("tableBody");
const adminModal     = document.getElementById("adminModal");
const openAddModal   = document.getElementById("openAddModal");
const cancelBtn      = document.getElementById("cancelBtn");
const modalCloseX    = document.getElementById("modalCloseX");
const bookForm       = document.getElementById("bookForm");
const saveBtn        = document.getElementById("saveBtn");
const confirmOverlay = document.getElementById("confirmOverlay");
const confirmCancel  = document.getElementById("confirmCancel");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const searchInput    = document.getElementById("searchInput");
const coverPreview   = document.getElementById("coverPreview");

const bookId      = document.getElementById("bookId");
const titleInput  = document.getElementById("title");
const authorInput = document.getElementById("author");
const genreInput  = document.getElementById("genre");
const descInput   = document.getElementById("description");
const coverInput  = document.getElementById("cover");
const alireToggle = document.getElementById("alireToggle");

const statTotal = document.getElementById("statTotal");
const statAlire = document.getElementById("statAlire");

const API = "http://localhost:3000/livres";

let allBooks = [];
let pendingDeleteId = null;

/* ========== TOAST ========== */
function toast(msg, type = "success") {
  const tc = document.getElementById("toastContainer");
  const el = document.createElement("div");
  el.className = "toast" + (type === "error" ? " error" : "");
  el.innerHTML = `
    <i class="fa-solid ${type === "error" ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
    ${msg}`;
  tc.appendChild(el);
  setTimeout(() => {
    el.style.animation = "toastOut 0.3s ease forwards";
    setTimeout(() => el.remove(), 300);
  }, 2800);
}

/* ========== STATS ========== */
function updateStats(books) {
  statTotal.textContent = books.length;
  statAlire.textContent = books.filter(b => b.alire === "true").length;
}

/* ========== FETCH ========== */
async function fetchBooks() {
  try {
    const res = await fetch(API);
    allBooks = await res.json();
    renderBooks(allBooks);
    updateStats(allBooks);
  } catch (err) {
    toast("Impossible de charger les livres.", "error");
  }
}

/* ========== RENDER ========== */
function renderBooks(books) {
  tableBody.innerHTML = "";

  if (!books.length) {
    tableBody.innerHTML = `
      <tr><td colspan="7">
        <div class="empty-state">
          <i class="fa-solid fa-book-open"></i>
          <p>Aucun livre trouvé.</p>
        </div>
      </td></tr>`;
    return;
  }

  books.forEach((book, i) => {
    const tr = document.createElement("tr");
    tr.style.animationDelay = `${i * 0.05}s`;

    tr.innerHTML = `
      <td>${book.id}</td>
      <td>
        <img src="${book.couverture}" class="table-cover"
          alt="${book.titre}"
          onerror="this.src='https://via.placeholder.com/62x88/201508/c9a96e?text=?'">
      </td>
      <td>${book.titre}</td>
      <td>${book.auteur}</td>
      <td>${book.genre || "—"}</td>
      <td>
        <span class="badge ${book.alire === "true" ? "yes" : "no"}">
          ${book.alire === "true" ? "Oui" : "Non"}
        </span>
      </td>
      <td>
        <div class="action-btns">
          <button class="edit-btn" title="Modifier">
            <i class="fa-solid fa-feather"></i>
          </button>
          <button class="delete-btn" title="Supprimer">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>`;

    tr.querySelector(".edit-btn").addEventListener("click", () => editBook(book));
    tr.querySelector(".delete-btn").addEventListener("click", () => askDelete(book.id));
    tableBody.appendChild(tr);
  });
}

/* ========== RECHERCHE ========== */
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  const filtered = allBooks.filter(b =>
    b.titre.toLowerCase().includes(q) ||
    b.auteur.toLowerCase().includes(q)
  );
  renderBooks(filtered);
});

/* ========== APERÇU COUVERTURE ========== */
coverInput.addEventListener("input", () => {
  const url = coverInput.value.trim();
  if (url) {
    coverPreview.src = url;
    coverPreview.classList.add("visible");
  } else {
    coverPreview.classList.remove("visible");
  }
});

/* ========== OUVRIR / FERMER MODAL ========== */
function openModal(title) {
  adminModal.classList.add("show");
  document.getElementById("modalTitle").innerText = title;
}

function closeModal() {
  adminModal.classList.remove("show");
  resetForm();
}

openAddModal.addEventListener("click", () => {
  openModal("Ajouter un livre");
  resetForm();
});

cancelBtn.addEventListener("click", closeModal);
modalCloseX.addEventListener("click", closeModal);
adminModal.addEventListener("click", e => {
  if (e.target === adminModal) closeModal();
});

/* ========== RESET FORMULAIRE ========== */
function resetForm() {
  bookForm.reset();
  bookId.value = "";
  alireToggle.checked = true;
  coverPreview.classList.remove("visible");
}

/* ========== SOUMETTRE (AJOUTER / MODIFIER) ========== */
bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const isEdit = !!bookId.value;

  const newBook = {
    id:          bookId.value || Date.now().toString(),
    couverture:  coverInput.value,
    titre:       titleInput.value,
    auteur:      authorInput.value,
    genre:       genreInput.value,
    description: descInput.value,
    alire:       alireToggle.checked ? "true" : "false"
  };

  saveBtn.classList.add("loading");
  saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Enregistrement…`;

  try {
    if (isEdit) {
      await fetch(`${API}/${bookId.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook)
      });
      toast("Livre modifié avec succès.");
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook)
      });
      toast("Livre ajouté avec succès.");
    }

    await fetchBooks();
    closeModal();

  } catch (err) {
    toast("Une erreur est survenue.", "error");

  } finally {
    saveBtn.classList.remove("loading");
    saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Enregistrer`;
  }
});

/* ========== MODIFIER ========== */
function editBook(book) {
  openModal("Modifier un livre");
  bookId.value        = book.id;
  titleInput.value    = book.titre;
  authorInput.value   = book.auteur;
  genreInput.value    = book.genre || "";
  descInput.value     = book.description;
  coverInput.value    = book.couverture;
  alireToggle.checked = book.alire === "true";

  if (book.couverture) {
    coverPreview.src = book.couverture;
    coverPreview.classList.add("visible");
  }
}

/* ========== CONFIRMATION SUPPRESSION ========== */
function askDelete(id) {
  pendingDeleteId = id;
  confirmOverlay.classList.add("show");
}

confirmCancel.addEventListener("click", () => {
  confirmOverlay.classList.remove("show");
  pendingDeleteId = null;
});

confirmDeleteBtn.addEventListener("click", async () => {
  if (!pendingDeleteId) return;
  confirmOverlay.classList.remove("show");

  try {
    const res = await fetch(`${API}/${pendingDeleteId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Suppression échouée");
    toast("Livre supprimé.");
    await fetchBooks();
  } catch {
    toast("Échec de la suppression.", "error");
  }

  pendingDeleteId = null;
});

/* ========== INITIALISATION ========== */
fetchBooks();