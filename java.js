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
    let cardlv = document.createElement("div");

    cardlv.className = "book-card";

    cardlv.innerHTML = `
      <img src="${book.couverture}" alt="${book.titre}">
      
      <div class="book-info">
        <h3>${book.titre}</h3>
        <p>${book.auteur}</p>
      </div>


    `;

    novels.appendChild(cardlv);
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
