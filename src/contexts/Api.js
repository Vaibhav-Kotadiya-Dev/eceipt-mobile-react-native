import axios from 'axios';

const httpClient = axios.create();
httpClient.defaults.timeout = 5 * 60 * 1000;

const httpClientNoAuth = axios.create();
httpClientNoAuth.defaults.timeout = 5 * 60 * 1000;

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, POST, DELETE, OPTIONS',
    },
};

const formConfigData = {
    headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, POST, DELETE, OPTIONS',
    },
};
class Api {
    POST(url, payload = {}, headers, params) {
        return httpClient.post(url, payload, { headers: { ...axiosConfig.headers, ...headers }, ...params }).catch(function (error) { console.log(error); return Promise.reject(error); });
    }

    GET(url, headers, params) {
        return httpClient.get(url, { headers: { ...axiosConfig.headers, ...headers }, ...params }).catch(function (error) { console.log(error); return Promise.reject(error); });
    }

    POST_FORM_DATA(url, payload = {}, headers, params) {
        return httpClient.post(url, payload, { headers: { ...formConfigData.headers, ...headers }, ...params }).catch(function (error) { console.log(error); return Promise.reject(error); });
    }

    POST_NOAUTH(url, payload = {}, headers, params) {
        return httpClientNoAuth.post(url, payload, { headers: { ...axiosConfig.headers, ...headers }, ...params }).catch(function (error) { console.log(error); return Promise.reject(error); });
    }

    GET_NOAUTH(url, headers, params) {
        return httpClientNoAuth.get(url, { headers: { ...axiosConfig.headers, ...headers }, ...params }).catch(function (error) { console.log(error); return Promise.reject(error); });
    }
}
export { httpClient, httpClientNoAuth };
export default new Api();
