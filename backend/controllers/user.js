// Importer le modèle de données des utilisateurs
const User = require('../models/user');
//Importer le package Bcrypt
const bcrypt = require('bcrypt');
//importer le package jsonwebToken pour gérer les tokens
const jwt = require('jsonwebtoken');

//Coeur du code pour enregistrer un nouvelle utilisateur
exports.signup = (req, res, next) => {
    // commencer par hasher le mot de passe - function asynchrone et longue à exécuter qui renvoie une promesse
    bcrypt.hash(req.body.password, 10) //  crypter le mot de passe - le nombre correspond au nombre de tour de hash et- min 10
        .then(hash => { // fonction qui va créer un nouvel utilisateur avec le corps de la requête
            const user = new User({ //Créer un nouvel utilisateur
                email: req.body.email, //adresse email du corps de la requete
                password: hash // mettre le mot de passe générer par le hash
            });
            user.save() //Enregistrer l'utilisateur
                .then(() => res.status(201).json({mesage:'Utilisateur créé.'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error =>res.status(500).json({error}));
};

//Coeur du code pour authentifier et connecter un utilisateur existant
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password) // Utiliser la fonction compare de bscrypt pour comparer le mot de passe entré par l'utilisateur avec le Hash enregistré dans la base de données.
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); // Message flou pour protéger les données personnel (RGPD)
                    }
                    res.status(200).json({
                        userId: user._id,
                        //la fonction sign de jsonwebToken prends 3 arguments :
                        token: jwt.sign( // on aussi saisir "TOKEN" en dur pour tester
                            {userId : user._id}, //  user - l'identifiant de l'utilisateur 
                            'RANDOM_TOKEN_SECRET', //la clé secrete pour l'encodage
                            {expiresIn : '24h'} // argument de configuration qui permet d'expirer le token en 24h
                        )  
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); // erreur de la requête au niveau du serveur
 };


 