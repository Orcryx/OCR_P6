// Importer le package Http natif de node
const http = require('http');

//importer l'app qui se trouve dans app.js
const app = require('./app');
// Dire à l'application express sur quel port elle doit tourner : 
app.set('port, process.env.PORT || 3000')

//la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne 
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };


const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

//méthode createServer du package http, prend 2 paramètres : la requête et la réponse
/*****const http = require('http');
const server = http.createServer((req, res) => {
    res.end('Voilà la réponse du serveur !');
});
server.listen(process.env.PORT || 3000); ****/
//OU lui passer une application, ici app. 
const server = http.createServer(app);

//un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
