//Importer express
const express = require('express');

//importer le router
const router = express.Router();

//Importer le middleware d'authentification par token - à mettre avant le gestionnaire de route
const auth = require('../middleware/auth'); 

//Importer le middleware multer pour ajouter des fichiers entrants aux routes
const multer = require('../middleware/multer-config');

//Importer les contrôler pour avoir le code lié au routes
const sauceControllers = require('../controllers/sauce')

//Les routes, le code de contrôle se trouve dans controllers/sauce.js
router.post('/', auth, multer, sauceControllers.createSauce); // On ne met pas les parenthèse à la fonction, car on l'applique a la route mais on ne l'applique pas

router.put('/:id', auth, multer, sauceControllers.updateSauce); // On ne met pas les parenthèse à la fonction, car on l'applique a la route mais on ne l'applique pas

router.delete('/:id', auth, multer, sauceControllers.deleteSauce); // On ne met pas les parenthèse à la fonction, car on l'applique a la route mais on ne l'applique pas
  
router.get('/:id', auth, sauceControllers.displayIDSauce); // On ne met pas les parenthèse à la fonction, car on l'applique a la route mais on ne l'applique pas
  
router.get('/', auth, sauceControllers.displaySauce); // On ne met pas les parenthèse à la fonction, car on l'applique a la route mais on ne l'applique pas
  
router.post('/:id/like', auth, sauceControllers.noteSauce);
module.exports = router;