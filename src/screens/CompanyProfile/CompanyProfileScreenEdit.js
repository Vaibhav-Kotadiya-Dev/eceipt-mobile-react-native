import React, {useState, useEffect} from 'react';
import { View, ScrollView, StyleSheet, BackHandler, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { COLORS, COUNTRY_LIST } from '../../common/Constants';
import { isStringEmpty } from '../../common/functions'
import ZText from '../../components/ZText'
import ZTextInput from '../../components/ZTextInput';
import ZButton from '../../components/ZButton';
import strings from '../../i18n/i18n'
import ZAccordionPicker from '../../components/ZAccordionPicker';
import { toastMsg } from '../../common/functions';
import ZIconButton from '../../components/ZIconButton';
import { useTenantInfo, useUpdateOwnTenantInfo, useUpdateTenantlogo } from '../../services/CompanyProfileService';
import ZLoading from '../../components/ZLoading';
import { Buffer } from "buffer";

const ProfileScreenEdit = (props) => {
  const [companyName, setCompanyName] = useState('');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [addr3, setAddr3] = useState('');
  const [addr4, setAddr4] = useState('');
  const [country, setCountry] = useState('');
  const [postCode, setPostCode] = useState('');
  const [phone, setPhone] = useState('');
  const [fax, setFax] = useState('');
  const [email, setEmail] = useState('');
  const [brn, setBrn] = useState('');
  const [currency, setCurrency] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [representative, setRepresentative] = useState('');
  const [companyIntro, setCompanyIntro] = useState('');
  const [owner, setOwner] = useState('');
  const [ownerFirstName, setOwnerFirstName] = useState('');
  const [ownerLastName, setOwnerLastName] = useState('');
  const [companyCode, setCompanyCode] = useState('');

  const { isLoading: fetchingCompanyProfile } = useTenantInfo(
    (response) => {
        if (response.code === "SUCCESS") {
          let companyProfile = response?.data;
          setCompanyName(companyProfile?.tenantName || '');
          setRepresentative(companyProfile?.representative || '');
          setCompanyIntro(companyProfile?.description || '');
          setAddr1(companyProfile?.addr1 || '');
          setAddr2(companyProfile?.addr2 || '');
          setAddr3(companyProfile?.addr3 || '');
          setAddr4(companyProfile?.addr4 || '');
          setCountry(companyProfile?.country || '');
          setPostCode(companyProfile?.postCode || '');
          setPhone(companyProfile?.contactNumber || '');
          setFax(companyProfile?.fax || '');
          setEmail(companyProfile?.email || '');
          setBrn(companyProfile?.brn || '');
          setCurrency(companyProfile?.mainCurrency || '');
          setCompanyLogo(companyProfile?.profileImage || '');
          setOwner(companyProfile?.owner || '');
          setOwnerFirstName(companyProfile?.ownerFirstName || '');
          setOwnerLastName(companyProfile?.ownerLastName || '');
          setCompanyCode(companyProfile?.tenantCode || '');
        } else {
          toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
        }
  }, () => { toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN); });

  const { mutate: updateTenantInfo, isLoading: updateLoading } = useUpdateOwnTenantInfo(
    (response) => {
        if (response.data.code === "SUCCESS") {
          global.DrawerNeedUpdate = true //for drawer to update
          setTimeout(() => {
            props.navigation.navigate("CompanyProfileView")
          }, 100);
        } else {
          toastMsg(strings.SAVING_FAILED)
        }
    },
    () => {
      toastMsg(strings.SAVING_FAILED)
  });

  const { mutate: updateTenantLogo, isLoading: updateImageLoading } = useUpdateTenantlogo(
    (response) => {
        if (response.data.code === "SUCCESS") {
          toastMsg(strings.IMAGE_UPLOADED);
        } else {
          toastMsg(response.data.message)
        }
    },
    (error) => {
      toastMsg(error.message)
  });

  const handleBackButtonClick = () => {
    props.navigation.navigate("CompanyProfileView")
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => backHandler.remove();
  }, []);

  const updateProfile = async () => {
    if (isStringEmpty(companyName)) {
      toastMsg(strings.COMPANY_PROFILE_EMPTY)
      return
    }
    if (isStringEmpty(representative)) {
      toastMsg(strings.COMPANY_REPRESENTATIVE_CANNOT_EMPTY)
      return
    }
    if (isStringEmpty(brn)) {
      toastMsg(strings.COMPANY_BRN_CANNOT_EMPTY)
      return
    }
    if (isStringEmpty(email)) {
      toastMsg(strings.COMPANY_EMAIL_CANNOT_EMPTY)
      return
    }
    if (isStringEmpty(phone)) {
      toastMsg(strings.COMPANY_PHONE_CANNOT_EMPTY)
      return
    }
    if (isStringEmpty(addr1)) {
      toastMsg(strings.ADDRESS_1_CANNOT_EMPTY)
      return
    }
    if (isStringEmpty(addr2)) {
      toastMsg(strings.ADDRESS_2_CANNOT_EMPTY)
      return
    }
    if (isStringEmpty(country)) {
      toastMsg(strings.COMPANY_COUNTRY_CANNOT_EMPTY)
      return
    }
    if (isStringEmpty(postCode)) {
      toastMsg(strings.COMPANY_POSTCODE_CANNOT_EMPTY)
      return
    }
    if (isStringEmpty(ownerFirstName)) {
      toastMsg(strings.COMPANY_OWNER_FIRST_NAME_CANNOT_EMPTY)
      return
    }
    if (isStringEmpty(ownerLastName)) {
      toastMsg(strings.COMPANY_OWNER_LAST_NAME_CANNOT_EMPTY)
      return
    }

    setIsLoading(true);

    var obj = {
      tenantName: companyName,
      representative: representative,
      description: companyIntro,
      addr1: addr1,
      addr2: addr2,
      addr3: addr3,
      addr4: addr4,
      country: country,
      postCode: postCode,
      contactNumber: phone,
      fax: fax,
      email: email,
      brn: brn,
      mainCurrency: currency,
      owner: owner,
      ownerFirstName: ownerFirstName,
      ownerLastName: ownerLastName,
      tenantCode: companyCode,
    }
    updateTenantInfo(obj);
  }

  const launchImageLibraryFunc = () => {
    let options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
      maxWidth: 400,
      maxHeight: 400,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const buffer = Buffer.from(response.assets[0]?.base64, "base64");
        const blob = new Blob([buffer], { type: response.assets?.[0]?.type })

        updateTenantLogo(blob);
      }
    });
  }

  return (
    <View style={styles.container} >
      <ZLoading isLoading={isLoading || fetchingCompanyProfile || updateLoading || updateImageLoading} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>
        <ZText text={strings.COMPANY_PROFILE_TEXT} size={20} />

        <View style={styles.companyLogo}>
          <View style={{ flexDirection: 'row', padding: 1, alignItems: 'center', }}>
            <View style={{ marginRight: 5, marginBottom: 5 }}>
              <ZText text={strings.COMPANY_LOGO} />
            </View>
            <ZIconButton text={strings.ADD} icon={'plus'}
              style={{ padding: 0, backgroundColor: COLORS.LIGHTBLUE, paddingLeft: 5, paddingRight: 10, }}
              onPress={launchImageLibraryFunc} />
            <View style={{ flex: 1, margin: 5 }}>
              {isStringEmpty(companyLogo) ? null :
                <Image style={{ width: 100, height: 60, alignSelf: 'center' }} resizeMode={'contain'}
                  source={{ uri: companyLogo }} />}
            </View>
          </View>

        </View>
        <View style={{ width: '90%', marginTop: 5, marginBottom: 5, borderWidth: 1, alignSelf: 'center', borderColor: COLORS.LIGHTGREY }}></View>

        <ZTextInput disabled title={strings.COMPANY_CODE} value={companyCode}
          onChangeText={(value) => setCompanyCode(value)} />
        <ZTextInput title={`${strings.COMPANY_NAME}*`} value={companyName}
          onChangeText={(value) => setCompanyName(value)} />
        <ZTextInput title={`${strings.REPRESENTATIVE}*`} value={representative}
          onChangeText={(value) => setRepresentative(value)} />
        <ZTextInput title={strings.COMPANY_INTRODUCTION} value={companyIntro}
          onChangeText={(value) => setCompanyIntro(value)} />
        <ZTextInput title={`${strings.BRN}*`} value={brn} onChangeText={(value) => setBrn(value)} />
        <ZTextInput title={`${strings.EMAIL}*`} value={email} onChangeText={(value) => setEmail(value)} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <ZTextInput title={`${strings.PHONE}*`} value={phone} onChangeText={(value) => setPhone(value)} />
          </View>
          <View style={{ flex: 1 }}>
            <ZTextInput title={strings.FAX} value={fax} onChangeText={(value) => setFax(value)} />
          </View>
        </View>
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
              title={`${strings.SELECT_COUNTRY}*`}
              data={COUNTRY_LIST}
              value={country}
              onSelect={(value) => setCountry(value)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ZTextInput title={`${strings.POSTCODE}*`} value={postCode} onChangeText={(value) => setPostCode(value)} />
          </View>
        </View>
        <ZTextInput disabled title={strings.OWNER} value={owner}
          onChangeText={(value) => setOwner(value)} />
        <ZTextInput title={`${strings.OWNER_FIRST_NAME}*`} value={ownerFirstName}
          onChangeText={(value) => setOwnerFirstName(value)} />
        <ZTextInput title={`${strings.OWNER_LAST_NAME}*`} value={ownerLastName}
          onChangeText={(value) => setOwnerLastName(value)} />
        <ZButton text={strings.SAVE} icon={'content-save-outline'} onPress={updateProfile} />
      </ScrollView>
    </View>
  );
}

export default ProfileScreenEdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  companyLogo: {
    flex: 1,
    borderColor: COLORS.GREY,
    backgroundColor: COLORS.WHITE,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 1
  }
});

