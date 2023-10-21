const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const indexRouter = require('./routes/index');
const limiter = require('./middlewares/limiter');

const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');
const { errors } = require('celebrate');

const NotFoundError = require('./errors/not-found-err');
const { activateHost, deactivateHost, getActiveHosts, getHost, joinHost, leaveHost, randomHost } = require('./socket/hosts');
const { runGame, leaveGame } = require('./socket/games');
const { startRound, selectSign, checkResults } = require('./socket/rounds')
const { activateMe, findPlayer } = require('./socket/users')
const Host = require('./models/host');
const Game = require('./models/game');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: [
            "http://localhost:3000", "http://192.168.0.186:3000", "192.168.0.186:3000"
        ],
        methods: ["GET", "POST", "PUT", "HEAD", "PATCH", "DELETE"],
        allowedHeaders: ['Content-Type', 'Authorization', 'credentials', 'Credentials', 'Origin', 'Credential', 'cookie', 'withCredentials', 'Access-Control-Allow-Credentials', 'Acess-Control-Allow-Origin'],
        credentials: true
    }
});

dotenv.config();

const corsOptions = {
    // origin: "*",
    origin: [
        "http://localhost:3000", "http://192.168.0.186:3000", "192.168.0.186:3000"
    ],
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization', 'credentials', 'Credentials', 'Origin', 'Credential', 'cookie', 'withCredentials', 'Access-Control-Allow-Credentials', 'Acess-Control-Allow-Origin'],
    preflightContinue: false,
    maxAge: 86400,
}

const { PORT, DB_ADDRESS } = process.env;

mongoose.connect(DB_ADDRESS);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.options('*', cors())
app.use(indexRouter);
app.use('/static', express.static(__dirname + '/public'));


io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    const username = socket.handshake.query.username;

    socket.on('joinHost', async (data) => {
        const roomToJoin = data.host;
        socket.join(roomToJoin);
        await joinHost(data);
        const host = await getHost(roomToJoin);
        socket.emit('joinedHost', host);
        io.to(roomToJoin).emit('playerJoined', host);
    });

    socket.on('deleteHost', async (data) => {
        io.to(data).emit('hostDeleted');
        const activeHosts = await getActiveHosts();
        io.emit("updateHosts", activeHosts);
    });


    socket.on('activateHost', async (data) => {
        const host = await activateHost(data);
        const activeHosts = await getActiveHosts();

        socket.join(data);
        socket.emit('joinedHost', host);
        io.emit("updateHosts", activeHosts);
    })

    socket.on('leaveHost', async (data) => {
        const host = await leaveHost(data.userId, data.hostId);
        socket.emit('leftHost', host);
        io.to(data.hostId).emit('playerLeft', host);
        socket.leave(data.hostId);
    })

    socket.on('runGame', async (data) => {
        const { host } = data;
        const game = await runGame(host);
        io.to(host).emit('runGame', game)
    })

    socket.on('joinGame', async ({ gameId, hostId }) => {
        const game = await Game.findById(gameId).populate('players').populate({ path: 'points.player', module: "Player" })
        io.to(hostId).emit("playerJoinedGame", game)
    })

    socket.on('startRound', async ({ hostId, gameId }) => {

        const round = await startRound({ hostId, gameId });
        const host = await Host.findById(hostId)
        const game = await Game.findById(gameId).populate('players')
        io.to(hostId).emit('roundStarted', round);

        setTimeout(async () => {
            io.to(hostId).emit('timerComplete', game);
            const results = await checkResults({ gameId, roundId: round._id })
            if (!results) {
                io.to(hostId).emit('draw')
            }
            else {
                if (results === 'stopgame') {
                    io.to(hostId).emit('stopgame')
                }
                else {
                    const winPoint = host.points;
                    if (results.some((result) => result.point === winPoint)) {
                        io.to(hostId).emit('winResults', results)
                    }
                    else {
                        io.to(hostId).emit('results', results)
                    }

                }

            }
        }, host.waitTime * 1000);
    })

    socket.on('readyToStart', async (hostId) => {
        socket.join((hostId).toString());
        const host = await Host.findById(hostId)
        if ((host.games).length < 1) {
            console.log("GAMES LENGTH: ", (host.games).length);
            socket.emit('startRandomGame', hostId)
        }

    })

    socket.on('iamactive', async () => {
        const me = await activateMe(userId);
        const player = await findPlayer(userId);

        if (player) {
            const host = await randomHost(me, player._id)
            socket.join((host._id).toString())
            socket.emit('joinMe', { hostId: host._id })
            io.emit('joinRandom', { playerId: player._id, hostId: host._id })
        }
    })

    socket.on('joinHostRoom', async ({ hostId }) => {
        socket.join(hostId);
    })

    socket.on('selectSign', async (data) => {
        const { hostId, roundId, sign } = data;
        const selectedSign = await selectSign({ userId, roundId, sign });
        socket.emit('mySelectedSign', selectedSign)
        io.to(hostId).emit('signSelected', selectedSign);
    })

    socket.on('leaveTheGame', async ({ hostId, gameId }) => {
        const game = await leaveGame(gameId);
        io.to(hostId).emit('playerLeftTheGame', game.players);
        socket.emit('ILeftTheGame')
        socket.leave(hostId);
    })

    socket.on('disconnect', async () => {
        await deactivateHost(userId)
        const activeHosts = await getActiveHosts();

        io.emit("updateHosts", activeHosts);
    });
});



app.get('/', (_req, _res) => {
    _res.send('<p>Hi, test!</p>')
})

app.use((_req, _res, next) => {
    next(new NotFoundError('Не найдено!'));
});

app.use(errorLogger);
app.use(errors());
app.use(centralizedErrorHandler);

server.listen(PORT, err => {
    if (err) console.log(err);
    console.log(`App listening on port:${PORT}`);
});
