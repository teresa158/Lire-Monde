const state = {
  currentbook: null,
  books: [],
  alire: []
};

let genre = document.getElementById("genre");
let novels = document.getElementById("livres-containner");


let APIURL = "http://localhost:3000"


async function fetshcategories() {
    try{
        const response = await fetch(APIURL/categories);
        if(!response.ok) throw new Error("Erreur serveur");
        const cat = await response.json()
        state.alire = cat;
    }catch (err){
        console.log("Impossible de charger, error")
    }
}

async function fetshlivres() {
    try{
        const response = await fetch(APIURL/livres);
        if(!response.ok) throw new Error("Erreur serveur");
        const livrs = await response.json()
        state.books= livrs
    }catch (err){
        console.log("Impossible de charger, error")
    }
}