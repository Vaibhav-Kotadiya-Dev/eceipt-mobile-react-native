
import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ScrollView, BackHandler, TextInput } from 'react-native';
import { COLORS, TEXT_SIZE } from '../../common/Constants';
import ZText from '../../components/ZText';
import ZButton from '../../components/ZButton';
import strings from '../../i18n/i18n'
import { validateEmail, testPasswordStrength, isStringEmpty } from '../../common/functions';
import ZLoading from '../../components/ZLoading'
import ZModal from '../../components/ZModal';
import { signUp } from '../../services/AuthService';

const RegistrationScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);

  const handleBackButtonClick = () => {
    props.navigation.navigate('Login');
    return true
  };


  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);

    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick,
      );
    };
  }, []);

  const handleRegisterPressed = async () => {
    setIsLoading(true);

    if (!validateEmail(email)) {
      setEmailError(true);
      setIsLoading(false);
      return
    } else {
      setEmailError(false);
    }

    if (isStringEmpty(firstName)) {
      setFirstNameError(true);
      setIsLoading(false);
      return
    } else {
      setFirstNameError(false)
    }

    if (isStringEmpty(lastName)) {
      setLastNameError(true);
      setIsLoading(false);
      return
    } else {
      setLastNameError(false)
    }

    if (!testPasswordStrength(password)) {
      setPasswordError(true);
      setPasswordErrorMsg(strings.PASSWORD_STRENGTH_ERROR);
      setIsLoading(false);
      return
    } else {
      setPasswordError(false);
    }

    const result = await signUp(email, firstName, lastName, password, null)
    if (result.status === 200 && result.data.code === "SUCCESS") {
      setInfoModalVisible(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setPasswordError(true);
      setPasswordErrorMsg(result.data?.message)
    }
  }

  const infoModalSuccessful = () => {
    setInfoModalVisible(false);
    props.navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
      <ZLoading isLoading={isLoading} />

      <ZModal
        title={strings.USER_REGISTERED}forgotPassword
        text={strings.NEED_EMAIL_VERIFICATION}
        cancelButton={false}
        deleteButton={false}
        okText={strings.OK}
        visible={infoModalVisible}
        onPressOK={infoModalSuccessful}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} >
        <View style={{ flex: 1 }}>
          <View style={styles.logoContainer}>
            <ZText style={{ marginTop: 10 }} text={strings.REGISTER_USER} size={TEXT_SIZE.TITLE} color={COLORS.LIGHTBLUE} fontWeight={'bold'} />
          </View>
          <View style={styles.inputContainer}>
            <ZText text={strings.EMAIL} fontWeight={'bold'} color={COLORS.WHITE} />
            <TextInput style={styles.textInput}
              onChangeText={(value) => setEmail(value)}
              value={email} />
            {emailError ? <ZText text={strings.INVALID_EMAIL} color={COLORS.ERRORRED} size={TEXT_SIZE.SMALL} /> : null}

            <ZText text={strings.FIRSTNAME} fontWeight={'bold'} color={COLORS.WHITE} />
            <TextInput style={styles.textInput}
              onChangeText={(value) => setFirstName(value)}
              value={firstName} />
            {firstNameError ? <ZText text={strings.USER_FIRST_NAME_CANNOT_EMPTY} color={COLORS.ERRORRED} size={TEXT_SIZE.SMALL} /> : null}

            <ZText text={strings.LASTNAME} fontWeight={'bold'} color={COLORS.WHITE} />
            <TextInput style={styles.textInput}
              onChangeText={(value) => setLastName(value)}
              value={lastName} />
            {lastNameError ? <ZText text={strings.USER_LAST_NAME_CANNOT_EMPTY} color={COLORS.ERRORRED} size={TEXT_SIZE.SMALL} /> : null}

            <ZText text={strings.PASSWORD} fontWeight={'bold'} color={COLORS.WHITE} />
            <TextInput style={styles.textInput} secureTextEntry={true}
              onChangeText={(value) => setPassword(value)}
              value={password} />
            {passwordError ? <ZText text={passwordErrorMsg} color={COLORS.ERRORRED} size={TEXT_SIZE.SMALL} /> : null}

            <ZButton text={strings.REGISTER} color={COLORS.LIGHTBLUE} onPress={handleRegisterPressed} />
            <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
              <ZText text={strings.BACK_TO_SIGN_IN} color={COLORS.LIGHTBLUE} onPress={() => props.navigation.navigate('Login')} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View >
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.DARK_BLUE
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 15
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

