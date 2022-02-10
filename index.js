const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3100;
const mongoose = require("mongoose");
const { UserModel } = require("./schemas/User");
const { generateJWT } = require("./utils/jwt");
const { check } = require("express-validator");
const { validateFields } = require("./middlewares/validateFields.middleware");
const { jwtValidator } = require("./middlewares/jwt.middleware");
const { encryptPassword, comparePasswords } = require("./utils/bcrypt");

// Esto es para la variable de entorno
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Atlas te tira la URL de coneccion asi:
// mongosh "mongodb+srv://cluster0.tsovy.mongodb.net/myFirstDatabase" --username prueback1

// Hay que modificarlo de la siguiente manera (esta en el .env):
const uri = process.env.PASSWORD;

const dbConnection = async () => {
  try {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    // el on es un evento que esta todo el tiempo escuchando la base de  datos, como el onClick por ej
    db.on("error", (error) => {
      console.log(error);
    });

    db.once("open", () => {
      console.log("db open");
    });

    console.log("db online");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

dbConnection();

// config routes

// Las siguientes dos lineas son para que app sepa que cuando enviamos un post, put, patch...
// pueda leer el body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Routes:

// Registro
app.post(
  "/api/user",
  [
    // checkeamos si el email es el email correcto
    // el check evalua lo que le pasamos por parametro,
    // y se fija que en el body tenga un campo email
    check("email", "Email invalido").notEmpty(),
    check("password", "Password invalido").notEmpty(),
    validateFields,
  ],
  async (req, res) => {
    try {
      const { email, password, age, firstName, lastName } = req.body;
      const hashedPassowrd = encryptPassword(password);
      const token = await generateJWT({ firstName, lastName, email });
      console.log("token:", token);
      const created = await new UserModel({
        email,
        password: hashedPassowrd,
        age,
        firstName,
        lastName,
        token,
      }).save();

      res.send(created);
    } catch (err) {
      console.log(err.message);
      res.send("Ocurrio un error", err);
    }
  }
);

// Login
app.post(
  "/api/login",
  [
    check("email", "Email invalido").notEmpty().isEmail(),
    check("password", "Password invalido").notEmpty(),
    validateFields,
  ],
  async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const isValid = comparePasswords(password, user.password);
    if (isValid) {
      res.status(202).send({ data: user.token });
    } else {
      res.status(400).send({ message: "Email o contraseña invalidos" });
    }
  }
);

// Obtener un usuario
app.get("/api/get-user", [jwtValidator], async (req, res) => {
  let token = req.header("authorization");
  token = token?.replace("Bearer ", "");
  const user = await UserModel.findOne({ token });
  const { firstName, lastName, age, email } = user;
  if (user) {
    res.send({ firstName, lastName, age, email });
  } else {
    res.send("No tenes token");
  }
});

// Con este get recuperamos todos los datos y los tiramos dentro
// de un objeto {users} para que quede mas lindo
app.get("/api/user", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send({ users });
  } catch (error) {
    res.send(error);
  }
});

app.get("/api/find", async (req, res) => {
  try {
    const users = await UserModel.find({ email: /.*pa.*/ });
    res.send({ users });
  } catch (error) {
    res.send(error);
  }
  npm;
});

app.get("/api/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id: id });
    res.send({ data: user });
  } catch (error) {
    res.send(error);
  }
});

app.put("/api/user/:id", async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const updated = await UserModel.findOneAndUpdate({ _id: id }, { email });
  res.send(!!updated);
});

// Deshabilitar usuario, NO eliminar
app.delete("/api/user/:id", async (req, res) => {
  // obtengo el id por parametro que va a ir en la siguiente linea
  try {
    const { id } = req.params;
    const deleted = await UserModel.findOneAndUpdate(
      { _id: id },
      { enabled: false }
    );
    console.log(deleted);
    res.send(!!deleted);
  } catch (error) {
    res.send(error);
  }

  //transformarlo en un booleando
  // res.send(!!deleted);
});

// Volver a habilitar el usuario
app.get("/api/user/enabled/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserModel.findOneAndUpdate(
      { _id: id },
      { enabled: true }
    );
    console.log(deleted);
    res.send(!!deleted);
  } catch (error) {
    res.send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Estoy corriendo en el puerto ${PORT}`);
});

// Un midleware es una funcion que se ejecuta entre que entras a una url y se ejecuta la funcion
// la idea es que haga de barrera entre si tenes jsonwebtoken o no, si lo tenes y existe en la base de datos pasa

// connectando con la db de mongo 3T
// la db se va a generar cuando insertemos algo
// const connectDB = async () => {
//   try {
//     await mongoose.connect(`mongodb://localhost:27017/test`);
//     console.log("me conecte");
//   } catch (error) {
//     console.log(error);
//   }
// };

// connectDB();

// Esquemas:
// Usuarios son los que vana atener permoisos para entrar a la db
// Funciones: funciones pre-echas para pedirlas desde nuestro back o simplemente escribirlas en js
// Tablas: es un esquema.. podemos tener colecciones de cualquier cosa... usuarios, comidas, productos, etc...

// DUDAS:
// Quiero que la contraseña tenga mas de 5 digitos
// Quiero crear relaciones, que un usuario tenga relacion con un producto creado

// Heroku no sabe como correr nuestra aplicacion
// Con el Procfile le indicamos donde heroku tiene que correr la aplicacion
