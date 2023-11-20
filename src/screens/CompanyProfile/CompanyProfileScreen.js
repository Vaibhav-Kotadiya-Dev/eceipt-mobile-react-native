import React, {useEffect, useState} from 'react';
import { View, ScrollView, StyleSheet, BackHandler, Image } from 'react-native';
import { COLORS, TEXT_SIZE } from '../../common/Constants';
import { isStringEmpty, toastMsg } from '../../common/functions'
import ZText from '../../components/ZText'
import ZButton from '../../components/ZButton';
import strings from '../../i18n/i18n'
import ZLoading from '../../components/ZLoading'
import { useTenantInfo } from '../../services/CompanyProfileService';

const ProfileScreen = (props) => {
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
  const [hasProfile, setHasProfile] = useState(false);
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
          setHasProfile(true);
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

  const handleBackButtonClick = () => {
    props.navigation.navigate('OverviewMain')
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <ZLoading isLoading={fetchingCompanyProfile} />
      <ScrollView>

        <ZText text={strings.COMPANY_PROFILE_TEXT} size={20} />
        <View style={{ width: '90%', marginTop: 5, marginBottom: 5, borderWidth: 1, alignSelf: 'center', borderColor: COLORS.LIGHTGREY }}></View>
        <View style={{ width: '100%', alignItems: 'center', backgroundColor: COLORS.LIGHTGREY }}>
          {hasProfile ? null : <ZText text={strings.NO_PROFILE_MSG} color={COLORS.ERRORRED} size={TEXT_SIZE.NORMAL} />}
          <View style={{ flex: 1, margin: 5 }}>
            {isStringEmpty(companyLogo) ? null :
              <Image style={{ width: 100, height: 60, alignSelf: 'center' }} resizeMode={'contain'}
                source={{ uri: companyLogo }} />}
          </View>
          <ZText text={owner} size={TEXT_SIZE.NORMAL} fontWeight={'bold'} />
          <ZText text={ownerFirstName} size={TEXT_SIZE.NORMAL} fontWeight={'bold'} />
          <ZText text={ownerLastName} size={TEXT_SIZE.NORMAL} fontWeight={'bold'} />
          <ZText text={companyCode} size={TEXT_SIZE.NORMAL} fontWeight={'bold'} />
          <ZText text={companyName} size={TEXT_SIZE.NORMAL} fontWeight={'bold'} />
          <ZText text={representative} size={TEXT_SIZE.NORMAL} fontWeight={'bold'} />
          <ZText text={companyIntro} size={TEXT_SIZE.NORMAL} fontWeight={'bold'} />
          {addr1 == '' ? null : <ZText text={addr1} size={TEXT_SIZE.NORMAL} />}
          {addr2 == '' ? null : <ZText text={addr2} size={TEXT_SIZE.NORMAL} />}
          {addr3 == '' ? null : <ZText text={addr3} size={TEXT_SIZE.NORMAL} />}
          {addr4 == '' ? null : <ZText text={addr4} size={TEXT_SIZE.NORMAL} />}
          <View style={{ flexDirection: 'row' }}>
            {country == '' ? null : <ZText text={country} size={TEXT_SIZE.NORMAL} />}
            {postCode == '' ? null : <ZText text={postCode} size={TEXT_SIZE.NORMAL} />}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {phone == '' ? null : <ZText text={strings.PHONE + ':'} size={TEXT_SIZE.NORMAL} />}
            {phone == '' ? null : <ZText text={phone} size={TEXT_SIZE.NORMAL} />}
            {fax == '' ? null : <ZText text={' ' + strings.FAX + ':'} size={TEXT_SIZE.NORMAL} />}
            {fax == '' ? null : <ZText text={fax} size={TEXT_SIZE.NORMAL} />}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {email == '' ? null : <ZText text={strings.EMAIL + ':'} size={TEXT_SIZE.NORMAL} />}
            {email == '' ? null : <ZText text={email} size={TEXT_SIZE.NORMAL} />}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {brn == '' ? null : <ZText text={strings.BRN + ':'} size={TEXT_SIZE.NORMAL} />}
            {brn == '' ? null : <ZText text={brn} size={TEXT_SIZE.NORMAL} />}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {currency == '' ? null : <ZText text={strings.CURRENCY + ':'} size={TEXT_SIZE.NORMAL} />}
            {currency == '' ? null : <ZText text={currency} size={TEXT_SIZE.NORMAL} />}
          </View>
        </View>

        <View style={{ width: '90%', marginTop: 5, marginBottom: 5, borderWidth: 1, alignSelf: 'center', borderColor: COLORS.LIGHTGREY }}></View>

        <ZButton text={strings.EDIT} icon={'pencil-box-outline'} onPress={() => { props.navigation.push("CompanyProfileEdit") }} />
      </ScrollView>
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

