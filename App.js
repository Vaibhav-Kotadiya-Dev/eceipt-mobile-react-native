import React, { useEffect } from 'react';

import { Router } from './src/routes/Router';
import { AuthProvider } from './src/contexts/AuthContext';
import SplashScreen from 'react-native-splash-screen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AxiosProvider } from './src/contexts/AxiosContext';
import {Provider as PaperProvider } from 'react-native-paper';

const App = () => {
  useEffect(() => {

    // getLanguageSetting()
    SplashScreen.hide();

    GoogleSignin.configure();
  }, []);

  return (
    <PaperProvider>
      <AuthProvider>
        <AxiosProvider>
          <Router />
        </AxiosProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
