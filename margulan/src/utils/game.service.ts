import axios, { AxiosRequestConfig } from 'axios';

axios.defaults.withCredentials = true;

interface AuthAPIOptions {
  headers: AxiosRequestConfig['headers'];
  api: string;
}

export default class GameAPI {
  private headers: AxiosRequestConfig['headers'];
  private AUTH_API: string | undefined;

  constructor(options: AuthAPIOptions) {
    this.headers = options.headers;
    this.AUTH_API = options.api;
  }

  getGame(gameId: string) { 
    return axios.get(`${this.AUTH_API}/games/${gameId}`, { headers: this.headers });
  }

  getGames() {
    return axios.get(`${this.AUTH_API}/games`, { headers: this.headers });
  }

  joinGame(gameId: string) {
    return axios.post(`${this.AUTH_API}/games/join`, {gameId}, { headers: this.headers });
  }

  leaveGame(data: {userId: string, hostId: string, gameId: string}) {

    return axios.post(`${this.AUTH_API}/games/leave`, data, { headers: this.headers });
  }
}
