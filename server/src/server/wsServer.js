// Importation du module WebSocketServer de la bibliothèque "ws"
// Importation du serveur HTTP créé précédemment
// Importation du gestionnaire de connexion (connectionHandler) pour gérer les événements de connexion
import { WebSocketServer } from "ws";
import server from "./httpServer.js";
import handleConnection from "../handlers/connectionHandler.js";

// Création d'une instance du serveur WebSocket en utilisant le serveur HTTP
// Le serveur WebSocket va permettre la communication bidirectionnelle entre les clients connectés
const wsServer = new WebSocketServer({ server });

// Ajout d'un écouteur d'événement "connection" qui appelle le gestionnaire handleConnection à chaque nouvelle connexion WebSocket
wsServer.on("connection", handleConnection);

export default wsServer;
