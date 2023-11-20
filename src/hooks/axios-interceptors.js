import axios from 'axios';
import { ASYNC_DATA_KEY, ASYNC_DATA_TYPE } from '../common/Constants';
import { getData, storeData } from '../services/AsyncStorageService';
import { httpClient } from '../contexts/Api';
import { API_URL } from '../../config';

const BASE_URL = API_URL.AAS_URL;

export default {
    setupInterceptors: () => {
        httpClient.interceptors.request.use(
            async (config) => {
                // YOU CAN ADD CODE TO OPEN A LOADER HERE
                const expiring = Number(await getData(ASYNC_DATA_KEY.LSTOKENEXPIRE, ASYNC_DATA_TYPE.VALUE)) - (30 * 60 * 1000) < new Date().getTime()
                const token = await getData(ASYNC_DATA_KEY.LSUSERREFRESHTOKEN, ASYNC_DATA_TYPE.VALUE)
                const tenantId = await getData(ASYNC_DATA_KEY.LSUSERTENANT);

                if (expiring && token) {
                    let newToken = ''
                    let expirationTime = 0
                    try {
                        const Headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
                        const response = await axios.post(BASE_URL + 'aas/refreshToken', { token: token }, { headers: Headers });
                        newToken = response.data.data.token;
                        expirationTime = response.data.data.expiration_time;
                    } catch (err) {
                        if (err.response.status === 401) {
                            // IF THE RESPONSE IS 401 FROM THE refreshToken ROUTE, THEN IT MEANS THAT THE refreshToken ALSO HAS EXPIRED. THEN WE REDIRECT USER TO LOGIN SCREEN TO GET A NEW REFRESH_TOKEN
                        }
                        return Promise.reject(err);
                    }
                    await storeData(ASYNC_DATA_KEY.LSUSERTOKEN, newToken, ASYNC_DATA_TYPE.VALUE)
                    await storeData(ASYNC_DATA_KEY.LSTOKENEXPIRE, '' + expirationTime, ASYNC_DATA_TYPE.VALUE)
                    config.headers.Authorization = `Bearer ${newToken}`;
                    config.headers.tenantId = tenantId;
                    return config

                } else {
                    const token = await getData(ASYNC_DATA_KEY.LSUSERTOKEN);

                    config.headers.Authorization = `Bearer ${token}`;
                    config.headers.tenantId = tenantId;
                    return config
                }
            },
            function (err) {
                console.log("Error:", err)
                return Promise.reject(err);
            }
        );

        httpClient.interceptors.response.use(
            (response) => {
                // YOU CAN ADD CODE TO CLOSE A LOADER HERE
                return response;
            },
            (error) => {
                // YOU CAN ADD CODE TO CLOSE A LOADER HERE
                return Promise.reject(error);
            }
        );
    },
};
