const mongoose = require('mongoose');

const signSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sign: {
        type: String
    }
});

module.exports = mongoose.model('Sign', signSchema);