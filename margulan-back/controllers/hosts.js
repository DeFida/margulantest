const jwt = require('jsonwebtoken');
const Host = require("../models/host");

const extractBearerToken = (header) => {
    const list = header.split("; ");
    const res = {}

    Array.from(list).forEach(element => {

        const splitted = element.split('=')
        res[splitted[0]] = splitted[1];
    });
    return res
};

module.exports.getHost = async (req, res, next) => {
    try {
        const { hostId } = req.params;
        const host = await Host.findById(hostId).populate('host').populate('players').populate({ path: 'games', populate: { path: 'points.player', module: 'PLayer' } });
        return res.send(host);
    }
    catch (e) {
        return next(e)
    }
}

module.exports.getHosts = async (req, res, next) => {
    try {
        const hosts = await Host.find({ active: true });
        return res.send(hosts);
    }
    catch (e) {
        console.log(e);
        return next(e)
    }
}

module.exports.createHost = async (req, res, next) => {
    try {
        const { hostname, waitTime, points, maxUsers } = req.body;
        const host = await (await Host.create({ name: hostname, waitTime, points, maxUsers, host: req.user._id, active: false }))
        host.players = [req.user._id];
        host.populate('players');
        host.populate({ path: 'games', populate: { path: 'points.player', module: 'PLayer' } });
        await host.save();
        const hostToken = jwt.sign({ _id: host._id, name: host.name }, process.env.JWT_SECRET, { expiresIn: '5d' });
        res.cookie('hostToken', hostToken, { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, path: '/', });
        return res.send(host);
    }
    catch (e) {
        console.log(e);
        return next(e);

    }
}

module.exports.joinHost = async (req, res, next) => {
    try {
        const { hostId } = req.params;
        const host = await Host.findById(hostId).populate('players').populate('host').populate({ path: 'games', populate: { path: 'points.player', module: 'PLayer' } });
        const hostToken = jwt.sign({ _id: host._id, name: host.name }, process.env.JWT_SECRET, { expiresIn: '5d' });
        res.cookie('currentHostToken', hostToken, { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, path: '/', });
        return res.send(host);
    }
    catch (e) {
        console.log(e);
        return next(e);

    }
}


module.exports.checkHost = async (req, res, next) => {
    try {
        const hostToken = (extractBearerToken(req.headers.cookie).hostToken).trim();
        const hostData = jwt.verify(hostToken, process.env.JWT_SECRET);
        const host = await Host.findById(hostData._id).populate('players').populate({ path: 'games', populate: { path: 'points.player', module: 'PLayer' } });
        return res.json(host);
    }
    catch (err) {
        return next(err);
    }
}

module.exports.checkJoinHost = async (req, res, next) => {
    try {
        const currentHostToken = (extractBearerToken(req.headers.cookie).currentHostToken).trim();
        const hostData = jwt.verify(currentHostToken, process.env.JWT_SECRET);
        const host = await Host.findById(hostData._id).populate('players').populate('host').populate({ path: 'games', populate: { path: 'points.player', module: 'PLayer' } });
        return res.json(host);
    }
    catch (err) {
        return next(err);
    }
}



module.exports.deleteHost = async (req, res, next) => {
    try {
        const { hostId } = req.params;
        console.log('\n\n', hostId);
        const host = await Host.findByIdAndDelete(hostId);
        res.clearCookie('hostToken', { httpOnly: true, secure: true, path: '/', });
        return res.send(host)
    }
    catch (e) {
        console.log(e);
        return next(e)
    }
}