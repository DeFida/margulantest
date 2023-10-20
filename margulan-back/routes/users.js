const { Router } = require('express');
const { getMe } = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth')

const router = Router();


router.use(auth);
router.get("/me", getMe);

module.exports = router;
