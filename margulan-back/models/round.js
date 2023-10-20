const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
    signs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sign"
        }
    ],
    timer: {
        type: Number
    },
    startTime: {
        type: Date,
    }
});

module.exports = mongoose.model('Round', roundSchema);