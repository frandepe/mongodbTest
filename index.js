const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3100;
const mongoose = require("mongoose");

const { UserModel } = require("./schemas/User");

// Atlas te tira la URL de coneccion asi:
// mongosh "mongodb+srv://cluster0.tsovy.mongodb.net/myFirstDatabase" --username prueback1

// Hay que modificarlo de la siguiente manera:
const uri =
  "mongodb+srv://prueback1:pass3969@cluster0.tsovy.mongodb.net/myFirstDatabase";

mongoose.connect(uri).then((resp) => {
  console.log("me conecte");
});

// config routes

// Las siguientes dos lineas son para que app sepa que cuando enviamos un post, put, patch...
// pueda leer el body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

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

// routes
app.post("/api/user", async (req, res) => {
  try {
    const { email, password, age, firstName, lastName } = req.body;
    const created = await new UserModel({
      email,
      password,
      age,
      firstName,
      lastName,
    }).save();
    res.send(created);
  } catch (err) {
    console.log(err.message);
    res.send("Ocurrio un error", err);
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

// Desabilitar usuario, NO eliminar
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

// Esquemas:
// Usuarios son los que vana atener permoisos para entrar a la db
// Funciones: funciones pre-echas para pedirlas desde nuestro back o simplemente escribirlas en js
// Tablas: es un esquema.. podemos tener colecciones de cualquier cosa... usuarios, comidas, productos, etc...

// DUDAS:
// quiero crear usuario y que no se repita
// quiero encriptar contraseña (crear un hash), se hashea con una libreria
// libreria para crear un token
// que es __v ???
// handle-bars sirve??
// que es req, res????
