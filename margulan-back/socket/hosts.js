const Host = require("../models/host")

module.exports.getHost = async (hostId) => {
    try {
        const host = await Host.findById(hostId).populate('players').populate('host').populate({ path: 'games', populate: { path: 'points.player', module: 'PLayer' } });
        return host;
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.joinHost = async (data) => {
    try {
        const host = await Host.findByIdAndUpdate(data.host, { $addToSet: { players: data.user } }).populate('players').populate('host');
        return host;
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.getActiveHosts = async () => {
    try {
        const hosts = await Host.find({ active: true }).populate({ path: 'games', populate: { path: 'points.player', module: 'PLayer' } });
        return hosts;
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.activateHost = async (hostId) => {
    try {
        const host = await Host.findByIdAndUpdate(hostId, { active: true }, { new: true, runValidators: true }).populate('players').populate('host').populate({ path: 'games', populate: { path: 'points.player', module: 'PLayer' } });
        return host;
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.deactivateHost = async (userId) => {
    try {
        const host = await Host.findOneAndUpdate({ host: userId }, { active: false }, { new: true, runValidators: true }).populate('players').populate('host').populate({ path: 'games', populate: { path: 'points.player', module: 'PLayer' } });
        return host;
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.leaveHost = async (userId, hostId) => {
    console.log(hostId);
    try {
        const host = await Host.findById(hostId)
        if (host.host !== userId) {
            const result = await Host.findByIdAndUpdate(hostId, { $pull: { players: userId } }, { new: true, runValidators: true }).populate('players').populate('host').populate({ path: 'games', populate: { path: 'points.player', module: 'PLayer' } });
            return result;
        }
    }
    catch (e) {
        console.log(e);
    }
}




// module.exports.leaveAllHosts = async (userId) => {
//     try {
//         const host = await Host.findOne({ players: userId })
//         if (host.host !== userId) {
//             await Host.findByIdAndUpdate(host._id, { $pull: { players: userId } })
//         }
//     }
//     catch (e) {
//         console.log(e);
//     }
// }