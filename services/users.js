const USERS = [];

exports.storeUser = (id, username, room) => {
  const user = { id, username, room };
  USERS.push(user);
  return user;
};

exports.getUser = (id) => {
  return USERS.find((user) => user.id === id);
};

exports.getRoomUser = (room) => {
  return USERS.filter((user) => user.room === room);
};

exports.userLeave = (id) => {
  const index = USERS.findIndex((user) => user.id === id);

  if (index !== -1) {
    return USERS.splice(index, 1)[0];
  }
};
