// Importation des fonctions pour récupérer les connexions et les utilisateurs
import { getConnections } from "../lib/connections.js";
import { getUsers } from "../lib/users.js";

// Fonction pour diffuser les informations d'état de tous les utilisateurs à chaque utilisateur connecté
export default function broadcast() {
  // Récupère toutes les connexions actives et les utilisateurs
  const connections = getConnections();
  const users = getUsers();

  // Parcourt chaque connexion active pour envoyer un message contenant l'état actuel des utilisateurs
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message);
  });
}
