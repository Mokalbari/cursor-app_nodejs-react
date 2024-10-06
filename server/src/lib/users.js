const users = {};

export const addUser = (uuid, username) => {
  users[uuid] = {
    username: username,
    state: {},
  };
};

export const updateUserState = (uuid, state) => {
  if (users[uuid]) {
    users[uuid].state = state;
  }
};

export const removeUser = (uuid) => {
  delete users[uuid];
};

export const getUsers = () => {
  return users;
};

export default users;
