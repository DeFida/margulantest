const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const unauthorizedError = require('../errors/unauthorized-err');

const hostSchema = new mongoose.Schema({
    name: {
        type: String
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    waitTime: {
        type: Number
    },
    points: {
        type: Number
    },
    maxUsers: {
        type: Number
    },
    active: {
        type: Boolean
    },
    games: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Game"
        }
    ],
});

module.exports = mongoose.model('Host', hostSchema);