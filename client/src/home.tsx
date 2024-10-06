import { useEffect, useRef } from "react";
import { renderCursors } from "./functions/renderCursors";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";

type Props = {
  username: string;
};

export default function Home({ username }: Props) {
  /* La constante WS_URL permet de définir l'adresse du serveur.
    Théoriquement, il est possible d'utiliser les variables .env pour définir cette localisation
    La constante THROTTLE permet de définir un temps minimal de 50ms entre chaque invocation de la fonction sendJsonMessage */
  const WS_URL = "ws://localhost:8000"; // -> ?username=username
  const THROTTLE = 50;

  /* sendJsonMessage est une fonction renvoyée par le hook useWebSocket.
   Le hook `useWebSocket` prend en paramètre :
   - L'URL du WebSocket, définie par la constante `WS_URL`.
   - Une option `queryParams` permettant de définir les paramètres à ajouter à l'URL. Ici, on ajoute `username` comme paramètre de requête,
     qui est passé en tant que prop au composant et provient du formulaire login.
   
   `sendJsonMessage` est ensuite utilisée pour envoyer des messages JSON via cette connexion WebSocket. */
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
  });

  /* Grâce à lodash.throttle, on évite d'envoyer un event à chaque fois que la souris bouge.
  On calibre un temps minimal de 50ms entre chaque appel de f().
  Le hook useRef permet de garder la référence de la fonction throttle constante entre chaque rendu.
  Sans useRef, la fonction throttle serait recréée à chaque rendu, et son état interne de limitation serait réinitialisé,
  ce qui empêcherait de limiter correctement la fréquence des appels.*/
  const sendJsonMessageThrottle = useRef(throttle(sendJsonMessage, THROTTLE));

  /* Ce useEffect permet d'ajouter un écouteur d'event sur le mouvement de la souris.
  A chaque mouvement, intercepté par throttle toutes les 50ms, un message JSON est envoyé au serveur
  avec les coordonnées de l'utilisateur.  */
  useEffect(() => {
    sendJsonMessage({ x: 0, y: 0 }); // Demande au serveur d'envoyer la state des users à la connection
    const handleMouseMove = (event: MouseEvent) => {
      /* En utilisant .current, on garantit l'accès à la version stable de la fonction throttlée */
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

  if (lastJsonMessage) {
    return <>{renderCursors(lastJsonMessage)}</>;
  }
  return <h1>Bonjour, {username}</h1>;
}
