import React, {useState} from 'react';
import { View, ScrollView, StyleSheet, Keyboard } from 'react-native';
import { COLORS } from '../../common/Constants';
import { toastMsg } from '../../common/functions';
import strings from '../../i18n/i18n'
import ZTextInput from '../../components/ZTextInput';
import ZButton from '../../components/ZButton';
import ZLoading from '../../components/ZLoading'
import { useCreateUom } from '../../services/UomService';

const UOMScreenAdd = (props) => {
  const [name, setName] = useState('');
  const [terms, setTerms] = useState('');

  const { mutate: createObj, isLoading: createLoading } = useCreateUom(
    (response) => {
        if (response.data.code === "SUCCESS") {
          setName('');
          setTerms('');
          setTimeout(() => {
            props.navigation.navigate("UomList")
          }, 100);
        } else {
          toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
        }
    },
    () => {
      toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
  });

  const saveTerms = async () => {
    var obj = {
      id: null,
      uom: name,
      description: terms,
    }
    createObj(obj);
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
      <ZLoading isLoading={createLoading} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}} style={{}}>
        <ZTextInput title={strings.NAME} value={name}
          onChangeText={(value) => setName(value)} />
        <ZTextInput title={strings.DESCRIPTION} value={terms} multiline={true}
          onChangeText={(value) => setTerms(value)} />
        <ZButton text={strings.SAVE} icon={'content-save-outline'} onPress={handleSaveTerms} />
      </ScrollView>
    </View>
  );
};

export default UOMScreenAdd;

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