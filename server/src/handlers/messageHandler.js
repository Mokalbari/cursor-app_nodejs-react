// Importation de la fonction pour mettre à jour l'état de l'utilisateur
// Importation de la fonction broadcast pour diffuser les mises à jour à tous les utilisateurs
import { updateUserState } from "../lib/users.js";
import broadcast from "./broadcastHandler.js";

// Gestionnaire pour les messages reçus d'un utilisateur connecté
export default function handleMessage(bytes, uuid) {
  // Conversion des bytes reçus en un objet JSON
  // Par défaut, NodeJS reçoit des bytes qu'il doit convertir en string puis parse en JSON pour être exploitable
  const message = JSON.parse(bytes.toString());
  console.log(message);

  // Mise à jour de l'état de l'utilisateur correspondant à l'UUID reçu
  updateUserState(uuid, message);

  // Diffusion de la mise à jour à tous les utilisateurs connectés
  broadcast();
}
