const router = require("express").Router();
const { Joi, celebrate } = require("celebrate");
const auth = require("../middleware/auth");
const {
  updateAvatarValidator,
  updateProfileValidator,
} = require("../models/schemaValidation");

const {
  getUsers,
  updateProfile,
  updateAvatar,
  myProfile,
} = require("../controllers/users");

router.use(auth);

router.get("/users", getUsers);
router.get("/users/me", myProfile);

router.patch(
  "/users/me",
  celebrate({
    body: updateProfileValidator,
  }),
  updateProfile
);
router.patch(
  "/users/me/avatar",
  celebrate({
    body: updateAvatarValidator,
  }),
  updateAvatar
);
module.exports = router;
