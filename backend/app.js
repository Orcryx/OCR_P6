// Importer Mongoose & MongoDB
const mongoose = require('mongoose');
// Importer express (qui a été installé dans le paclage)
const express = require('express');
//Importer path du server pour créer des chemins vers des dossiers interne du projet
//const path = require('path');
// importer le router qui se trouve dans le fichier sauce.js
const sauceRoutes = require('./routes/sauce');
//importer le router qui se trouve dans le fichier user.js
//const userRoutes = require('./routes/user');

//server Mongodb - a mettre en dessous de la déclaration de la constante app
mongoose.connect('mongodb+srv://SuperSauce:6epOKSoHMM1Kxqg2@piiquante.oswwmhv.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connection to MongoDB successful !'))
  .catch(() => console.log('Connection to MongoDB failed !'));

// l'application sera dans app  - on appelle la méthode express ce qui permet de créer une application de type express
const app = express();

  //Ce middleware ne prend pas d'adresse en premier paramètre, afin de s'appliquer à toutes les routes
/** CORS */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // * -> autorise tous les utilisateurs de n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
    next();
  });
//Ce middleware intercepte toutes les requêtes de type JSON et les mets a disposition sur l'objet req.body
app.use(express.json());

//donner le chemin  API qui sera utiliser par le router pour les routes qui sont dans le fichier sauce.js de controllers
app.use('/api/sauce', sauceRoutes);
//donner le chemin de l'API qui sera utiliser pour (enregistrer) utiliser les routes qui sont dans le fichier user.js
//app.use('/api/auth', userRoutes);
// Ajouter une route pour récupérer les images du projet utilisée par le serveur / BDD et préparer un chemin = chemin + nom image
//app.use('/images', express.static(path.join(__dirname,'images')));
//exporter l'application app pour pouvoir y accéder depuis les autres fichier du projet (comme le serveur node)
module.exports = app;