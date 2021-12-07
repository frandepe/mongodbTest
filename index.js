const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3100;
const mongoose = require("mongoose");

const { UserModel } = require("./schemas/User");

// config routes

// Las siguientes dos lineas son para que app sepa que cuando enviamos un post, put, patch...
// pueda leer el body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// connectando con la db de mongo 3T
// la db se va a generar cuando insertemos algo
const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/test`);
    console.log("me conecte");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

// routes
app.post("/api/user", async (req, res) => {
  try {
    const { email, password, age } = req.body;
    const created = await new UserModel({ email, password, age }).save();
    res.send(created);
  } catch (err) {
    console.log(err.message);
    res.send("Ocurrio un error");
  }
});

// Con este get recuperamos todos los datos y los tiramos dentro
// de un objeto {users} para que quede mas lindo
app.get("/api/user", async (req, res) => {
  const users = await UserModel.find();
  res.send({ users, token });
});

app.put("/api/user/:id", async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const updated = await UserModel.findOneAndUpdate({ _id: id }, { email });
  res.send(!!updated);
});

app.delete("/api/user/:id", async (req, res) => {
  // obtengo el id por parametro que va a ir en la siguiente linea
  const { id } = req.params;
  const deleted = await UserModel.findOneAndDelete({ _id: id });
  console.log(deleted);
  res.send(deleted);

  //transformarlo en un booleando
  // res.send(!!deleted);
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
