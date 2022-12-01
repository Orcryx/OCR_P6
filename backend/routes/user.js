///importer express
const express = require('express');
//importer la méthode Router de express
const router = express.Router();

//Associer les fonction au routeur
const userController = require('../controllers/user');


//Une route pour envoyer les informations de création d'un utilisateur dans la base de données - de type POST
router.post('/signup', userController.signup); // on ne met pas de parenthèse car on applique à userController mais on appel pas la fonction

//Une route pour envoyer les informations de connection d'un utilisateur présent dans la base de données  - de type POST
router.post('/login', userController.login); // on ne met pas de parenthèse car on applique à userController mais on appel pas la fonction

// exporter le module de router à l'ensemble du projet
module.exports = router;