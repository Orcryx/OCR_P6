//Pour importer le fichier sauce(du dossier models) pour pouvoir utiliser notre nouveau modèle Mongoose dans l'application 
const sauce = require('../models/sauce');

//Importer la méthode fs
const fs = require('fs');
const { error } = require('console');

//Coeur du code (ou logique métier) de la fonction POST 
exports.createSauce = (req, res, next) => {
  //Parser l'objet requete car envoyer sous forme json en chaine de caractères
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  // Pour protéger la base de données on va utilisé un token
  delete sauceObject._userId;
  const Sauce = new sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Le chemin du ficher devient dossier du projet qui stock l'image + nom du fichier
  });
  Sauce.save()
    .then(() => {res.status(201).json({message:'Sauce enregistré.'})})
    .catch(error => {res.status(400).json[{error}]});
};

//Coeur du code de la fonction PUT
exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
// par sécurité on supprimer le userId on utilisera le token
    delete sauceObject.userId;
    sauce.findOne({_id: req.params.id}) // On va vérifier que c'est bien un objet de l'utilisateur qui fait la requête, si oui then sinon catch, donc on récupère L'iD
      .then((sauce)=> {
        // si l'USERid de l'utilisateur est différent de l'userId qui est dans le token d'authentification
        if(sauce.userId != req.auth.userId) {
          console.log(sauce.userId);
          res.status(401).json({message:'Non-autorisé'});
        } else {
          sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message:'Sauce Modifiée.'}))
            .catch(error => res.status(401).json({error}));
        }
      })
      .catch((error)=> {res.status(400).json({error});
    });
};

//Coeur du code de la fonction DELETE
exports.deleteSauce =(req, res, next) => {
  sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      if (sauce.userId != req.auth.userId){
        res.status(401).json({message: 'Action non authorisée'});
      } else {
        // supprimer l'objet de la BDD et l'image dans le projet
        const filename = sauce.imageUrl.split('/images/')[1];
        // utiliser la méthode fs et gérer le callback
        fs.unlink(`images/${filename}`, ()=> {
          sauce.deleteOne({ _id: req.params.id})
            .then(() => {res.status(200).json({message:'Sauce supprimée'})})
            .catch(error => res.status(401).json({error}));
        });
      }
    })
    .catch(error => {
      res.status(500).json({error});
    });
};

//Coeur du code de la fonction GET pour un ID
/** Retrouver les informations en fonction de l'ID + ":" dit a express que la route est dynamique et qu'il faut aller le paramètre qui suite le : */
exports.displayIDSauce = (req, res, next) =>{
    sauce.findOne({ _id: req.params.id}) // findOne dans notre modèle sauce cherche un seul objet + on lui passe un objet de comparaison qui est l'_id de la base de données = au paramètre de la requête
    .then(sauce => res.status(200).json(sauce)) // 
    .catch(error => res.status(404).json({error})); // 404 = objet non trouvé
};

//Coeur du code de la fonction GET
/** Afficher les données depuis la base de données avec une promesse de la méthode find() dans notre modèle Mongoose */
exports.displaySauce = (req, res, next) =>{
    sauce.find() // Pour trouver tout ce qu'il y a dans la base dans la collection sauce / "sauces" de mongoDb et tous les retourner
      .then(sauce => res.status(200).json(sauce)) // retourne l'objet qui se trouve dans la collection "sauces" de mongoDB
      .catch(error => res.status(400).json({error}));
};

//Coeur du code de la fonction POST
/** Permettre à l'utilisateur de poster une note avec dislike/like */ 
exports.noteSauce=(req, res, next) =>{
  sauce.findOne({ _id: req.params.id}) // findOne dans notre modèle sauce cherche un seul objet + on lui passe un objet de comparaison qui est l'_id de la base de données = au paramètre de la requête
    .then(noteSaute => {
        switch (req.body.like){
          //Si l'utilisateur aime la sauce ET que l'userId de la requête n'est pas présent dans la liste des ID du tableau usersLiked de MongoDB
          case 1:
            if (!noteSaute.usersLiked.includes(req.body.userId) && req.body.like === 1){
              sauce.updateOne({ _id: req.params.id},
                {
                  $inc: {likes:1}, $push: {usersLiked: req.body.userId}
                })
                .then(()=> res.status(201).json({message:'Add a like.'}))
                .catch(error => res.status(400).json({error}));
            }
          break;
          // Si l'utilisateur n'aime pas la sauce ET que l'userId de la requête n'est pas présent dans la liste des ID du tableau userDisliked de MongoDB
          case -1:
            if (!noteSaute.usersDisliked.includes(req.body.userId) && req.body.like === -1){
              sauce.updateOne({ _id: req.params.id},
                {
                  $inc: {dislikes:1}, $push: {usersDisliked: req.body.userId}
                })
                .then(()=> res.status(201).json({message:'Add a dislike.'}))
                .catch(error => res.status(400).json({error}));
            }
          break;
          //Annuler un like en fonction de userId
          case 0:
            if (noteSaute.usersLiked.includes(req.body.userId)){
              sauce.updateOne({ _id: req.params.id},
                {
                  $inc: {likes:-1}, $pull: {usersLiked: req.body.userId}
                })
                .then(()=> res.status(201).json({message:'Remove user like.'}))
                .catch(error => res.status(400).json({error}));
            }
            //Annuler un dislike en fonction de userId
            if (noteSaute.usersDisliked.includes(req.body.userId)){
              sauce.updateOne({ _id: req.params.id},
                {
                  $inc: {dislikes:-1}, $pull: {usersDisliked: req.body.userId}
                })
                .then(()=> res.status(201).json({message:'Remove user dislike.'}))
                .catch(error => res.status(400).json({error}));
            }
        } // fin du switch
    })
    .catch(error => res.status(404).json({error}));
};