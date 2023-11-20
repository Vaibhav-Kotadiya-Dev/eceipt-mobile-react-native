
import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { COLORS, TEXT_SIZE } from '../../common/Constants';
import strings from '../../i18n/i18n'
import ZText from '../../components/ZText';
import ZTextInput from '../../components/ZTextInput';
import ZButton from '../../components/ZButton';
import ZLoading from '../../components/ZLoading'
import ZModal from '../../components/ZModal'
import { useSendSupportEmail } from '../../services/SupportService';
import { useTenantInfo } from '../../services/CompanyProfileService';
import { toastMsg } from '../../common/functions';

const ContactUs = (props) => {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [hasError, setHasError] = useState(false);
  const [hasErrorMsg, setHasErrorMsg] = useState('');
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const handleBackButtonClick = () => {
    props.navigation.navigate('OverviewOrder')
    return true;
  };

  const { isLoading: fetchingCompanyProfile } = useTenantInfo(
    (response) => {
        if (response.code === "SUCCESS") {
          let companyProfile = response?.data;
          setTenantName(companyProfile?.tenantName || '');
        } else {
          toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
        }
    }, () => { toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN); });

  const { mutate: sendSupportEmail, isLoading } = useSendSupportEmail(
    (response) => {
        if (response.data.code === "SUCCESS") {
          setInfoModalVisible(true);
        } else {
            setHasError(true);
            setHasErrorMsg(response.data.message);
            setEmail('');
            setDescription('');
            setName('');
        }
    }, (error) => { 
      setHasError(true);
      setHasErrorMsg(error.message);
      setEmail('');
      setDescription('');
      setName('');
    })


  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    return () => backHandler.remove();
  }, []);

  const handleSend = async () => {
    if (email.length == 0 || description.length == 0 || name.length == 0) {
      setHasError(true);
      setHasErrorMsg('Please complete your message.');
      return
    }   

    var data = {
      tenantName: tenantName,
      email: email,
      name: name,
      contents: description
  }

  sendSupportEmail(data);
  }

  return (
    <View style={styles.container}>
      <ZLoading isLoading={isLoading || fetchingCompanyProfile} />
      <ZModal
        title={strings.SUCCESS_FEEDBACK_MSG}
        okButton={true}
        deleteButton={false}
        cancelButton={false}
        okText={strings.OK}
        deleteText={strings.OK}
        visible={infoModalVisible}
        onPressOK={() => {
          setInfoModalVisible(false);
          props.navigation.navigate('OverviewOrder');
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>
        <ZText style={{ marginBottom: 5 }} text={strings.CONTACT_US_MSG} size={TEXT_SIZE.NORMAL} />

        <ZTextInput title={strings.EMAIL} value={email}
          onChangeText={(value) => setEmail(value)} />

        <ZTextInput title={strings.NAME} value={name}
          onChangeText={(value) => setName(value)} />

        <ZTextInput title={strings.DESCRIPTION} value={description} multiline={true} numberOfLines={10}
          onChangeText={(value) => setDescription(value)} />


        {hasError ? <ZText text={hasErrorMsg} color={COLORS.ERRORRED} size={TEXT_SIZE.SMALL} /> : null}
        <View style={{ marginTop: 10 }}>
          <ZButton text={strings.SEND} color={COLORS.PRIMARY} onPress={handleSend} />
        </View>

      </ScrollView>
    </View >
  );
}

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
  },
  section: {
    borderBottomColor: COLORS.LIGHTGREY,
    borderBottomWidth: 1
  },
  numberFormatInput: {
    flexDirection: 'row',

    alignItems: 'flex-start',
  },
});

