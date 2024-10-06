# 🖱️ Live Cursor App - Vanilla Node.js + WebSocket Package

## 📚 Introduction

Cette application est une implémentation simple d'un curseur en direct utilisant Vanilla Node.js et le package `ws`. Elle permet de suivre la position des curseurs des utilisateurs en temps réel, à l'aide de WebSockets pour la communication bidirectionnelle.

## 🌐 Contexte

Le protocole WebSocket nécessite un handshake 🤝 HTTP initial. Par conséquent, il est essentiel de créer un serveur HTTP avec Node.js avant de configurer le serveur WebSocket. Nous utilisons `http` pour créer le serveur HTTP et `ws` pour gérer les connexions WebSocket.

## 🏗️ Architecture du Serveur

- **Serveur HTTP** : Le serveur HTTP est créé avec Node.js et sert de base pour l'établissement des connexions WebSocket.
- **Serveur WebSocket** : Le serveur WebSocket est créé à partir de l'instance du serveur HTTP. Il est basé sur le modèle « Event Emitter » de Node.js et peut réagir à des événements tels que `connection`, `message`, `error`, etc.

## 📖 Dictionnaires Utilisés

- **Connections** : Un objet agissant comme un dictionnaire pour garder en mémoire toutes les connexions actives. Cela permet de garder une référence à chaque utilisateur connecté via son identifiant unique (`uuid`).
- **Utilisateurs** : Un objet agissant comme un dictionnaire pour stocker les informations des utilisateurs. Cela inclut le `username` et un objet `state` représentant l'état de chaque utilisateur (par exemple, la position du curseur).

## ⚙️ Gestion des Événements

1. **📡 Diffusion (Broadcast)** : Une fonction qui émet un message à tous les utilisateurs connectés. Le message contient les informations des utilisateurs présentes dans l'objet `users`, encodées en JSON.
2. **📨 handleMessage** : Cette fonction gère les messages entrants. Chaque message contient l'état mis à jour d'un utilisateur (par exemple, la position du curseur). Le message est converti de bytes en JSON, puis utilisé pour mettre à jour l'état de l'utilisateur correspondant. Ensuite, la mise à jour est diffusée à tous les autres utilisateurs.
3. **❌ handleClose** : Cette fonction est appelée lorsque la connexion est fermée. Elle supprime la connexion et les informations de l'utilisateur correspondant des dictionnaires `connections` et `users`, puis diffuse cette mise à jour aux autres utilisateurs.

## 🔌 Gestion des Connexions

Lorsqu'un client se connecte au serveur WebSocket :
- Le serveur extrait le `username` à partir de l'URL de la requête. Exemple : `ws://localhost:8000/?username=Alex`.
- Un `uuid` unique est généré pour identifier la connexion.
- La connexion est enregistrée dans le dictionnaire `connections` et l'utilisateur est enregistré dans le dictionnaire `users`.
- La méthode `.on("message", ...)` est utilisée pour écouter les messages provenant du client, et `.on("close", ...)` pour détecter quand un client se déconnecte.

## 👤 Exemple d'État d'Utilisateur

L'objet `state` d'un utilisateur peut contenir différentes informations :
```json
{
  "x": 0,
  "y": 0,
  "typing": true,
  "onlineStatus": "AFK"
}
```
Cela permet d'enregistrer diverses données telles que la position du curseur, si l'utilisateur est en train de taper, ou son statut en ligne. Par simplicité, ici le seul contenu du message sera la localisation du curseur de l'utilisateur sur l'axe x et y.
```json
{
  "x": 0,
  "y": 0,
}
```

## 🔑 Points Clés

- **🤝 Handshake HTTP** : Les WebSockets commencent par un handshake HTTP. Le server HTTP doit donc être initialisé.
- **🔑 Utilisation d'UUID** : Chaque connexion est identifiée par un UUID unique, même si deux utilisateurs partagent le même `username`. Cela évite les conflits.
- **📂 Séparation des Connexions et des Informations Utilisateur** : Les objets `connections` et `users` sont séparés pour une meilleure organisation et facilité de gestion. Le premier stocke les connexions WebSocket, et le second garde les informations des utilisateurs.
- **📣 Diffusion d'État** : Lorsqu'un utilisateur met à jour son état (par exemple, sa position de curseur), cette mise à jour est diffusée à tous les autres utilisateurs connectés.

## 🚀 Démarrage du Serveur

Le serveur HTTP et WebSocket est à l'écoute sur le port 8000.
```bash
node src/index.js
```

## 🏁 Conclusion

Cette application est un excellent exemple d'utilisation des WebSockets pour la communication bidirectionnelle en temps réel. Elle met en avant l'importance de séparer les connexions des états utilisateurs pour une gestion claire et une évolution aisée de l'application.