import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { url } from "./App";

const refreshToken = async () => {
    try {
        const res = await axios.post(`${url}/api/client/refresh`, {}, {
            withCredentials: true
        })
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const createAxios = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create()
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date()
            const decodeToken = jwtDecode(user?.accessToken)
            if (decodeToken.exp < date.getTime() / 1000) {
                const data = await refreshToken()
                const refreshUser = {
                    ...user,
                    accessToken: data.accessToken,
                }
                dispatch(stateSuccess(refreshUser))
                config.headers["token"] = "Bearer " + data.accessToken
            }
            return config
        },
        (err) => {
            return Promise.reject(err)
        }
    )
    return newInstance
}