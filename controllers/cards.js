const Card = require("../models/card");
const {
  ERROR_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  INVALID_DATA_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
} = require("../controllers/errors");

module.exports.getCards = (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    throw new UNAUTHORIZED_ERROR_CODE(
      "No tienes autorización para acceder a esta contenido"
    );
  }
  Card.find({})
    .orFail()
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const userId = req.user._id;

  if (!userId) {
    throw new UNAUTHORIZED_ERROR_CODE(
      "No tienes autorización para acceder a esta contenido"
    );
  }
  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })

    .then((card) => {
      res.send(card);
    })

    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const cardId = req.params.cardId;
  if (!userId) {
    throw new UNAUTHORIZED_ERROR_CODE(
      "No tienes autorización para acceder a esta contenido"
    );
  }
  Card.findById(cardId).then((card) => {
    const cardOwner = card.owner;

    if (!card) {
      throw new UNAUTHORIZED_ERROR_CODE(
        "No tienes autorización para acceder a esta contenido"
      );
    }
    if (cardOwner.toString() !== userId.toString()) {
      throw new UNAUTHORIZED_ERROR_CODE("no eres dueno de esta card");
    } else {
      Card.findByIdAndDelete(cardId)
        .then((deletedCard) => {
          res.send(deletedCard);
        })
        .catch(next);
    }
  });
};

module.exports.likeCard = (req, res, next) => {
  const cardId = req.params.cardId;
  const idLike = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: idLike } },
    { new: true }
  )
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};
module.exports.dislikeCard = (req, res, next) => {
  const cardId = req.params.cardId;
  const idLike = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: idLike } }, { new: true })
    .then((card) => {
      if (!card) {
        console.log("Tarjeta no encontrada");
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: "Tarjeta no encontrada" });
      }
      res.send(card);
    })
    .catch(next);
};
