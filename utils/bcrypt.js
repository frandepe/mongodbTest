const bcryptjs = require("bcryptjs");

// vamos a encriptar un dato (la contraseña)
// luego vamos a comparar cosas encriptadas
const encryptPassword = (password) => {
  // vamos a crear un salt (una palabra clave para encriptar la contraseña)
  // aca estamos encriptando un codigo super random
  const salt = bcryptjs.genSaltSync();
  const hashedPassword = bcryptjs.hashSync(password, salt);
  return hashedPassword;
};

const comparePasswords = (password, encryptedPassword) => {
  const isValid = bcryptjs.compareSync(password, encryptedPassword);
  return isValid;
};

module.exports = { encryptPassword, comparePasswords };
