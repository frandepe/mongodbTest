// Importamos la libreria de mongoose
const mongoose = require("mongoose");
// Obtenemos el Schema que esta dentro de mongoose
const { Schema, model } = mongoose;

// Creamos un esquema
// Aca tendria que ir un try catch para recibir el error???
const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Pasame el email"],
    index: { unique: true, dropDups: true },
  },
  password: { type: String, required: [true, "Pasame el pass"] },
  firstName: { type: String, required: [true, "Pasame el name"] },
  lastName: { type: String, required: [true, "Pasame el apellido"] },
  age: { type: Number },
  createdDate: { type: Date, default: new Date() },
  enabled: { type: Boolean, default: true },
});

// Este metodo es para evitar traer algunos campos de la db
UserSchema.methods.toJSON = function () {
  // Campos a evitar
  const { __v, password, _id, ...user } = this.toObject();

  //Campos a traer
  // para que me traiga el id sin el guion bajo
  user.id = _id;
  return user;
};

// Exportamos el schema con estas dos lineas
// El 'Users' es la manera que queremos que se vea en la base de datos
const UserModel = model("Users", UserSchema);

module.exports = { UserModel };
