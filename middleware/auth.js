const jwt = require("jsonwebtoken");
require("dotenv").config();
const { NODE_ENV, JWT_SECRET } = process.env;

const {
  ERROR_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  INVALID_DATA_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
} = require("../controllers/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UNAUTHORIZED_ERROR_CODE(
      "No tienes autorización para acceder a esta contenido"
    );
  }
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log(err);
    throw new UNAUTHORIZED_ERROR_CODE(
      "No tienes autorización para acceder a esta contenido"
    );
  }
  req.user = payload;

  next();
};
