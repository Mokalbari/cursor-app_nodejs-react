const connections = {};

export const addConnection = (uuid, connection) => {
  connections[uuid] = connection;
};

export const removeConnection = (uuid) => {
  delete connections[uuid];
};

export const getConnections = () => {
  return connections;
};

export default connections;
