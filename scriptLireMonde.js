const state = {
  currentbook: null,
  books: [],
  alire: [],
  genre: [],
};

const genrecont = document.getElementById("genre-container");
const novels = document.getElementById("livres-containner");
const searchInput = document.getElementById("searchInput");
const loading = document.getElementById("loading");

const APIURL = "http://localhost:3000";


// ================= START =================

fetshcategories();
fetshlivres();
fetchFavoris();


// ================= FETCH CATEGORIES =================

async function fetshcategories() {
  try {


    const res = await fetch(`${APIURL}/categories`);
    state.genre = await res.json();

    creatcategoriecard();
  } catch (err) {
    console.error(err);
  
  }
}


// ================= FETCH BOOKS =================

async function fetshlivres() {
  try {
   

    const res = await fetch(`${APIURL}/livres`);
    state.books = await res.json();

    creatlivrescard(state.books);
  } catch (err) {
    console.error(err);
  
  }
}


// ================= FETCH FAVORIS =================

async function fetchFavoris() {
  try {
    const res = await fetch(`${APIURL}/favoris`);
    state.alire = await res.json();

    renderFavoris();
    creatlivrescard(state.books);
  } catch (err) {
    console.error(err);
  }
}


// ================= CATEGORIES =================

function creatcategoriecard() {
  genrecont.innerHTML = "";

  const all = document.createElement("div");
  all.className = "categorie-card";

  all.innerHTML = `
    <img src="images/image copy 15.png">
    <h3>All</h3>
  `;

  all.addEventListener("click", () => {
    creatlivrescard(state.books);
  });

  genrecont.appendChild(all);

  state.genre.forEach((categorie) => {
    const card = document.createElement("div");
    card.className = "categorie-card";

    card.innerHTML = `
      <img src="${categorie.image}">
      <h3>${categorie.type}</h3>
    `;

    card.addEventListener("click", () => {
      filterbooks(categorie.type);
    });

    genrecont.appendChild(card);
  });
}


// ================= BOOKS =================

function creatlivrescard(booksToShow) {
  novels.innerHTML = "";

  booksToShow.forEach((book) => {
    const isFav = state.alire.some((b) => b.id === book.id);

    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <img src="${book.couverture}">
      
      <div class="book-info">
        <h3>${book.titre}</h3>
        <p>${book.auteur}</p>
      </div>

      <div class="book-actions">
        <button class="fav-btn ${isFav ? "active" : ""}">
          ${isFav ? "★ Sauvegardé" : "☆ À lire"}
        </button>
      </div>
    `;

    card.addEventListener("click", () => openModal(book));

    const favBtn = card.querySelector(".fav-btn");

    favBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavori(book);
    });

    novels.appendChild(card);
  });
}


// ================= FAVORIS (NO RELOAD FIXED) =================

async function toggleFavori(book) {
  const exists = state.alire.find((b) => b.id === book.id);

  try {
    if (!exists) {
      await fetch(`${APIURL}/favoris`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });

      state.alire.push(book);
    } else {
      await fetch(`${APIURL}/favoris/${book.id}`, {
        method: "DELETE",
      });

      state.alire = state.alire.filter((b) => b.id !== book.id);
    }

    renderFavoris();
    creatlivrescard(state.books);

    if (state.currentbook) {
      openModal(state.currentbook);
    }

  } catch (err) {
    console.error(err);
  }
}


// ================= FAVORIS UI =================

function renderFavoris() {
  const container = document.getElementById("favoris-container");
  if (!container) return;

  container.innerHTML = "";

  if (state.alire.length === 0) {
    container.innerHTML = `
      <p style="text-align:center;padding:20px">
        Aucun livre sauvegardé.
      </p>
    `;
    return;
  }

  state.alire.forEach((book) => {
    const card = document.createElement("div");

    card.className = "book-card";

    card.innerHTML = `
      <img src="${book.couverture}">
      
      <div class="book-info">
        <h3>${book.titre}</h3>
        <p>${book.auteur}</p>
      </div>

      <div class="book-actions">
        <button class="fav-btn active">★ Retirer</button>
      </div>
    `;

    card.addEventListener("click", () => openModal(book));

    card.querySelector(".fav-btn").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavori(book);
    });

    container.appendChild(card);
  });
}


// ================= FILTER =================

function filterbooks(genre) {
  const filtered = state.books.filter(
    (book) => book.genre === genre
  );

  creatlivrescard(filtered);
}


// ================= SEARCH =================

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();

    const filtered = state.books.filter((book) =>
      book.titre.toLowerCase().includes(value)
    );

    creatlivrescard(filtered);
  });
}


// ================= MODAL (FIXED STYLE) =================

function openModal(book) {
  state.currentbook = book;

  const isFav = state.alire.some((b) => b.id === book.id);

  document.getElementById("modal-content").innerHTML = `
    <img src="${book.couverture}">
    
    <div class="modal-info">
      <h2>${book.titre}</h2>

      <div class="modal-desc">
        ${book.description || "Aucune description"}
      </div>

      <p>${book.auteur}</p>
      <p>${book.genre}</p>

      <button id="modalFavBtn" class="modal-fav-btn ${isFav ? "active" : ""}">
        ${isFav ? "★ Sauvegardé" : "☆ Ajouter aux favoris"}
      </button>
    </div>
  `;

  document.getElementById("modal-overlay").classList.add("open");

  document.getElementById("modalFavBtn").addEventListener("click", (e) => {
    e.preventDefault();
    toggleFavori(book);
  });
}


// ================= CLOSE MODAL =================

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
  state.currentbook = null;
}


// ================= ESC =================

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});