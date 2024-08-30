const router = require("express").Router();
const { Joi, celebrate } = require("celebrate");
const auth = require("../middleware/auth");
const { createCardValidator } = require("../models/schemaValidation");

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.use(auth);
router.get("/cards", getCards);
router.post(
  "/cards",
  celebrate({
    body: createCardValidator,
  }),
  createCard
);
router.delete("/cards/:cardId", deleteCard);
router.put("/cards/:cardId/likes", likeCard);
router.delete("/cards/:cardId/likes", dislikeCard);
module.exports = router;
