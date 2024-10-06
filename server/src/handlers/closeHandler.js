// Importation des fonctions pour supprimer les connexions et les utilisateurs
// Importation de la fonction broadcast pour notifier tous les utilisateurs de la déconnexion
import { removeConnection } from "../lib/connections.js";
import { removeUser } from "../lib/users.js";
import broadcast from "./broadcastHandler.js";

// Gestionnaire pour les événements de fermeture de connexion
export default function handleClose(uuid) {
  console.log(`${uuid} disconnected`);

  // Supprime la connexion et l'utilisateur des dictionnaires respectifs
  removeConnection(uuid);
  removeUser(uuid);

  // Diffusion de la mise à jour aux autres utilisateurs pour indiquer la déconnexion
  broadcast();
}
