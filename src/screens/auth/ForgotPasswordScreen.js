
import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { View, StyleSheet, ScrollView, BackHandler, ImageBackground, TextInput } from 'react-native';
import { COLORS, TEXT_SIZE, APPICON, } from '../../common/Constants';
import strings from '../../i18n/i18n'
import ZText from '../../components/ZText';
import ZButton from '../../components/ZButton';
import ZLoading from '../../components/ZLoading'
import { forgotPassword } from '../../services/AuthService';

const ForgotPasswordScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [emailValid, setEmailValid] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleBackButtonClick = () => {
    navigation.navigate('Login')
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => { BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick); };
  }, [handleBackButtonClick]);

  const handleSubmit = async () => {
    setLoading(true)
    forgotPassword(email).then(
      async (response) => {
        if (response.status === 200 && response.data.code === "SUCCESS") {
          Toast.show({
            type: 'success',
            text1: response.data.code,
          });
          setLoading(false)
          navigation.navigate('Login')
        } else {
          setLoading(false)
          setErrorMsg(response.data)
        }
      }, () => {
        setLoading(false)
        setErrorMsg("user name / password incorrect")
      })
  }

  return (
    <View style={styles.container}>
      <ZLoading isLoading={isLoading} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
        <View style={{ flex: 1 }}>
          <View style={styles.logoContainer}>
            <ImageBackground source={{ uri: APPICON }} resizeMode="contain" style={styles.logo} />
            <ZText style={{ marginTop: 10 }} text={strings.FORGET_PASSWORD} size={TEXT_SIZE.TITLE} color={COLORS.LIGHTBLUE} fontWeight={'bold'} />
          </View>
          <View style={styles.inputContainer}>
            <ZText text={strings.EMAIL} fontWeight={'bold'} color={COLORS.WHITE} />
            <TextInput style={styles.textInput}
              onChangeText={(value) => setEmail(value)}
              value={email} />
            {errorMsg && <ZText text={errorMsg} color={COLORS.ERRORRED} size={TEXT_SIZE.SMALL} />}

            <ZButton text={strings.RESET_PASSWORD} color={COLORS.LIGHTBLUE} onPress={handleSubmit} />
            <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
              <ZText text={strings.BACK_TO_SIGN_IN} color={COLORS.LIGHTBLUE} onPress={() => navigation.navigate('Login')} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View >
  );

};

export default ForgotPasswordScreen;

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

