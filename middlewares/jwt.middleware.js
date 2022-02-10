const { UserModel } = require("../schemas/User");

// en caso de que token exista hacemos un next
const jwtValidator = async (req, res, next) => {
  // esto es lo que enviamos en el fetch como authorization bearer token
  let token = req.header("authorization");
  console.log(token);
  // quitamos la palabra Bearer para que quede solo el token
  token = token?.replace("Bearer", "");
  const user = await UserModel.findOne({ token });
  if (token) {
    next();
  } else {
    res.send("No tenes token");
  }
};

module.exports = { jwtValidator };
