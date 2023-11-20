import { API_URL } from '../../config';
import Api from '../contexts/Api';

const BASE_URL = API_URL.AAS_URL;

// No Query Required ------------------------------------------
export const login = (email, password, rememberMe = true) => {
    var request = {
        "email": email,
        "password": password,
        "rememberMe": rememberMe,
    };

    return Api.POST_NOAUTH(BASE_URL + 'aas/login', request);
};

export const googleLogin = async (accessToken, rememberMe = true) => {
    var params = {
        code: accessToken,
        rememberMe: rememberMe
    };
    return Api.POST_NOAUTH(BASE_URL + 'aas/m/googlelogin', params);
};

export const refreshToken = async (token) => {
    return Api.POST_NOAUTH(BASE_URL + 'aas/refreshToken', { "token": token });
}

export const forgotPassword = async (email) => {
    var params = { email: email }
    return Api.POST_NOAUTH(BASE_URL + 'aas/forgotpassword', null, null, { params: params });
}

export const googleSignUp = async (code) => {
    var params = { "code": code }
    return Api.POST_NOAUTH(BASE_URL + 'aas/googlesignup', params);
}

export const signUp = (email, firstName, lastName, password, token) => {
    var request = {
        "email": email,
        "password": password,
        "firstName": firstName,
        "lastName": lastName
    }

    var params = { invitationtoken: token }

    return Api.POST(BASE_URL + 'aas/sign-up', request, { params: params });
}