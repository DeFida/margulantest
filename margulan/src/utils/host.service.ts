import axios, { AxiosRequestConfig } from 'axios';

axios.defaults.withCredentials = true;

interface AuthAPIOptions {
  headers: AxiosRequestConfig['headers'];
  api: string;
}

export default class HostAPI {
  private headers: AxiosRequestConfig['headers'];
  private AUTH_API: string | undefined;

  constructor(options: AuthAPIOptions) {
    this.headers = options.headers;
    this.AUTH_API = options.api;
  }

  getHost(hostId: string) { 
    return axios.get(`${this.AUTH_API}/hosts/${hostId}`, { headers: this.headers });
  }

  getActiveHosts() {
    return axios.get(`${this.AUTH_API}/hosts`, { headers: this.headers });
  }

  createHost(data: {hostname: string, waitTime: number, maxUsers: number, points: number}) {
    return axios.post(`${this.AUTH_API}/hosts`, data, { headers: this.headers });
  }

  joinHost(hostId: string) {
    return axios.patch(`${this.AUTH_API}/hosts/join/${hostId}`, { headers: this.headers });
  }

  joinHostRandom(hostId: string) {
    return axios.patch(`${this.AUTH_API}/hosts/joinRandom/${hostId}`, { headers: this.headers });
  }

  checkHost() {
    return axios.get(`${this.AUTH_API}/hosts/checkHost`, { headers: this.headers });
  }   

  checkCurrentHost() {
    return axios.get(`${this.AUTH_API}/hosts/checkJoinHost`, { headers: this.headers }); 
  }

  deleteHost(hostId: string) {
    return axios.delete(`${this.AUTH_API}/hosts/${hostId}`, { headers: this.headers });
  }

}
