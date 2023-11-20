import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import RegistrationScreen from '../screens/auth/RegistrationScreen';

const AuthorizationStack = createStackNavigator();
export const AuthorizationStackScreen = ({ navigation }) => {
    return (
        <AuthorizationStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <AuthorizationStack.Screen name={'Login'} component={LoginScreen} />
            <AuthorizationStack.Screen name={'Registration'} component={RegistrationScreen} />
            <AuthorizationStack.Screen name={'ForgotPassword'} component={ForgotPasswordScreen} />
        </AuthorizationStack.Navigator>
    );
};

export default AuthorizationStackScreen;