import React, {useState, useEffect} from 'react';
import { View, ScrollView, StyleSheet, Keyboard } from 'react-native';
import { COLORS } from '../../common/Constants';
import { toastMsg } from '../../common/functions';
import strings from '../../i18n/i18n'
import ZTextInput from '../../components/ZTextInput';
import ZButton from '../../components/ZButton';
import ZLoading from '../../components/ZLoading'
import { useUpdateTermType } from '../../services/TermsTypeService';

const TermsScreenEdit = (props) => {
  const [termsId, setTermsId] = useState(null);
  const [terms, setTerms] = useState('');
  const [type, setType] = useState('');

  const { mutate: updateObj, isLoading: updateLoading } = useUpdateTermType(
    (response) => {
        if (response.data.code === "SUCCESS") {
          setTermsId(null);
          setTerms('');
          setType('');
          setTimeout(() => {
            props.navigation.navigate("TermsTypeList");
          }, 100);
        } else {
          toastMsg(strings.SAVING_FAILED);
        }
    },
    () => {
      toastMsg(strings.SAVING_FAILED);
  });

  useEffect(() => {
    setTermsId(props.route.params.term?.id);
    setTerms(props.route.params.term?.description);
    setType(props.route.params.term?.type);
  }, []);

  const saveTerms = async () => {
    var obj = {
      id: termsId,
      description: terms,
      type: type
    }
    updateObj(obj);
  };

  const handleSaveTerms = () => {
    if (type.length > 0 && terms.length > 0) {
      Keyboard.dismiss()
      saveTerms()
    } else {
      Keyboard.dismiss()
      toastMsg(strings.NEED_COMPLETE_ALL_FIELD)
    }
  };


  return (
    <View style={styles.container} >
      <ZLoading isLoading={updateLoading} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}} style={{}}>
        <ZTextInput title={strings.NAME} value={type}
          onChangeText={(value) => setType(value)} />
        <ZTextInput title={strings.DESCRIPTION} value={terms} multiline={true}
          onChangeText={(value) => setTerms(value)} />
        <ZButton text={strings.SAVE} icon={'content-save-outline'} onPress={handleSaveTerms} />
      </ScrollView>
    </View>
  );
};

export default TermsScreenEdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listSection: {
    marginTop: 7,
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.GREY,
    borderWidth: 1,
    borderRadius: 5
  }
});