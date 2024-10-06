# 🖥️ Application WebSocket avec React

## Introduction

Ce projet est une application React qui utilise des WebSockets pour partager en temps réel la position du curseur des utilisateurs connectés. Chaque utilisateur peut visualiser la position des autres sur la page. L'application est développée en utilisant `react-use-websocket` pour gérer la connexion WebSocket et `lodash.throttle` pour limiter la fréquence des envois de messages.

## Fonctionnalités principales

1. **Connexion WebSocket** : Chaque utilisateur se connecte au serveur WebSocket spécifié et envoie sa position de curseur à chaque mouvement.
2. **Gestion des messages** : Les positions des curseurs sont envoyées via le WebSocket à une fréquence régulée pour éviter une surcharge.
3. **Affichage de la liste des utilisateurs et des curseurs** : La position des autres utilisateurs est récupérée via le WebSocket et rendue dynamiquement sur la page.

## Variables importantes

- **`WS_URL`** : URL du serveur WebSocket.
  - Cette constante est définie pour indiquer l'adresse du serveur WebSocket, par exemple `ws://localhost:8000`. Il est recommandé d'utiliser des variables `.env` pour définir cette localisation afin de la rendre configurable sans modifier le code source.
- **`THROTTLE`** : Intervalle de limitation des messages.
  - Cette constante est définie à 50ms pour indiquer la fréquence minimale d'envoi des messages `sendJsonMessage`, évitant ainsi de saturer la connexion avec des messages inutiles lors de chaque mouvement de la souris.

## Utilisation du hook `useWebSocket`

Le hook `useWebSocket` est utilisé pour se connecter au serveur WebSocket :

```javascript
const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
  queryParams: { username },
});
```

- **`sendJsonMessage`** : Fonction permettant d'envoyer des messages JSON via la connexion WebSocket.
- **`lastJsonMessage`** : Dernier message reçu via la connexion WebSocket, utilisé pour mettre à jour l'affichage des curseurs et de la liste des utilisateurs.
- **`queryParams`** : Le paramètre `username` est passé dans l'URL, permettant d'identifier chaque utilisateur lors de la connexion au serveur.

## Gestion de l'envoi des messages avec `throttle`

Pour éviter d'envoyer des messages trop souvent (chaque fois que la souris bouge), on utilise `lodash.throttle` pour limiter la fréquence d'envoi à une fois toutes les 50ms.

```javascript
const sendJsonMessageThrottle = useRef(throttle(sendJsonMessage, THROTTLE));
```

- **`useRef`** est utilisé ici pour garder la référence de la fonction `throttle` constante entre chaque rendu. Cela garantit que l'état interne de `throttle` ne sera pas réinitialisé, permettant de limiter correctement la fréquence d'envoi.

## Utilisation du hook `useEffect`

Le hook `useEffect` est utilisé pour ajouter un écouteur d'événement sur le mouvement de la souris :

```javascript
useEffect(() => {
  sendJsonMessage({ x: 0, y: 0 }); // Demande au serveur d'envoyer l'état des utilisateurs à la connexion
  const handleMouseMove = (event: MouseEvent) => {
    sendJsonMessageThrottle.current({
      x: event.clientX,
      y: event.clientY,
    });
  };

  window.addEventListener("mousemove", handleMouseMove);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
  };
}, [sendJsonMessage]);
```

- **`handleMouseMove`** : À chaque mouvement de la souris, un message est envoyé au serveur via `sendJsonMessageThrottle` pour transmettre les coordonnées actuelles du curseur.
- **Nettoyage de l'événement** : `window.removeEventListener` est utilisé dans le `return` du `useEffect` pour éviter des fuites de mémoire en cas de démontage du composant.

## Rendu des curseurs et de la liste des utilisateurs

Si un `lastJsonMessage` est reçu, on utilise les fonctions `renderCursors` et `renderUsersList` pour afficher dynamiquement la position des curseurs des utilisateurs et la liste des utilisateurs connectés :

```javascript
if (lastJsonMessage) {
  return (
    <>
      {renderCursors(lastJsonMessage)}
      {renderUsersList(lastJsonMessage)}
    </>
  );
}
```

Ces fonctions récupèrent les informations contenues dans `lastJsonMessage` pour rendre ces éléments sur la page.

## Dépendances

- **`react-use-websocket`** : Gère la connexion WebSocket de manière simple et efficace.
- **`lodash.throttle`** : Utilisé pour limiter la fréquence des envois de messages.

## Recommandations

- Utiliser des variables d'environnement pour la configuration, comme l'URL du serveur WebSocket.
- Toujours nettoyer les écouteurs d'événements ajoutés dans les `useEffect` pour éviter les fuites de mémoire.

## Lancement de l'application

Assurez-vous d'avoir Node.js installé, puis :

```bash
npm install
npm start
```

Le projet se connectera à l'URL définie dans `WS_URL` pour établir la connexion WebSocket. Vous pouvez également modifier cette URL dans un fichier `.env` pour des configurations spécifiques à chaque environnement (développement, production, etc.).

---
Avec ces instructions, vous devriez être en mesure de comprendre comment fonctionne l'application et comment chaque composant est configuré pour travailler avec les WebSockets et gérer les événements utilisateur.