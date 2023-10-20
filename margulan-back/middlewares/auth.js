const jwt = require('jsonwebtoken');

const AuthError = require('../errors/auth-err');

const handleAuthError = () => new AuthError('Необходима авторизация');
const extractBearerToken = (header) => {
  const list = header.split("; ");
  const res = {}

  Array.from(list).forEach(element => {

    const splitted = element.split('=')
    res[splitted[0]] = splitted[1];
  });
  return res
};


const auth = (req, res, next) => {
  try {
    const token = (extractBearerToken(req.headers.cookie).token).trim();

    if (!token) {
      return next(handleAuthError())
    }
    const userData = jwt.verify(token, process.env.JWT_SECRET);
    if (!userData) {
      return next(handleAuthError())
    }

    req.user = userData;
    next();
    return undefined;
  }
  catch (err) {
    return next(handleAuthError())
  }
};

module.exports = auth;
