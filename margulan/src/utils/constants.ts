import AuthAPI from './auth.service';
import GameAPI from './game.service';
import GeneralAPI from './general.service';
import HostAPI from './host.service';
import UserAPI from './user.service';

const defaultHeaders = {
    'Content-Type': 'application/json',
    'credentials': 'include',
    Credential: 'include',
    withCredentials: true,
    'Access-Control-Allow-Credentials': true
}

export const authAPI = new AuthAPI({
    headers: defaultHeaders,
    api: process.env.REACT_APP_BACKEND_API || ''
})

export const userAPI = new UserAPI({
    headers: defaultHeaders,
    api: process.env.REACT_APP_BACKEND_API || ''
})

export const generalAPI = new GeneralAPI({
    headers: defaultHeaders,
    api: process.env.REACT_APP_BACKEND_API || ''
})

export const hostAPI = new HostAPI({
    headers: defaultHeaders,
    api: process.env.REACT_APP_BACKEND_API || ''
})

export const gameAPI = new GameAPI({
    headers: defaultHeaders,
    api: process.env.REACT_APP_BACKEND_API || ''
})