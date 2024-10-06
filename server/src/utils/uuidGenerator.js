import { v4 as uuidv4 } from "uuid";

// Fonction pour générer un UUID unique pour chaque nouvelle connexion
const generateUUID = () => {
  return uuidv4();
};

export default generateUUID;
