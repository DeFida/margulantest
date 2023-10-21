const Game = require("../models/game");
const User = require("../models/user");
const Host = require("../models/host");
const Round = require("../models/round");
const Sign = require("../models/sign");

module.exports.startRound = async (data) => {
    try {
        const { hostId, gameId } = data;
        const host = await Host.findById(hostId);

        const round = await Round.create({ timer: host.waitTime, startTime: new Date() });

        await Game.findByIdAndUpdate(gameId, { $addToSet: { rounds: round._id } })
        return round;
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.selectSign = async (data) => {
    try {
        const { userId, roundId, sign } = data;

        const selectedSign = await Sign.create({ player: userId, sign })
        await selectedSign.populate('player')
        await selectedSign.save();
        await Round.findByIdAndUpdate(roundId, { $addToSet: { signs: selectedSign._id } });
        return selectedSign;
    }
    catch (e) {
        console.log(e);
    }
}

function findWinSign(signs, plyersLength) {

    const signsString = Array.from(signs.map((sign) => sign.sign));

    if (signsString.length > 0) {
        const solidSigns = new Set(signsString);
        if ((solidSigns.size === 3 && plyersLength === signsString.length) || (solidSigns.size === 1 && plyersLength === signsString.length)) {
            return null
        }
        else {
            const first = (Array.from(solidSigns)).sort()[0]
            const second = (Array.from(solidSigns)).sort()[1]
            if (first === '&#9994;' && second === '&#9996;') {
                return first
            }
            else if (first === '&#128400;' && second === '&#9994;') {
                return first
            }
            else if (first === '&#128400;' && second === '&#9996;') {
                return second;
            }
            else {
                return first;
            }
        }
    }
    else {
        return null;
    }


}

module.exports.checkResults = async (data) => {
    const { gameId, roundId } = data;

    let results = [];

    const round = await Round.findById(roundId).populate('signs');

    const signs = round.signs;

    const game = await Game.findById(gameId).populate('players')
    let points = game.points;
    if (signs.length > 0) {
        const winSign = findWinSign(signs, game.players.length);
        if (!winSign) {
            return null
        }
        else {
            for (let theSign of signs) {
                for (let thepoint of points) {
                    if ((thepoint.player._id).toString() === (theSign.player).toString()) {
                        if (theSign.sign === winSign) {
                            thepoint.point += 1;
                            results.push(thepoint)
                        }
                        else {
                            results.push(thepoint)
                        }
                    }
                }
            }

            const ids = results.map((result) => result.player._id)
            for (let currentpoint of points) {
                if (!ids.includes(currentpoint.player._id)) {
                    results.push(currentpoint)
                }
            }
            game.points = results;
            await game.save();

            const updatedResults = await Game.findById(game._id).populate({ path: 'points.player', module: "Player" })
            results = updatedResults.points
            return results
        }
    }

    return 'stopgame'


}