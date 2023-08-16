import { User } from "../models/user";
import axios from "axios";
import RequestService from "./request";

const PUBLIC_URL = process.env.REACT_APP_API;
const CLIENT_URL = process.env.PUBLIC_URL;

const AuthWithToken = async (token: string) => {
    if (token && token.length > 0) {
        console.log("Auth with token")
        //Token passed TODO: User with token
        return fetch(`${PUBLIC_URL}/`,
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
                method: 'GET'
            })
            .then(res => {
                // Unfortunately, fetch doesn't send (404 error) into the cache itself
                // You have to send it, as I have done below
                if (res.status >= 400) {
                    throw new Error("Server responds with error!");
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                if (data) {
                    return { ok: true, response: token, user: data };
                }
                else {
                    return { ok: false, response: "Une erreur est survenue" };
                }
            })
            .catch((error) => {
                console.error(JSON.stringify(error));
                return new Promise<{ ok: boolean, response: string } | undefined>((resolve) => {
                    resolve({ ok: false, response: "Une erreur est survenue" });
                });
            });
    } else {
        return {
            ok: false,
            response: "",
            user: undefined
        }
    }
}

const Auth = async (username?: string, password?: string): Promise<{ ok: boolean, response: string, user?: User | undefined } | undefined> => {
    return axios({
        url: `${PUBLIC_URL}/auth/signin`,
        method: 'post',
        data: { username, password }
    })
        .then(res => {
            if (res.data.error) {
                return { ok: false, response: res.data.error }
            } else {
                const user = res.data
                return { ok: true, response: res.data.accessToken, user }
            }
        })
        .catch((error) => {
            console.error(error);
            return { ok: false, response: "Une erreur est survenue" }
        })
}

const resetPassword = async (data: { oldPassword: string, newPassword: string }) => {
    const user = localStorage.getItem('user')
    const userId = user ? JSON.parse(user).id : ''
    let req = new RequestService();
    const res = req.fetchEndpoint(`auth/changePassword`, 'POST', { ...data, id: userId })
    return res;
}

const forgetPassword = async (email: string) => {
    return axios({
        url: `${PUBLIC_URL}/auth/forgetPassword`,
        method: 'post',
        data: {
            email,
            clientUrl: CLIENT_URL
        }
    })
}

const resetPasswordToken = async (password: string, token: string) => {
    const data = {
        newPassword: password,
        token: token
    }
    return axios({
        url: `${PUBLIC_URL}/auth/resetPasswordWithToken`,
        method: 'post',
        data: data,
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    })
}

export {
    AuthWithToken,
    Auth,
    resetPassword,
    forgetPassword,
    resetPasswordToken
}
