const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const unauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    games: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Game"
        }
    ]
});

userSchema.statics.findUserByCredentials = function (username, password) {
    return this.findOne({ username }).select('+password')
        .then((user) => {
            if (!user) {
                return Promise.reject(new unauthorizedError('Неправильные username или пароль'));
            }

            return bcrypt.compare(password, user.password)
                .then((matched) => {
                    if (!matched) {
                        return Promise.reject(new unauthorizedError('Неправильные username или пароль'));
                    }

                    return user;
                });
        });
};

module.exports = mongoose.model('User', userSchema);