const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { login, createUser } = require("./controllers/users");
const cors = require("cors");
const { Joi, celebrate } = require("celebrate");
const { errors } = require("celebrate");
const {
  loginValidator,
  createUserValidator,
} = require("./models/schemaValidation");
const { requestLogger, errorLogger } = require("./middleware/logger");
const { HttpStatus, HttpResponseMessage } = require("./enums/http");
// app.js

const { PORT = 3000 } = process.env;
const app = express();

// conexion  MONGOdb

mongoose.connect("mongodb://127.0.0.1:27017/aroundapi");
const db = mongoose.connection;

db.on("error", (err) => {
  console.error("Error de conexión a la base de datos:", err);
});

db.once("open", () => {
  console.log("Conexión exitosa a la base de datos");
});

// importando routers

const cardsRouter = require("./routes/cards");

const usersRouter = require("./routes/users");
const auth = require("./middleware/auth");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});
app.post(
  "/signin",
  celebrate({
    body: loginValidator,
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: createUserValidator,
  }),
  createUser
);
app.use(auth);
app.use("/", cardsRouter);
app.use("/", usersRouter);

app.use(errorLogger);
app.use(errors());
app.use("/", (req, res) => {
  return res.status(HttpStatus.NOT_FOUND).send(HttpResponseMessage.NOT_FOUND);
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === 500 ? "Se ha producido un error en el servidor" : message,
  });
});
app.listen(PORT, () => {
  console.log(`La aplicación está detectando el puerto ${PORT}`);
});
