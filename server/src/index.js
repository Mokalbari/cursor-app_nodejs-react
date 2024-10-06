import server from "./server/httpServer.js";
import wsServer from "./server/wsServer.js";

const PORT = 8000;

server.listen(PORT, () => {
  console.info(`HTTP server is running on http://localhost:${PORT}`);
  if (wsServer) {
    console.info(`Websocket server is running on port ws://localhost:${PORT}`);
  }
});
