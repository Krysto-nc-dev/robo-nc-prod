import bcrypt from "bcrypt";

const users = [
  {
    _id: "5d7a514b5d2c12c7449be042",
    name: "Admin Account",
    email: "admin@mail.com",
    role: "admin",
    password: bcrypt.hashSync("123456", 10), // Hasher le mot de passe
  },
  {
    _id: "5d7a514b5d2c12c7449be044",
    name: "Private Account",
    email: "private@mail.com",
    role: "private",
    password: bcrypt.hashSync("123456", 10), // Hasher le mot de passe
  },
  {
    _id: "5c8a1d5b0190b214360dc031",
    name: "STOYANN Velten",
    email: "user@mail.com",
    role: "user",
    password: bcrypt.hashSync("123456", 10), // Hasher le mot de passe
  },
];

export default users;
