
import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { COLORS, LANGUAGE_OPTIONS, ORDER_PREFIX, TEXT_SIZE, ORDER_MID_STRING } from '../../common/Constants';
import strings from '../../i18n/i18n'
import ZAccordionPicker from '../../components/ZAccordionPicker'
import ZText from '../../components/ZText';
import ZTextInput from '../../components/ZTextInput';
import ZButton from '../../components/ZButton';
import ZLoading from '../../components/ZLoading'
import { toastMsg } from '../../common/functions';
import { useSaveSetting, useSetting } from '../../services/SettingsService';

const SettingsScreen = (props) => {
  const [id, setId] = useState(null);
  const [language, setLanguage] = useState('');
  const [invNumberPrefix, setInvNumberPrefix] = useState('');
  const [doNumberPrefix, setDoNumberPrefix] = useState('');
  const [invNumberMid, setInvNumberMid] = useState('');
  const [doNumberMid, setDoNumberMid] = useState('');

  const { isFetching } = useSetting(
    (response) => {
        if (response.code === "SUCCESS") {
          let settings = response?.data;
          if (settings?.language == "EN") {
            strings.setLanguage('en')
          } else if (settings?.language == "CN") {
            strings.setLanguage('cn')
          } else if (settings?.language == "SL") {
            strings.setLanguage('sl')
          } else if (settings?.language == "MS") {
            strings.setLanguage('ms')
          } else {
            strings.setLanguage('en')
          }
    
          setId(settings?.id);
          setLanguage(settings?.language);
          setInvNumberPrefix(settings?.invNumberPrefix);
          setDoNumberPrefix(settings?.doNumberPrefix);
          setInvNumberMid(settings?.invNumberMid);
          setDoNumberMid(settings?.doNumberMid);
        } else {
          toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
        }
    },
    () => {
      toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
    }
  );

  const { mutate: createObj, isLoading: createLoading } = useSaveSetting(
    (response) => {
        if (response.data.code === "SUCCESS") {
          props.navigation.navigate("OverviewMain");
        } else {
          toastMsg(strings.SAVING_FAILED)
        }
  }, () => { toastMsg(strings.SAVING_FAILED) });

  const handleBackButtonClick = () => {
    props.navigation.navigate('OverviewMain')
    return true;
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => backHandler.remove();
  }, []);

  const saveSettingsFunc = async () => {
    var obj = {
      id: id,
      language: language,
      description: null,
      doNumberPrefix: doNumberPrefix,
      doNumberMid: doNumberMid,
      invNumberPrefix: invNumberPrefix,
      invNumberMid: invNumberMid,
    }
    createObj(obj);
  }

  const getMidStrSample = (value) => {
    var currentDate = new Date();
    var year = currentDate.getFullYear(); //To get the Current Year

    var month = currentDate.getMonth() + 1; //To get the Current Month
    month = (month <= 9) ? '0' + month : month;

    switch (value) {
      case ORDER_MID_STRING.YY:
        return year.toString().substring(2, 4) + '-'
      case ORDER_MID_STRING.YYMM:
        return year.toString().substring(2, 4) + month + '-'
      default:
        return '';
    }
  }

  return (
    <View style={styles.container}>
      <ZLoading isLoading={isFetching || createLoading} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>
        <View style={styles.section}>
          <View style={{ marginTop: 5 }}>
            <ZText text={strings.SELECT_LANGUAGE} size={TEXT_SIZE.BIG} />
          </View>
          <ZAccordionPicker
            title={strings.SELECT_LANGUAGE}
            data={LANGUAGE_OPTIONS}
            value={language}
            onSelect={(value) => setLanguage(value)}
          />
        </View>
        <View style={styles.section}>
          <View style={{ marginTop: 5 }}>
            <ZText text={strings.INVOICE_NUMBER_FORMAT} size={TEXT_SIZE.BIG} />
          </View>
          <View style={{ marginTop: 5, flexDirection: 'row' }}>
            <ZText text={strings.PREVIEW + ":"} size={TEXT_SIZE.NORMAL} />
            {invNumberPrefix ? <ZText text={invNumberPrefix.toUpperCase() + '-'} size={TEXT_SIZE.NORMAL} /> : null}
            <ZText text={ORDER_PREFIX.PREFIX_INV} size={TEXT_SIZE.NORMAL} />
            {invNumberMid ? <ZText text={getMidStrSample(invNumberMid)} size={TEXT_SIZE.NORMAL} /> : null}
            <ZText text={"00001"} size={TEXT_SIZE.NORMAL} />
          </View>
          <View style={styles.numberFormatInput}>
            <View style={{ flex: 1 }}>
              <ZTextInput title={strings.PREFIX} value={invNumberPrefix}
                onChangeText={(value) => setInvNumberPrefix(value)} />
            </View>
            <View style={{ justifyContent: 'center', marginTop: 30 }}>
              <ZText text={ORDER_PREFIX.PREFIX_INV} size={TEXT_SIZE.BIG} />
            </View>
            <View style={{ flex: 1 }}>
              <ZAccordionPicker
                title={''}
                data={ORDER_MID_STRING}
                value={invNumberMid}
                onSelect={(value) => setInvNumberMid(value)}
              />
            </View>
            <View style={{ justifyContent: 'center', marginTop: 30 }}>
              <ZText text={'-' + strings.RUNNING_SEQUENCE} size={TEXT_SIZE.BIG} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={{ marginTop: 5 }}>
            <ZText text={strings.DELIVERY_ORDER_NUMBER_FORMAT} size={TEXT_SIZE.BIG} />
          </View>
          <View style={{ marginTop: 5, flexDirection: 'row' }}>
            <ZText text={strings.PREVIEW} size={TEXT_SIZE.NORMAL} />
            {doNumberPrefix ? <ZText text={doNumberPrefix.toUpperCase() + '-'} size={TEXT_SIZE.NORMAL} /> : null}
            <ZText text={ORDER_PREFIX.PREFIX_DO} size={TEXT_SIZE.NORMAL} />
            {doNumberMid ? <ZText text={getMidStrSample(doNumberMid)} size={TEXT_SIZE.NORMAL} /> : null}
            <ZText text={"00001"} size={TEXT_SIZE.NORMAL} />
          </View>
          <View style={styles.numberFormatInput}>
            <View style={{ flex: 1 }}>
              <ZTextInput title={strings.PREFIX} value={doNumberPrefix}
                onChangeText={(value) => setDoNumberPrefix(value)} />
            </View>
            <View style={{ justifyContent: 'center', marginTop: 30 }}>
              <ZText text={ORDER_PREFIX.PREFIX_INV} size={TEXT_SIZE.BIG} />
            </View>
            <View style={{ flex: 1 }}>
              <ZAccordionPicker
                title={''}
                data={ORDER_MID_STRING}
                value={doNumberMid}
                onSelect={(value) => setDoNumberMid(value)}
              />
            </View>
            <View style={{ justifyContent: 'center', marginTop: 30 }}>
              <ZText text={'-' + strings.RUNNING_SEQUENCE} size={TEXT_SIZE.BIG} />
            </View>
          </View>
        </View>

        <ZButton text={strings.SAVE} icon={'content-save-outline'} onPress={saveSettingsFunc} />
      </ScrollView>
    </View >
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    borderBottomColor: COLORS.LIGHTGREY,
    borderBottomWidth: 1
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

