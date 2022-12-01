// Importer mongoose pour faciliter les traitements avec la base de données MongoDB
const mongoose = require('mongoose');

// importer le plugging mongoose-unique-valdator - pour s'assurer d'avoir un check des valeurs unique dans la base de données
const uniqueValidator = require('mongoose-unique-validator');

//Créer le modèle de données de l'utilisation qui sera utiliser par la base de données 
const userSchema = mongoose.Schema({
    email: {type: String, required : true, unique: true}, //unique pour qu'il n'y a pas deux adresses mail identique dans la BDD
    password: {type:String, required : true}
});

//Ajouter le pluggin mongoose-unique-validator à la méthode userSchema
userSchema.plugin(uniqueValidator);

// Exporter le modèle à l'ensemble du projet
module.exports = mongoose.model('User', userSchema);
