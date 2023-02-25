//HELPER FUNCTIONS////////////////////////////////////
//
//Generate a Random Ids
const generateRandomString = function() {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomUrl = "";
  let shortUrlLength = 6;
  for (let i = 0; i < shortUrlLength; i++) {
    randomUrl += chars[Math.floor(Math.random() * chars.length)];
  }
  return randomUrl;
};
//Find users by email
const getUserByEmail = function(email, database) {
  const userValues = Object.values(database);
  for (const user of userValues) {
    if (user.email === email) {
      return user;
    }
  }
};

//Generate random ids
const urlsForUser = function(userId, database) {
  const urls = {};
  const ids = Object.keys(database);

  for (const id of ids) {
    const url = database[id];
    if (url.userId === userId) {
      urls[id] = url;
    }
  }
  return urls;
};

module.exports = {generateRandomString, getUserByEmail, urlsForUser};