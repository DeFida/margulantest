const bcryptit = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const CastError = require('../errors/cast-err');
const ConflictError = require('../errors/conflict-err');



module.exports.createUser = async (req, res, next) => {
    const {
        username, password,
    } = req.body;

    try {
        if (!password || !username) {
            return next(new CastError('Имя или пароль отсутствуют!'));
        }
        const isInDataBase = await User.findOne({ username })

        if (isInDataBase) {
            return next(new ConflictError(`User with such username ${username} exists!`));
        }

        const hash = await bcryptit.hash(password, 10);


        const user = await User.create({ username, password: hash });
        const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '5d' })
        res.cookie('token', token, { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, path: '/' });

        return res.send({ _id: user._id, username: user.username });
    }
    catch (err) {
        next(err);
    }
};

module.exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return next(new NotFoundError(`Wrong username or password!`));
        }
        const isPassEqual = await bcryptit.compare(password, user.password);

        if (!isPassEqual) {
            return next(new NotFoundError(`Wrong username or password!`));
        }

        const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '5d' });

        res.cookie('token', token, { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, path: '/' });
        return res.send({ _id: user._id, username: user.username });
    }
    catch (err) {
        next(err);
    }

};


module.exports.logout = async (req, res, next) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: true, path: '/', });

        return res.json({ message: "Deleted" });
    }
    catch (err) {
        next(err);
    }
};



module.exports.checkAuth = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate({ path: 'games', populate: { path: 'points.player', module: 'PLayer' } });
        return res.json({ _id: user._id, username: user.username, games: user.games })
    }
    catch (err) {
        next(err);
    }
}


// GETTERS


module.exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user._id).populate({ path: 'games', populate: { path: 'points.player', module: 'PLayer' } });
    return res.json({ _id: user._id, username: user.username, games: user.games })
}