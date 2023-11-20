
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, BackHandler, ImageBackground, TextInput } from 'react-native';
import { COLORS, TEXT_SIZE, APPICON } from '../../common/Constants';
import strings from '../../i18n/i18n';

import ZText from '../../components/ZText';
import ZButton from '../../components/ZButton';
import { useAuth } from '../../contexts/AuthContext';
import ZLoading from '../../components/ZLoading';
import { Text } from 'react-native-paper';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

export const LoginScreen = ({navigation}) => {
  const auth = useAuth();

  const [username, setUsername] = useState("user22@dummy.com");
  const [password, setPassword] = useState("Test@1234");

  const handleBackButtonClick = () => {
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => { BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick); };
  }, [handleBackButtonClick]);

  const signIn = async () => {
    const res = await auth.signIn(username, password);
    if (res) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'AUTH',
            state: {
              routes: [{name: 'Overview'}],
            },
          },
        ],
      });
    }
  };

  const handleGoogleLoginPressed = async () => {
    await auth.googleSignIn(username, password);
  }

  return (
    <View style={styles.container}>
      <ZLoading isLoading={auth.loading} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
        <View style={{ flex: 1 }}>
          <View style={styles.logoContainer}>
            <ImageBackground source={{ uri: APPICON }} resizeMode="contain" style={styles.logo} />
            <ZText style={{ marginTop: 10 }} text={'Eceipt Mobile'} size={TEXT_SIZE.TITLE} color={COLORS.YELLOW} fontWeight={'bold'} />
          </View>

          <View style={styles.inputContainer}>
            <ZText text={strings.EMAIL} fontWeight={'bold'} color={COLORS.WHITE} />
            <TextInput style={styles.textInput} onChangeText={(value) => setUsername(value)}
              value={username} />
            <ZText text={strings.PASSWORD} fontWeight={'bold'} color={COLORS.WHITE} />
            <TextInput style={styles.textInput} secureTextEntry={true}
              onChangeText={(value) => setPassword(value)}
              value={password} />

            {auth?.loginError && <ZText text={auth.loginError} color={COLORS.ERRORRED} size={TEXT_SIZE.SMALL} />}
            <View style={{ marginTop: 10 }}>
              <ZButton text={strings.SIGN_IN} color={COLORS.YELLOW} onPress={signIn} />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1, height: 0.5, backgroundColor: COLORS.SECONDRY }} />
              <View style={{ flex: 1, height: 20, borderColor: COLORS.LIGHTBLUE, borderWidth: 0.5, borderRadius: 5, alignItems: 'center' }} >
                <Text style={{ fontSize: TEXT_SIZE.SMALL, color: COLORS.GREY }} >{'OR'}</Text>
              </View>
              <View style={{ flex: 1, height: 0.5, backgroundColor: COLORS.SECONDRY }} />
            </View>

            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <GoogleSigninButton
                style={{ width: 192, height: 48, marginTop: 0 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={handleGoogleLoginPressed}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, height: 60, justifyContent: 'center', alignItems: 'flex-start' }}>
                <ZText text={strings.REGISTER_USER} color={COLORS.LIGHTBLUE} onPress={() => navigation.navigate('Registration')} />
              </View>
              <View style={{ flex: 1, height: 60, justifyContent: 'center', alignItems: 'flex-end' }}>
                <ZText text={strings.FORGET_PASSWORD} color={COLORS.LIGHTBLUE} onPress={() => navigation.navigate('ForgotPassword')} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View >
  );

};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.DARK_BLUE
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15
  },
  textInput: {
    fontSize: TEXT_SIZE.NORMAL,
    paddingLeft: 20,
    color: COLORS.DARK_BLUE,
    backgroundColor: COLORS.WHITE,
    height: 60,
    borderRadius: 5,

    marginBottom: 10,
    marginTop: 2,
    marginLeft: 5,
    marginRight: 5
  },
  logo: {
    width: 80,
    height: 80
  },
});

