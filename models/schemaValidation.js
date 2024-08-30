const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const createUserValidator = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
});

const updateProfileValidator = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  about: Joi.string().required().min(2).max(30),
});

const updateAvatarValidator = Joi.object().keys({
  avatar: Joi.string().required().custom(validateURL),
});

const loginValidator = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const createCardValidator = Joi.object().keys({
  name: Joi.string().required(),
  link: Joi.string().required().custom(validateURL),
});

module.exports = {
  createCardValidator,
  loginValidator,
  updateAvatarValidator,
  updateProfileValidator,
  createUserValidator,
};
