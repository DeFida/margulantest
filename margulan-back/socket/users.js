const Host = require("../models/host");
const Game = require("../models/game");
const User = require("../models/user");

module.exports.activateMe = async (userId) => {
    try {

        const user = await User.findByIdAndUpdate(userId, { active: true }, { new: true, runValidators: true })
        return user;
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.deactivateMe = async (userId) => {
    try {

        const user = await User.findByIdAndUpdate(userId, { active: false }, { new: true, runValidators: true })
        return user;
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.findPlayer = async (userId) => {
    try {

        const player = await User.findOneAndUpdate({
            $and: [
                { active: true },
                { _id: { $ne: userId } } // Exclude the user with a specific userId
            ]
        }, { active: false }, { new: true, runValidators: true });
        
        if (player) {
            await User.findByIdAndUpdate(userId, { active: false }, { new: true, runValidators: true });
        }

        return player;
    }
    catch (e) {
        console.log(e);
    }
}