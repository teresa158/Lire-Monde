const state = {
  currentbook: null,
  books: [],
  alire: [],
  genre: [],
};

let genrecont = document.getElementById("genre-container");
let novels = document.getElementById("livres-containner");
let searchInput = document.getElementById("searchInput");

let APIURL = "http://localhost:3000";

async function fetshcategories() {
  try {
    const response = await fetch(`${APIURL}/categories`);
    if (!response.ok) throw new Error("Erreur serveur");
    state.genre = await response.json();
    creatcategoriecard();
  } catch (err) {
    console.log("Impossible de charger categories");
  }
}

async function fetshlivres() {
  try {
    const response = await fetch(`${APIURL}/livres`);
    if (!response.ok) throw new Error("Erreur serveur");
    state.books = await response.json();
    creatlivrescard(state.books);
  } catch (err) {
    console.log(err);
  }
}

function creatcategoriecard() {
  genrecont.innerHTML = "";
  state.genre.forEach((categorie) => {
    let card = document.createElement("div");
    card.className = "categorie-card";
    card.innerHTML = `
      <img src="${categorie.image}">
      <h3>${categorie.type}</h3>
    `;
    genrecont.appendChild(card);
  });
}

function creatlivrescard(booksToShow) {
  novels.innerHTML = "";
  booksToShow.forEach((book) => {
    const isFav = state.alire.some(b => b.id === book.id);
    let cardlv = document.createElement("div");
    cardlv.className = "book-card";
    cardlv.innerHTML = `
      <img src="${book.couverture}" alt="${book.titre}">
      <div class="book-info">
        <h3>${book.titre}</h3>
        <p>${book.auteur}</p>
      </div>
      <div class="book-actions">
        <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${book.id}">
          ${isFav ? '★ Sauvegardé' : '☆ À lire'}
        </button>
      </div>
    `;

    // Clic sur la carte → ouvre le modal
    cardlv.addEventListener('click', () => openModal(book));

    // Clic sur le bouton favoris
    cardlv.querySelector('.fav-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavori(book);
    });

    novels.appendChild(cardlv);
  });
}

function toggleFavori(book) {
  const index = state.alire.findIndex(b => b.id === book.id);
  if (index === -1) {
    state.alire.push(book);
  } else {
    state.alire.splice(index, 1);
  }
  creatlivrescard(state.books);
  renderFavoris();
}

function renderFavoris() {
  const container = document.getElementById("favoris-container");
  if (!container) return;

  container.innerHTML = "";

  if (state.alire.length === 0) {
    container.innerHTML = `<p style="color: var(--muted); text-align:center; padding: 20px;">Aucun livre sauvegardé.</p>`;
    return;
  }

  state.alire.forEach((book) => {
    let card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${book.couverture}" alt="${book.titre}">
      <div class="book-info">
        <h3>${book.titre}</h3>
        <p>${book.auteur}</p>
      </div>
      <div class="book-actions">
        <button class="fav-btn active" data-id="${book.id}">★ Retirer</button>
      </div>
    `;

    // Clic sur la carte → ouvre le modal
    card.addEventListener('click', () => openModal(book));

    // Clic sur le bouton retirer
    card.querySelector('.fav-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavori(book);
    });

    container.appendChild(card);
  });
}

function filterbooks(genre) {
  const filtered = state.books.filter(
    (book) => book.genre === genre
  );

  creatlivrescard(filtered);
}
function creatcategoriecard() {
  genrecont.innerHTML = "";

  // bouton ALL
  let all = document.createElement("div");
  all.className = "categorie-card";
  all.innerHTML = `<h3>All</h3>`;

  all.addEventListener("click", () => {
    creatlivrescard(state.books);
  });

  genrecont.appendChild(all);

  // autres catégories
  state.genre.forEach((categorie) => {

    let card = document.createElement("div");
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

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = state.books.filter((book) =>
    book.titre.toLowerCase().includes(value)
  );
  creatlivrescard(filtered);
});

function openModal(book) {
  const isFav = state.alire.some(b => b.id === book.id);
  document.getElementById("modal-content").innerHTML = `
    <img src="${book.couverture}" alt="${book.titre}">
    <div class="modal-info">
      <h2>${book.titre}</h2>
      <div class="modal-desc">${book.description || 'Aucune description disponible.'}</div>
      <p class="modal-meta">${book.auteur} — ${book.annee || ''}</p>
      <p class="modal-genre">${book.genre || ''}</p>
      <button class="modal-fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavoriModal(${book.id})">
        ${isFav ? '★ Sauvegardé' : 'Ajouter aux favoris'}
      </button>
    </div>
  `;
  state.currentbook = book;
  document.getElementById("modal-overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
  state.currentbook = null;
}

function toggleFavoriModal(id) {
  const book = state.books.find(b => b.id === id);
  if (!book) return;
  toggleFavori(book);
  const isFav = state.alire.some(b => b.id === id);
  const btn = document.querySelector('.modal-fav-btn');
  btn.textContent = isFav ? '★ Sauvegardé' : 'Ajouter aux favoris';
  btn.classList.toggle('active', isFav);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

fetshcategories();
fetshlivres();

const container = document.getElementById("genre-container");

document.getElementById("scrollLeft").onclick = () => {
  container.scrollBy({ left: -150, behavior: "smooth" });
};

document.getElementById("scrollRight").onclick = () => {
  container.scrollBy({ left: 150, behavior: "smooth" });
};
