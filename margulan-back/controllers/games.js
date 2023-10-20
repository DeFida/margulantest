const jwt = require('jsonwebtoken');
const Host = require("../models/host");
const Game = require("../models/game");
const User = require("../models/user");


module.exports.getGame = async (req, res, next) => {
    try {
        const { gameId } = req.params;
        const game = await Game.findById(gameId).populate('players').populate({ path: 'points.player', module: "Player" }).populate({ path: 'rounds', populate: { path: 'signs', module: "Sign", populate: { path: 'player', module: "Player" } } });
        return res.send(game);
    }
    catch (e) {
        return next(e)
    }
}

module.exports.getGames = async (req, res, next) => {
    try {
        const games = await Game.find({});
        return res.send(games);
    }
    catch (e) {
        return next(e)
    }
}

module.exports.joinGame = async (req, res, next) => {
    try {
        const { gameId } = req.body;
        const game = await Game.findByIdAndUpdate(gameId, { $addToSet: { players: req.user._id } }, { new: true, runValidators: true }).populate('players')

        await User.findByIdAndUpdate(req.user._id, { $addToSet: { games: game._id } }, { new: true, runValidators: true })
        return res.send(game)
    }

    catch (e) {
        return next(e);
    }
}

module.exports.leaveGame = async (req, res, next) => {
    try {
        const { userId, gameId, hostId } = req.body;
        await Host.findByIdAndUpdate(hostId, { $pull: { players: userId } });
        const game = await Game.findByIdAndUpdate(gameId, { $pull: { players: userId } }, { new: true, runValidators: true }).populate('players');
        res.clearCookie('hostToken', { httpOnly: true, secure: true, path: '/', });
        res.clearCookie('currentHostToken', { httpOnly: true, secure: true, path: '/', });
        return res.send(game);
    }
    catch (e) {
        console.log(e);
        return next(e)
    }
}