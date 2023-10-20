import axios, { AxiosRequestConfig } from 'axios';

axios.defaults.withCredentials = true;

interface UserAPIOptions {
  headers: AxiosRequestConfig['headers'];
  api: string;
}

export default class UserAPI {
  private headers: AxiosRequestConfig['headers'];
  private API: string;

  constructor(options: UserAPIOptions) {
    this.headers = options.headers;
    this.API = options.api;
  }

  getMe() {
    return axios.get(`${this.API}/users/me`, { headers: this.headers });
  }
}
