// Importation du module "url" pour analyser l'URL de la requête
// Importation de la fonction pour générer un UUID unique
// Importation des fonctions pour gérer les connexions et les utilisateurs
// Importation des gestionnaires d'événements
import url from "url";
import generateUUID from "../utils/uuidGenerator.js";
import { addConnection, removeConnection } from "../lib/connections.js";
import { addUser, removeUser } from "../lib/users.js";
import handleMessage from "./messageHandler.js";
import handleClose from "./closeHandler.js";

// Gestionnaire des nouvelles connexions WebSocket
export default function handleConnection(connection, request) {
  // Analyse l'URL de la requête pour extraire le paramètre "username"
  const { username } = url.parse(request.url, true).query;
  console.log(`${username} connected.`);

  // Génère un identifiant unique (UUID) pour chaque connexion
  // Cela permet de prévenir la confusion en cas d'un double username
  const uuid = generateUUID();

  // Enregistre la connexion et l'utilisateur dans leurs dictionnaires respectifs
  // On utilise ici deux fonctions qui permettent d'intéragir avec les dictionnaires respectifs
  addConnection(uuid, connection);
  addUser(uuid, username);

  // Log des informations de connexion
  console.log("connection", addConnection);
  console.log("username", addUser);

  // Écoute les messages reçus et les événements de déconnexion pour chaque connexion
  connection.on("message", (message) => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));
}
