import React, {useState, useEffect} from 'react';
import { View, ScrollView, StyleSheet, Keyboard } from 'react-native';
import { COLORS } from '../../common/Constants';
import { toastMsg } from '../../common/functions';
import strings from '../../i18n/i18n'
import ZTextInput from '../../components/ZTextInput';
import ZButton from '../../components/ZButton';
import ZLoading from '../../components/ZLoading'
import { useUpdateUom } from '../../services/UomService';

const UomScreenEdit = (props) => {
  const [uomId, setUomId] = useState(null);
  const [description, setDescription] = useState('');
  const [uomName, setUomName] = useState('');

  const { mutate: updateObj, isLoading: updateLoading } = useUpdateUom(
    (response) => {
        if (response.data.code === "SUCCESS") {
          setUomId(null);
          setDescription('');
          setUomName('');
          setTimeout(() => {
            props.navigation.navigate("UomList");
          }, 100);
        } else {
          toastMsg(response.data.message)
        }
    },
    () => {
      toastMsg(strings.SAVING_FAILED);
  })

  useEffect(() => {
    setUomId(props.route.params.term?.id);
    setDescription(props.route.params.term?.description);
    setUomName(props.route.params.term?.uom);
  }, []);

  const savedescription = async () => {
    var obj = {
      id: uomId,
      description: description,
      uom: uomName
    }
    updateObj(obj);
  };

  const handleSavedescription = () => {
    if (uomName.length > 0 && description.length > 0) {
      Keyboard.dismiss()
      savedescription()
    } else {
      Keyboard.dismiss()
      toastMsg(strings.NEED_COMPLETE_ALL_FIELD)
    }
  };


  return (
    <View style={styles.container} >
      <ZLoading isLoading={updateLoading} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}} style={{}}>
        <ZTextInput title={strings.NAME} value={uomName}
          onChangeText={(value) => setUomName(value)} />
        <ZTextInput title={strings.DESCRIPTION} value={description} multiline={true}
          onChangeText={(value) => setDescription(value)} />
        <ZButton text={strings.SAVE} icon={'content-save-outline'} onPress={handleSavedescription} />
      </ScrollView>
    </View>
  );
};

export default UomScreenEdit;

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