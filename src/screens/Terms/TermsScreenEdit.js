import React, {useState, useEffect} from 'react';
import { View, ScrollView, StyleSheet, Keyboard } from 'react-native';
import { COLORS } from '../../common/Constants';
import { toastMsg } from '../../common/functions';
import strings from '../../i18n/i18n'
import ZTextInput from '../../components/ZTextInput';
import ZButton from '../../components/ZButton';
import ZLoading from '../../components/ZLoading'
import ZAccordionPicker from '../../components/ZAccordionPicker';
import { useUpdateTerms } from '../../services/TermsService';
import { useAllTermTypeNoPaging } from '../../services/TermsTypeService';

const TermsScreenEdit = (props) => {
  const [termsId, setTermsId] = useState(null);
  const [name, setName] = useState('');
  const [terms, setTerms] = useState('');
  const [type, setType] = useState('');
  const [termsTypeList, setTermsTypeList] = useState([]);

  const { mutate: updateObj, isLoading: updateLoading } = useUpdateTerms(
    (response) => {
        if (response.data.code === "SUCCESS") {
          setTermsId(null);
          setName('');
          setTerms('');
          setType('');
          setTimeout(() => {
            props.navigation.navigate("TermsList");
          }, 100);
        } else {
          toastMsg(strings.SAVING_FAILED);
        }
    },
    () => {
      toastMsg(strings.SAVING_FAILED);
  });

  const { isLoading: fetchingTermsType } = useAllTermTypeNoPaging(
    (response) => {
        if (response.code === "SUCCESS") {
          setTermsTypeList(response?.data?.data)
        } else {
          toastMsg(response.message)
        }
    },
    (error) => {
      toastMsg(error.message)
    }
  )

  useEffect(() => {
    setTermsId(props.route.params.term?.id);
    setName(props.route.params.term?.name);
    setTerms(props.route.params.term?.description);
    setType(props.route.params.term?.type);
  }, []);

  const saveTerms = async () => {
    var obj = {
      id: termsId,
      name: name,
      description: terms,
      type: type
    }
    updateObj(obj);
  };

  const handleSaveTerms = () => {
    if (name.length > 0 && terms.length > 0) {
      Keyboard.dismiss()
      saveTerms()
    } else {
      Keyboard.dismiss()
      toastMsg(strings.NEED_COMPLETE_ALL_FIELD)
    }
  };


  return (
    <View style={styles.container} >
      <ZLoading isLoading={updateLoading || fetchingTermsType} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}} style={{}}>
        <ZAccordionPicker
          title={strings.SELECT_TERM_TYPE}
          data={termsTypeList?.map(value => value?.type)}
          value={type}
          onSelect={(value) => setType(value)}
        />
        <ZTextInput title={strings.NAME} value={name}
          onChangeText={(value) => setName(value)} />
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