const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    rounds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Round"
        }
    ],
    points: [
        {
            player: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            point: {
                type: Number,
                default: 0
            }
        }
    ],
});

module.exports = mongoose.model('Game', gameSchema);