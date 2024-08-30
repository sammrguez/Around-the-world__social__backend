const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { NODE_ENV, JWT_SECRET } = process.env;

const {
  ERROR_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  INVALID_DATA_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  EXISTINGUSER_ERROR,
} = require("./errors");

module.exports.getUsers = (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    throw new UNAUTHORIZED_ERROR_CODE(
      "No tienes autorización para acceder a esta contenido"
    );
  }
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new EXISTINGUSER_ERROR("ya existe un usuario con este correo");
      }
      return bcrypt.hash(req.body.password, 10);
    })

    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
    )
    .then((user) => {
      res.send({ data: user });
    })

    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;

  if (!userId) {
    throw new UNAUTHORIZED_ERROR_CODE(
      "No tienes autorización para acceder a esta contenido"
    );
  }
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("No se ha encontrado ningún user con esa id");
      error.statusCode = 404;
      throw error;
    })
    .then((user) =>
      res.send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      })
    )
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    throw new UNAUTHORIZED_ERROR_CODE(
      "No tienes autorización para acceder a esta contenido"
    );
  }
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error("No se ha encontrado ningún user con esa id");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        {
          expiresIn: "7d",
        }
      );

      res.send({ token });
    })
    .catch(next);
};
//users/me
module.exports.myProfile = (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    throw new UNAUTHORIZED_ERROR_CODE(
      "No tienes autorización para acceder a esta contenido"
    );
  }

  User.findById(userId)
    .orFail(() => {
      const error = new UNAUTHORIZED_ERROR_CODE(
        "No tienes autorización para acceder a esta contenido"
      );
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};
