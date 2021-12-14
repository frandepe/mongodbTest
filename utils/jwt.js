const jwt = require("jsonwebtoken");
// Despues de sign le tiramos:
// los datos que vamos a utilizar para firmar el token
// la palabra secreta con la que se va como a encriptar
// el buffer (ni idea lo que es)
// y la funcion que nos va a decir si error es true le hacemos un reject,
// y si token es true le hacemos un resolve

const generateJWT = ({ firstName, lastName, email }) => {
  return new Promise((resolve, reject) => {
    const payload = { firstName, lastName, email };
    jwt.sign(payload, "mi-palabra-secreta", {}, (err, token) => {
      if (err) {
        reject(err);
      }
      if (token) {
        resolve(token);
      }
    });
  });
};

// despues mandamos este generateJWT al post

module.exports = { generateJWT };
