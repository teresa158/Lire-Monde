# 📚 LireMonde — Plateforme de Lecture Numérique

> Une bibliothèque numérique élégante à l'esthétique gothique-dorée, permettant de parcourir, filtrer et gérer une collection de livres classiques et contemporains.

---

## Aperçu

LireMonde est une application web front-end connectée à une API REST locale (json-server). Elle propose une interface de lecture immersive avec une typographie soignée (Cinzel & EB Garamond), une palette sombre aux accents dorés, et des fonctionnalités de gestion de bibliothèque personnelle.

---

## Fonctionnalités

### Page principale (`index.html`)
- **Hero section** avec présentation visuelle de la plateforme
- **Carrousel de catégories** filtrant les livres par genre (Roman classique, Gothique, Dark Romance, Poésie…)
- **Bibliothèque complète** affichant tous les livres en grille
- **Barre de recherche** pour filtrer par titre en temps réel
- **Favoris / À lire** — section dédiée aux livres sauvegardés
- **Modal de détail** avec couverture, description, auteur, genre et bouton favori

### Page admin (`admin.html`)
- **Tableau de gestion** listant tous les livres (ID, couverture, titre, auteur, genre)
- **Ajout de livre** via modal avec formulaire complet
- **Modification** d'un livre existant (préremplissage du formulaire)
- **Suppression** avec dialogue de confirmation
- **Aperçu de couverture** en temps réel depuis une URL
- **Recherche** dans le tableau par titre ou auteur
- **Compteur** du nombre total de livres
- **Toasts** de notification (succès / erreur)

---

## Structure du projet

```
LireMonde/
│
├── index.html               # Page principale (bibliothèque publique)
├── admin.html               # Interface d'administration
├── a-lire.html              # Page des favoris / à lire
│
├── style.css                # Styles globaux + page principale
├── admin.css                # Styles spécifiques à l'admin
│
├── scriptLireMonde.js       # Logique de la page principale
├── admin.js                 # Logique de l'interface admin
│
├── db.json                  # Base de données json-server
│
└── images/                  # Couvertures et assets visuels
```

---

## Technologies utilisées

| Technologie | Rôle |
|---|---|
| HTML5 / CSS3 | Structure et mise en page |
| JavaScript (Vanilla ES6+) | Logique front-end, fetch API |
| [json-server](https://github.com/typicode/json-server) | API REST locale simulée |
| [Font Awesome 6](https://fontawesome.com/) | Icônes |
| Google Fonts (Cinzel, EB Garamond) | Typographie |

---

## Installation et lancement

### Prérequis
- [Node.js](https://nodejs.org/) installé
- `json-server` installé globalement

```bash
npm install -g json-server
```

### Démarrer le serveur

```bash
json-server --watch db.json --port 3000
```

L'API sera disponible sur `http://localhost:3000`.

### Ouvrir l'application

Ouvrez `index.html` dans votre navigateur (ou utilisez une extension comme Live Server dans VS Code).

---

## Endpoints API

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/livres` | Récupérer tous les livres |
| `POST` | `/livres` | Ajouter un livre |
| `PUT` | `/livres/:id` | Modifier un livre |
| `DELETE` | `/livres/:id` | Supprimer un livre |
| `GET` | `/categories` | Récupérer les catégories |
| `GET` | `/favoris` | Récupérer les favoris |
| `POST` | `/favoris` | Ajouter aux favoris |
| `DELETE` | `/favoris/:id` | Retirer des favoris |

---

## Modèle de données

### Livre (`/livres`)

```json
{
  "id": "1111",
  "titre": "Madame Bovary",
  "auteur": "Gustave Flaubert",
  "genre": "ROMAN CLASSIQUE",
  "description": "Description du livre...",
  "couverture": "images/cover.png",
  "alire": "true"
}
```

### Catégorie (`/categories`)

```json
{
  "id": "0001",
  "type": "ROMAN CLASSIQUE",
  "image": "images/category.jpeg"
}
```

---

## Genres disponibles

- Roman Philosophique
- Roman Classique
- Roman Historique
- Roman Gothique
- Dark Romance
- Livres Poétiques
- Science-fiction
- Horreur
- Romance
- Policier

---

## Crédits

Projet développé en 2026 — **LireMonde**  
Contact : LireMonde@gmail.com