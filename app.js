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
const uri =
  "mongodb+srv://lilipopsmx:MongoPasswordLili@portfolio.1t0tx.mongodb.net/aroundApi?retryWrites=true&w=majority";
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("Connected to MongoDB Atlas!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Si ocurre un error al conectar, puedes decidir cómo manejarlo aquí
    // Por ejemplo, podrías intentar reconectar o detener el servidor
    process.exit(1);
  }
}

connectToDatabase();

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
    allowedHeaders:
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);
app.options("*", cors());
app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});

app.get("/test", (req, res) => {
  res.send("Test route is working");
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
