// Importation du module HTTP de Node.js
import http from "http";

// Création du serveur HTTP qui sera utilisé pour l'initialisation des connexions WebSocket
// Ce serveur HTTP va écouter les requêtes entrantes et gérer le handshake initial requis pour les WebSockets
const server = http.createServer();

export default server;
