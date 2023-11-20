import React, { createContext, useState, useContext, useEffect } from "react";
import strings from '../i18n/i18n'
import { getData, removeData, storeData } from "../services/AsyncStorageService";
import { ASYNC_DATA_KEY, ASYNC_DATA_TYPE, } from "../common/Constants";
import { login, googleLogin, refreshToken } from "../services/AuthService";
import { GoogleSignin, statusCodes, } from '@react-native-google-signin/google-signin';
import { getOwnInfo } from "../services/UserService";


// Create a context
const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [tenantId, setTenantId] = useState(null);
    const [aToken, setAToken] = useState(null);
    const [tokenExpire, setTokenExpire] = useState(null);
    const [rToken, setRToken] = useState(null);

    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userLastName, setUserLastName] = useState(null);

    const [loginError, setLoginError] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        resumeLogin();
    }, []);


    const resumeLogin = async () => {
        setLoading(true)
        try {
            setTenantId(await getData(ASYNC_DATA_KEY.LSUSERTENANT, ASYNC_DATA_TYPE.VALUE))
            setAToken(await getData(ASYNC_DATA_KEY.LSUSERTOKEN, ASYNC_DATA_TYPE.VALUE))
            setTokenExpire(Number(await getData(ASYNC_DATA_KEY.LSTOKENEXPIRE, ASYNC_DATA_TYPE.VALUE)))
            setRToken(await getData(ASYNC_DATA_KEY.LSUSERREFRESHTOKEN, ASYNC_DATA_TYPE.VALUE))
            setUserName(await getData(ASYNC_DATA_KEY.SSUN, ASYNC_DATA_TYPE.VALUE))
            setUserRole(await getData(ASYNC_DATA_KEY.SSUR, ASYNC_DATA_TYPE.VALUE))

            var expiring = Number(await getData(ASYNC_DATA_KEY.LSTOKENEXPIRE, ASYNC_DATA_TYPE.VALUE)) - (30 * 60 * 1000) < new Date().getTime()
            var token = await getData(ASYNC_DATA_KEY.LSUSERREFRESHTOKEN, ASYNC_DATA_TYPE.VALUE)
            if (expiring && token) {
                refreshToken(token).then(
                    async (response) => {
                        console.log("response", response.status)
                        if (response.status === 200 && response.data.code === "SUCCESS") {
                            setAToken(response.data.data.token)
                            setTokenExpire(response.data.data.expiration_time)

                            await storeData(ASYNC_DATA_KEY.LSUSERTOKEN, response.data.data.token, ASYNC_DATA_TYPE.VALUE)
                            await storeData(ASYNC_DATA_KEY.LSTOKENEXPIRE, '' + response.data.data.expiration_time, ASYNC_DATA_TYPE.VALUE)

                            setLoggedIn(true)
                        } else {
                            signOut()
                        }
                    }, () => { signOut() })
            }
        } catch (error) {
            setLoading(false);
        } finally {
            //loading finished
            setLoading(false);
        }
    }

    const signIn = async (email, password) => {
        setLoading(true)
        const response = await login(email, password).then(
            async (response) => {
                if (response.status === 200 && response.data.code === "SUCCESS") {
                    if (response.data.data.tenantId === 0) {
                        setLoggedIn(false)
                        setLoginError(strings.TENANT_NOT_EXISIT_MSG)
                        setLoading(false)
                        return false;
                    } else {
                        setTenantId(response.data.data.tenantId)
                        setAToken(response.data.data.token)
                        setTokenExpire(response.data.data.expiration_time)
                        setRToken(response.data.data.refreshToken)
                        setLoginError(null)

                        await storeData(ASYNC_DATA_KEY.LSUSERTOKEN, response.data.data.token, ASYNC_DATA_TYPE.VALUE)
                        await storeData(ASYNC_DATA_KEY.LSUSERTENANT, '' + response.data.data.tenantId, ASYNC_DATA_TYPE.VALUE)
                        await storeData(ASYNC_DATA_KEY.LSTOKENEXPIRE, '' + response.data.data.expiration_time, ASYNC_DATA_TYPE.VALUE)
                        await storeData(ASYNC_DATA_KEY.LSUSERREFRESHTOKEN, response.data.data.refreshToken, ASYNC_DATA_TYPE.VALUE)
                        const res = await getOwnInfo().then(
                            async (response) => {
                                if (response.status === 200 && response.data.code === "SUCCESS") {
                                    setUserName(response.data.data.firstName)
                                    setUserRole(response.data.data.roles)
                                    setUserEmail(response.data.data.email)
                                    setUserLastName(response.data.data.lastName)

                                    await storeData(ASYNC_DATA_KEY.SSUN, response.data.data.firstName, ASYNC_DATA_TYPE.VALUE)
                                    await storeData(ASYNC_DATA_KEY.SSUR, response.data.data.roles, ASYNC_DATA_TYPE.VALUE)
                                    setLoggedIn(true)
                                    setLoading(false)
                                    return true;
                                } else {
                                    setLoggedIn(false)
                                    setLoginError(strings.INVALID_USER_PWD)
                                    setLoading(false)
                                    return false;
                                }
                            }, (error) => {
                                console.log("3", error)
                                setLoggedIn(false)
                                setLoginError(strings.INVALID_USER_PWD)
                                setLoading(false)
                                return false;
                            })

                        return res;
                    }
                } else {
                    if (response.data.code === "ERROR" && response.data.data.message === "User not verifed") {
                        setLoggedIn(false)
                        setLoginError(strings.USER_NOT_VERIFED)
                        setLoading(false)
                        return false;
                    } else {
                        setLoggedIn(false)
                        setLoginError(strings.INVALID_USER_PWD)
                        setLoading(false)
                        return false;
                    }
                }
            }, () => {
                setLoggedIn(false)
                setLoginError(strings.INVALID_USER_PWD)
                setLoading(false)
                return false;
            }
        )
        return response;
    };

    const googleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signIn();
            const accessToken = (await GoogleSignin.getTokens()).accessToken;

            googleLogin(accessToken, true).then(
                async (response) => {
                    if (response.status === 200 && response.data.code === "SUCCESS") {
                        if (response.data.data.tenantId === 0) {
                            setLoggedIn(false)
                            setLoginError(strings.TENANT_NOT_EXISIT_MSG)
                            setLoading(false)
                        } else {
                            setLoggedIn(true)

                            setTenantId(response.data.data.tenantId)
                            setAToken(response.data.data.token)
                            setTokenExpire(response.data.data.expiration_time)
                            setRToken(response.data.data.refreshToken)
                            setLoginError(null)

                            await storeData(ASYNC_DATA_KEY.LSUSERTOKEN, response.data.data.token, ASYNC_DATA_TYPE.VALUE)
                            await storeData(ASYNC_DATA_KEY.LSUSERTENANT, '' + response.data.data.tenantId, ASYNC_DATA_TYPE.VALUE)
                            await storeData(ASYNC_DATA_KEY.LSTOKENEXPIRE, '' + response.data.data.expiration_time, ASYNC_DATA_TYPE.VALUE)
                            await storeData(ASYNC_DATA_KEY.LSUSERREFRESHTOKEN, response.data.data.refreshToken, ASYNC_DATA_TYPE.VALUE)

                            await getOwnInfo().then(
                                async (response) => {
                                    if (response.status === 200 && response.data.code === "SUCCESS") {
                                        setUserName(response.data.data.firstName)
                                        setUserRole(response.data.data.roles)

                                        await storeData(ASYNC_DATA_KEY.SSUN, response.data.data.firstName, ASYNC_DATA_TYPE.VALUE)
                                        await storeData(ASYNC_DATA_KEY.SSUR, response.data.data.roles, ASYNC_DATA_TYPE.VALUE)
                                        setLoggedIn(true)
                                        setLoading(false)
                                    } else {
                                        setLoggedIn(false)
                                        setLoginError(strings.INVALID_USER_PWD)
                                        setLoading(false)
                                    }
                                }, () => {
                                    setLoggedIn(false)
                                    setLoginError(strings.INVALID_USER_PWD)
                                    setLoading(false)
                                })
                        }
                    } else {
                        setLoggedIn(false)
                        setLoginError(strings.INVALID_USER_PWD)
                        setLoading(false)
                    }
                }, () => {
                    setLoggedIn(false)
                    setLoginError(strings.INVALID_USER_PWD)
                    setLoading(false)
                })

            GoogleSignin.signOut()
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User cancelled the login flow');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Signing in');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play services not available');
            } else {
                console.log('Some other error happened');
                console.log(error.message);
                console.log(error.code);
            }
            setLoggedIn(false)
            setLoginError(strings.INVALID_USER_PWD)
            setLoading(false)
        }

    };

    const signOut = async () => {
        console.log('sign out')
        setLoggedIn(false)
        setTenantId(null)
        setAToken(null)
        setTokenExpire(null)
        setRToken(null)
        setLoginError(null)
        setUserName(null)
        setUserRole(null)

        await removeData(ASYNC_DATA_KEY.LSUSERTOKEN)
        await removeData(ASYNC_DATA_KEY.LSUSERTENANT)
        await removeData(ASYNC_DATA_KEY.LSTOKENEXPIRE)
        await removeData(ASYNC_DATA_KEY.LSUSERREFRESHTOKEN)
        await removeData(ASYNC_DATA_KEY.SSUN)
        await removeData(ASYNC_DATA_KEY.SSUR)
    };

    return (
        <AuthContext.Provider value={{
            isLoggedIn, tenantId, aToken, tokenExpire, rToken, userName, userRole, loginError, loading, userEmail, userLastName,
            signIn, googleSignIn, signOut,
        }}>
            {children}
        </AuthContext.Provider>
    );
};


const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export { AuthContext, AuthProvider, useAuth };
