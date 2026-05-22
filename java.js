const state = {
  currentbook: null,
  books: [],
  alire: [],
  genre: [],
};

let genrecont = document.getElementById("genre-container");
let novels = document.getElementById("livres-containner");
let searchInput = document.getElementById("searchInput");
let favorisContainer = document.getElementById("favoris-container");

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
// Remplace creatlivrescard par :
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

    // Clic sur le bouton favoris
    cardlv.querySelector('.fav-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavori(book);
    });

    novels.appendChild(cardlv);
  });
}

// Ajouter / retirer un livre des favoris
function toggleFavori(book) {
  const index = state.alire.findIndex(b => b.id === book.id);
  if (index === -1) {
    state.alire.push(book);
  } else {
    state.alire.splice(index, 1);
  }
  creatlivrescard(state.books); // rafraîchir les cartes
  renderFavoris();              // rafraîchir la section favoris
}

// Afficher la section favoris
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
    card.querySelector('.fav-btn').addEventListener('click', () => {
      toggleFavori(book);
    });
    container.appendChild(card);
  });
}

function filterbooks(genre) {
  if (genre === "All") {
    creatlivrescard(state.books);
    return;
  }

  const filtered = state.books.filter((book) => book.genre === genre);

  creatlivrescard(filtered);
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = state.books.filter((book) =>
    book.titre.toLowerCase().includes(value),
  );

  creatlivrescard(filtered);
});

fetshcategories();
fetshlivres();
