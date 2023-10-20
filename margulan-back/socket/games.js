const Host = require("../models/host");
const Game = require("../models/game");
const User = require("../models/user");

module.exports.runGame = async (hostId) => {
    try {

        const host = await Host.findById(hostId);
        const game = await Game.create({});
        let points = [];

        for (let player of host.players) {
            points.push({ player: player._id, point: 0 })
        }

        game.points = points;
        game.populate('players');

        (host.games).push(game._id);
        await host.save();
        await game.save();
        return game;
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.leaveGame = async (gameId) => {
    try {
        const game = await Game.findById(gameId).populate('players');
        return game;
    }
    catch (e) {
        console.log(e);
    }
}

