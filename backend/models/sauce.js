const mongoose = require('mongoose');

// créer un schéma pour le type de données a utiliser dans la base de données - ce schéma servira de modèle
//Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose
const sauceSchema = mongoose.Schema(
    {
        userId: { type: String, required: true }, // Identifiant MongoDB unique de l'utilisateur qui a créé la sauce
        name: { type: String, required: true }, // Nom de la sauce
        manufacturer: { type: String, required: true }, // Fabriquant de la sauce
        description: { type: String, required: true }, // Description de la sauce
        mainPepper: { type: String, required: true }, // Le principal ingrédient épicé de la sauce
        imageUrl: { type: String, required: true }, // URL de l'image de la sauce téléchargée par l'utilisateur
        heat: { type: Number, required: true }, // Nombre entre 1 et 10 décrivant la sauce
        likes: { type: Number, default: 0, required: true }, // Nombre d'utilisateurs qui aiment (= like) la sauce
        dislikes: { type: Number, default: 0, required: true }, // Nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce
        usersLiked: { type: Array, default: [], required: true }, // Tableau des userId qui ont aimé la sauce
        usersDisliked: { type: Array, default: [], required: true }, // Tableau des userId qui n'ont pas aimé la sauce
    });

//Exploiter le schéma comme modèle pour lire et écrire dans la base de données
// Exporter le modèle  en tant que modèle Mongoose, pour pouvoir intéragir avec la base de données.
module.exports = mongoose.model('Sauce', sauceSchema);