import axios, { AxiosRequestConfig } from 'axios';

axios.defaults.withCredentials = true;

interface AuthAPIOptions {
  headers: AxiosRequestConfig['headers'];
  api: string;
}

export default class AuthAPI {
  private headers: AxiosRequestConfig['headers'];
  private AUTH_API: string | undefined;

  constructor(options: AuthAPIOptions) {
    this.headers = options.headers;
    this.AUTH_API = options.api;
  }

  login(username: string, password: string) {
    return axios.post(`${this.AUTH_API}/login`, { username, password }, { headers: this.headers });
  }

  register(username: string, password: string) {
    
    return axios.post(
      `${this.AUTH_API}/register`,
      { username, password },
      { headers: this.headers }
    );
  }

  logout() {
    return axios.post(`${this.AUTH_API}/logout`, {}, { headers: this.headers });
  }

  checkAuth() {
    return axios.get(`${this.AUTH_API}/checkAuth`, { headers: this.headers });
  }
}
