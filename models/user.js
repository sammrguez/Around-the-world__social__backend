const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
  ERROR_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  INVALID_DATA_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
} = require("../controllers/errors");

const regExpLink = /^(https?:\/\/)(www\.)?[\w~:/?%#[\]@!$&'.()*+,;=]*\/#?/;
const regExpEmail =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Jacques Cousteau",
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "explorador",
  },
  avatar: {
    type: String,
    default:
      "https://plus.unsplash.com/premium_photo-1705091981835-2d49de67d994?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    validate: {
      validator(v) {
        return regExpLink.test(v);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return regExpEmail.test(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("no existe el usuario"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect  password"));
        }

        return user;
      });
    })
    .catch((err) => {
      throw new UNAUTHORIZED_ERROR_CODE("correo o contraseña incorrectos");
    });
};

module.exports = mongoose.model("user", userSchema);
