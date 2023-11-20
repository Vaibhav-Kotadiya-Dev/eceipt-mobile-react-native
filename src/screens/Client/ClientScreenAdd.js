import React, {useState, useEffect} from 'react';
import { View, ScrollView, StyleSheet, BackHandler } from 'react-native';
import { COUNTRY_LIST } from '../../common/Constants';
import { isStringEmpty, toastMsg } from '../../common/functions';
import ZTextInput from '../../components/ZTextInput';
import ZButton from '../../components/ZButton';
import strings from '../../i18n/i18n'
import ZAccordionPicker from '../../components/ZAccordionPicker';
import ZLoading from '../../components/ZLoading'
import { useCreateClient } from '../../services/ClientService';

const ClientScreenAdd = (props) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [shortname, setShortname] = useState('');
  const [description, setDescription] = useState('');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [addr3, setAddr3] = useState('');
  const [addr4, setAddr4] = useState('');
  const [country, setCountry] = useState('US');
  const [postCode, setPostCode] = useState('');
  const [representative, setRepresentative] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [fax, setFax] = useState('');
  const [email, setEmail] = useState('');
  const [remark, setRemark] = useState('');

  const { mutate: createObj, isLoading: createLoading } = useCreateClient(
    (response) => {
        if (response.data.code === "SUCCESS") {
          setId('');
          setName('');
          setShortname('');
          setDescription('');
          setAddr1('');
          setAddr2('');
          setAddr3('');
          setAddr4('');
          setCountry('');
          setPostCode('');
          setContactNumber('');
          setFax('');
          setEmail('');
          setRemark('');
          setRepresentative('');    
          setTimeout(() => {
            props.navigation.navigate("ClientList")
          }, 100);
        } else {
          setId('');
          setName('');
          setShortname('');
          setDescription('');
          setAddr1('');
          setAddr2('');
          setAddr3('');
          setAddr4('');
          setCountry('');
          setPostCode('');
          setContactNumber('');
          setFax('');
          setEmail('');
          setRemark('');
          setRepresentative('');
          toastMsg(strings.SAVING_FAILED);
        }
    },
    () => {
      setId('');
      setName('');
      setShortname('');
      setDescription('');
      setAddr1('');
      setAddr2('');
      setAddr3('');
      setAddr4('');
      setCountry('');
      setPostCode('');
      setContactNumber('');
      setFax('');
      setEmail('');
      setRemark('');
      setRepresentative('');
      toastMsg(strings.SAVING_FAILED);
  });

  const handleBackButtonClick = () => {
    props.navigation.navigate('ClientList')
    return true;
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => backHandler.remove();
  }, [])

  const saveClient = async () => {
    var client = {
      id: null,
      name: name,
      shortname: shortname,
      description: description,
      addr1: addr1,
      addr2: addr2,
      addr3: addr3,
      addr4: addr4,
      country: country,
      postCode: postCode,
      representative: representative,
      contactNumber: contactNumber,
      fax: fax,
      email: email,
      remark: remark,
    }
    createObj(client);
  }

  const handleSaveClient = async () => {
    if (isStringEmpty(name)) {
      toastMsg(strings.NAME_CANNOT_EMPTY)
      return;
    }
    if (isStringEmpty(shortname)) {
      toastMsg(strings.SHORT_NAME_CANNOT_EMPTY)
      return;
    }
    if (isStringEmpty(addr1)) {
      toastMsg(strings.ADDRESS_1_CANNOT_EMPTY)
      return;
    }
    if (isStringEmpty(addr2)) {
      toastMsg(strings.ADDRESS_2_CANNOT_EMPTY)
      return;
    }
    if (isStringEmpty(postCode)) {
      toastMsg(strings.POSTCODE_CANNOT_EMPTY)
      return;
    }
    if (isStringEmpty(representative)) {
      toastMsg(strings.REPRESENTATIVE_CANNOT_EMPTY)
      return;
    }
    if (isStringEmpty(email)) {
      toastMsg(strings.EMAIL_CANNOT_EMPTY)
      return;
    }
    if (isStringEmpty(contactNumber)) {
      toastMsg(strings.CONTACT_NUMBER_CANNOT_EMPTY)
      return;
    }
    saveClient()
  }

  return (
    <View style={styles.container} >
      <ZLoading isLoading={createLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ZTextInput title={`${strings.NAME}*`} value={name}
          onChangeText={(value) => setName(value)} />
        <ZTextInput title={`${strings.CLIENT_SHORT_NAME}*`} value={shortname}
          onChangeText={(value) => setShortname(value)} />
        <ZTextInput title={strings.COMPANY_INTRODUCTION} value={description}
          onChangeText={(value) => setDescription(value)} />
        <ZTextInput title={`${strings.ADDR_LINE1}*`} value={addr1}
          onChangeText={(value) => setAddr1(value)} />
        <ZTextInput title={`${strings.ADDR_LINE2}*`} value={addr2}
          onChangeText={(value) => setAddr2(value)} />
        <ZTextInput title={strings.ADDR_LINE3} value={addr3}
          onChangeText={(value) => setAddr3(value)} />
        <ZTextInput title={strings.ADDR_LINE4} value={addr4}
          onChangeText={(value) => setAddr4(value)} />

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <ZAccordionPicker
              title={strings.SELECT_COUNTRY}
              data={COUNTRY_LIST}
              value={country}
              onSelect={(value) => setCountry(value)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ZTextInput title={`${strings.POSTCODE}*`} value={postCode}
              onChangeText={(value) => setPostCode(value)} />
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <ZTextInput title={`${strings.PHONE}*`} value={contactNumber}
              onChangeText={(value) => setContactNumber(value)} />
          </View>
          <View style={{ flex: 1 }}>
            <ZTextInput title={strings.FAX} value={fax}
              onChangeText={(value) => setFax(value)} />
          </View>
        </View>
        <ZTextInput title={`${strings.REPRESENTATIVE}*`} value={representative}
          onChangeText={(value) => setRepresentative(value)} />
        <ZTextInput title={`${strings.EMAIL}*`} value={email}
          onChangeText={(value) => setEmail(value)} />

        <ZTextInput title={strings.REMARKS} value={remark}
          onChangeText={(value) => setRemark(value)} />

        <ZButton text={strings.SAVE} icon={'content-save-outline'} onPress={() => { handleSaveClient() }} />

      </ScrollView>
    </View>
  );
}

export default ClientScreenAdd;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 5
  },
});

