let file = require("./file");
const credentialsArray = [
  { email: "user1@example.com", password: "password1" },
  { email: "user2@example.com", password: "password2" },
  // more objects
];
file.writeCredentialsToCSV(credentialsArray);
