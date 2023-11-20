
import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { COLORS, TEXT_SIZE } from '../../common/Constants';
import strings from '../../i18n/i18n'
import ZText from '../../components/ZText';
import ZTextInput from '../../components/ZTextInput';
import ZButton from '../../components/ZButton';
import ZLoading from '../../components/ZLoading'
import ZCard from '../../components/ZCard';
import { isStringEmpty, testPasswordStrength, toastMsg } from '../../common/functions';
import { useAuth } from '../../contexts/AuthContext';
import { useUpdateTenantUserinfo, useAllTenantUser } from '../../services/UserService';

const UserProfileScreen = (props) => {
  const auth = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [hasErrorMsg, setHasErrorMsg] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const { mutate: updateUserinfo, isLoading: updateLoading } = useUpdateTenantUserinfo(
    (response) => {
        if (response.data.code === "SUCCESS") {
            setHasErrorMsg('');
            setNewPassword('');
            setHasError(false);
            toastMsg(strings.USER_INFO_UPDATED);
            props.navigation.navigate('Overview');
        } else {
          setHasErrorMsg('');
          setNewPassword('');
          setHasError(false);
          toastMsg(response.data.message)
        }
    },
    (error) => {
      setHasErrorMsg('');
      setNewPassword('');
      setHasError(false);
      toastMsg(error.message)
  });

  const { isLoading: fetchingUserInfo } = useAllTenantUser(
    (response) => {
        if (response.code === "SUCCESS") {
            response.data.sort((obj1, obj2) => obj1.id > obj2.id ? 1 : -1)
            var lst = response.data?.filter(u => u?.email === auth?.userEmail);
            setCurrentUser(lst?.[0]);
            setFirstName(lst?.[0]?.firstName || '');
            setLastName(lst?.[0]?.lastName || '');
        } else {
            toastMsg(response.data.message)
        }
    },
    (error) => {
        toastMsg(error.message)
  });

  const handleBackButtonClick = () => {
    props.navigation.navigate('SettingScreenTab')
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    return () => backHandler.remove();
  }, []);

  const handleChangePassword = async () => {
    if (!testPasswordStrength(newPassword)) {
      setHasError(true);
      setHasErrorMsg(strings.PASSWORD_STRENGTH_ERROR);
      return
    }

    if (isStringEmpty(firstName)) {
      setHasError(true);
      setHasErrorMsg(strings.USER_FIRST_NAME_CANNOT_EMPTY);
      return
    }

    if (isStringEmpty(lastName)) {
      setHasError(true);
      setHasErrorMsg(strings.USER_LAST_NAME_CANNOT_EMPTY);
      return
    }

    var data = {
      id: currentUser?.id,
      email: currentUser?.email,
      firstName: firstName,
      lastName: lastName,
      password: newPassword,
      roles: currentUser?.roles,
  }

   updateUserinfo(data)
  }

  return (
    <View style={styles.container}>
      <ZLoading isLoading={fetchingUserInfo || updateLoading} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>
          <ZCard>
            <ZText text={strings.USER} size={TEXT_SIZE.TITLE} />
            <View style={styles.section}>
              <View style={{ marginTop: 5 }}>
                <ZText text={strings.EMAIL + ' : '} size={TEXT_SIZE.BIG} />
              </View>
              <View style={{ flex: 1, marginTop: 5 }}>
                <ZText text={auth?.userEmail} size={TEXT_SIZE.BIG} />
              </View>
            </View>
          </ZCard>

          <ZCard>
            <ZText text={strings.UPDATE_USER_INFO} size={TEXT_SIZE.TITLE} />
            <ZTextInput title={strings.FIRSTNAME} value={firstName}
              onChangeText={(value) => setFirstName(value)} />
            <ZTextInput title={strings.LASTNAME} value={lastName}
              onChangeText={(value) => setLastName(value)} />
            <ZTextInput title={strings.NEW_PASSWORD} value={newPassword}
              onChangeText={(value) => setNewPassword(value)} />
            {/* <ZTextInput title={strings.CONFIRM_PASSWORD} value={confirmPassword}
              onChangeText={(value) => setConfirmPassword(value)} /> */}
            {hasError ? <ZText text={hasErrorMsg} color={COLORS.ERRORRED} size={TEXT_SIZE.SMALL} /> : null}
            <ZButton text={strings.CHANGE_PASSWORD} onPress={handleChangePassword} />
          </ZCard>
        </ScrollView>
    </View >
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.WHITE,
    padding: 5,
    margin: 5,
    borderRadius: 5,
    flexDirection: 'row'
  },
  numberFormatInput: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backupContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.ERRORRED,
    margin: 5,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10
  },
  backupButton: {
    flex: 1,
    flexDirection: 'row',
  }
});

