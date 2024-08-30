class ERROR_CODE extends Error {
  constructor(message) {
    super(message);
    this.name = "ERROR_CODE";
    this.statusCode = 400;
  }
}

class NOT_FOUND_CODE extends Error {
  constructor(message) {
    super(message);
    this.name = "NOT_FOUND_CODE";
    this.statusCode = 404;
  }
}

class SERVER_ERROR_CODE extends Error {
  constructor(message) {
    super(message);
    this.name = "SERVER_ERROR_CODE";
    this.statusCode = 500;
  }
}
class INVALID_DATA_ERROR_CODE extends Error {
  constructor(message) {
    super(message);
    this.name = "INVALID_DATA_ERROR_CODE";
    this.statusCode = 401;
  }
}
class UNAUTHORIZED_ERROR_CODE extends Error {
  constructor(message) {
    super(message);
    this.name = "UNAUTHORIZED_ERROR_CODE";
    this.statusCode = 404;
  }
}
class EXISTINGUSER_ERROR extends Error {
  constructor(message) {
    super(message);
    this.name = "EXISTINGUSER_ERROR";
    this.statusCode = 409;
  }
}

module.exports = {
  ERROR_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  INVALID_DATA_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  EXISTINGUSER_ERROR,
};
