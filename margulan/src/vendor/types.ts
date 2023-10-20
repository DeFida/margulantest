import { User } from "../contexts/UserContext/UserContext";

export interface Game {
    _id: string;
    players: User[];
    points: {player: string, point: number}[];
    rounds: Round[];
}

export interface Round {
    _id: string;
    signs: {player: User, sign: string};
    timer: number;
    startTime: Date;
}

export interface Sign {
    _id: string;
    player: User;
    sign: string;
}