const { createUser, login, checkAuth, logout } = require("../controllers/users");
const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth')
const userRouter = require('./users');
const hostRouter = require('./hosts');
const gameRouter = require('./games');


const router = Router();

router.post('/login', celebrate({
    body: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),
}), login);

router.post('/register', celebrate({
    body: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required()
    }),
}), createUser);

router.post('/logout', logout);
router.get('/checkAuth', auth, checkAuth);

router.use('/users', auth, userRouter);
router.use('/hosts', auth, hostRouter);
router.use('/games', auth, gameRouter);


module.exports = router;
