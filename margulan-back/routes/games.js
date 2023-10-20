const { Router } = require('express');
const { getGames, getGame, leaveGame, joinGame } = require('../controllers/games');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth')

const router = Router();

router.use(auth);


router.get('/', getGames);
router.get('/:gameId', getGame)

router.post('/join', joinGame)
router.post('/leave', leaveGame)

module.exports = router;
