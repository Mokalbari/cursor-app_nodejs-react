/* Live cursor app - Vanilla NodeJS + ws package */
/* Etant donné que la connexion ws nécessite un handshake http
Il est nécessaire de créer un server http avec nodeJS */

const http = require("http");
const url = require("url");
const uuidv4 = require("uuid").v4;
const { WebSocketServer } = require("ws");
const PORT = 8000;

/* ws créé une classe pour gérer le serveur websocket
S'appuie sur le modèle event emitter build-in nodejs pour réagir à des events comme connection, message, error...
wsServer créé une instance de WebSocketServer à partir du serveur http défini précedemment
*/

const server = http.createServer();
const wsServer = new WebSocketServer({ server });

// Dictionnaires
// Objet qui va agir en tant que "dictionnaire". Garde en mémoire toutes les connections actives
const connections = {};
// Objet qui va agir en tant que "dictionnaire" de tous les
const users = {};

// Event handlers
const broadcast = () => {
  // f() pour émettre un msg à tous les utilisateurs
  Object.keys(connections).forEach((uuid) => {
    // récupère les clés de connections & itération sur le tableau généré
    const connection = connections[uuid]; // on identifie la connection grâce à l'id uuid passé en param
    const message = JSON.stringify(users); // le message sera le contenu de users
    connection.send(message); // envoi du message
  });
};

const handleMessage = (bytes, uuid) => {
  /* le message ici sera la state qui doit être updatée.
    Le client enverra des infos : message = {"x": 0, "y" = 0}
    Dans le cas d'une application focus sur le curseur, on peut supprimer la précédente state
    et la remplacer par le message. // user.state = message
    Si d'autres infos st présentes, il faut overwrite les entrées concernées...
    // user.state.x = message.x || user.state.y = message.y */

  console.log(bytes); // output : <Buffer 7b 22 78 22 3a 20 30 2c 20 22 79 22 3a 20 30 7d>
  /* const intermediate = bytes.toString(); 
  console.log(intermediate); // output : {"x": 0, "y": 0} */
  const message = JSON.parse(bytes.toString()); // node reçoit des bytes, qu'il doit convertir en string puis json
  console.log(message); //output : { x: 0, y: 0 }

  const user = users[uuid]; // j'accède à la ref de mon user stocké dans dictionnaire users par son uuid
  user.state = message;

  broadcast();
};

const handleClose = (uuid) => {
  console.log(`${users[uuid].username} disconnected`);
  delete connections[uuid];
  delete users[uuid];
  broadcast();
};

/* .on() est une f() built-in ws. Similaire à aEL(), écoute les événements connecion
répond par une callback f() avec deux paramètres : connection, request
ws se base sur Event Emitter de NodeJS pour gérer les event async.
*/
wsServer.on("connection", (connection, request) => {
  /* connection représente la connection établie, et request est une copie de la req http
    le protocole de connection sera ws, similaire à http://
    ws://localhost:8000/
    Comme pour http, il est possible de passer des query params :
    ws://localhost:8000/username=Alex&id=1 */

  // Cette ligne permet d'extraire la var username de l'url de la req.
  const { username } = url.parse(request.url, true).query;
  console.log(`${username} connected.`);

  /* uuid est utilisé pour créer un id de connexion unique.
  Cela permet de prévenir le fait que deux utilisateurs peuvent partager le même username.*/
  const uuid = uuidv4();

  /* A chaque fois qu'une nouvelle connection est établie,
    cette co est enregistrée dans le dictionnaire avec un jeu de clé valeur
    la clé représentant l'id unique, et & copie du param connection de la callback f()
    L'objet connection est complexe avec beaucoup de méta données, c'est pourquoi on garde trace
    des usernames connectés dans un objet séparés */
  connections[uuid] = connection;
  users[uuid] = {
    /* Ici on atteste de la présence d'un utilisateur. On garde dans le dictionnaire son username
    mais aussi sa localisation dans une variable state qui pourra être broadcast à tous les autres users.
    L'avantage de garder une state à part, c'est qu'on peut enregistrer d'autres données
    comme typing, onlineStatus etc... On peut y associer toutes autres infos de choix à cette var */
    username: username,
    state: {},
    /* state: { // exemple plus détaillé
      x: 0,
      y: 0,
      typing: true,
      onlineStatus: "AFK"
    },
    */
  };
  console.log("connection", connections); // output -> {uuid: metadonnées connection}
  console.log("username", users); // output -> {uuid: {username: "Marc"}}

  connection.on("message", (message) => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
