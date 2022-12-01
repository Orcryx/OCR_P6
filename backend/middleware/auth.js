// Importer jsonWebTokken
const jwt = require('jsonwebtoken');

//Exporter une fonction qui sera le middleware qui protège les routes sensibles avec un token
module.exports = (req, res, next) => {
    //Récupérer et réutiliser le token - C'est une étape qui peut générer des erreurs, donc utilisations de try/catch
    try{
        const token = req.headers.authorization.split(' ')[1]; // récupérer le token dans authorization et retirer bearer. Nous utilisons donc la fonction split pour tout récupérer après l'espace dans le header. Les erreurs générées ici s'afficheront dans le bloc catch.
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // décoder le token grace à la fonction verify de jsonwebtoken, elle prends 2 arguments : le token + la clé secrète
        const userId = decodedToken.userId; //Nous extrayons l'ID utilisateur de notre token et le rajoutons à l’objet Request afin que nos différentes routes puissent l’exploiter.
        req.auth = {
            userId: userId
        };
        next(); // Passe aux autres routes du projet
    }catch(error){ // On récupère l'erreur si nécessaire et on renvoie une réponse. Dans le cas contraire, tout fonctionne et notre utilisateur est authentifié. Nous passons à l'exécution à l'aide de la fonction next().
        res.status(401).json({error});
    }
};
