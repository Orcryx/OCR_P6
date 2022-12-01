//importer multer
const multer = require('multer');

// dictionnaire de mime_type pour gérer les formats/extensions des fichiers
const mime_types = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
};

// Objet de configuration de multer avec la méthode diskStorage qui configure le chemin et le nom de fichiers entrants
const storage = multer.diskStorage({
    //Besoin de deux éléments
    destination:(req, file, callback)=> {
        callback(null, 'images'); // on stock dans le dossier du projet réservé à cet effet
    },
    filename: (req, file, callback)=>{
        const name = file.originalname.split(' ').join('_'); // remplacer les éventuels espace dans le noms des fichiers par des _
        // créer l'extension du fichier, élément du dictionnaire = au mime_type du document
        const extension = mime_types[file.mimetype];
        //Tyme step = date.now() pour que le nom du fichier soit unique : nom fichier + date + extension
        callback(null, name + Date.now() + '.' + extension);
    }
});

//Expliquer avec single qu'il s'agit uniquement de fichier de type image et exporter le module à l'ensemble du projet
module.exports = multer({storage}).single('image');