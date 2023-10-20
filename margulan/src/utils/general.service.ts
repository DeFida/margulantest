import axios, { AxiosRequestConfig } from 'axios';

axios.defaults.withCredentials = true;

interface GeneralAPIOptions {
    headers: AxiosRequestConfig['headers'];
    api: string;
}

export default class GeneralAPI {
    private headers: AxiosRequestConfig['headers'];
    private API: string;

    constructor(options: GeneralAPIOptions) {
        this.headers = options.headers;
        this.API = options.api;
    }
}
