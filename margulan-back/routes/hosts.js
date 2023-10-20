const { Router } = require('express');
const { createHost, joinHost, checkHost, checkJoinHost, getHost, deleteHost, getHosts } = require('../controllers/hosts');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth')

const router = Router();

router.use(auth);


router.get('/', getHosts);
router.get('/checkHost', checkHost);
router.get('/checkJoinHost', checkJoinHost);

router.get('/:hostId', getHost)

router.post("/", createHost);
router.patch("/join/:hostId", joinHost);

router.delete('/:hostId', deleteHost);

module.exports = router;
