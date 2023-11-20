import React, {useState, useEffect} from 'react';
import { View, ScrollView, StyleSheet, Keyboard, RefreshControl, BackHandler } from 'react-native';
import { COLORS, TERMS_TYPE } from '../../common/Constants';
import strings from '../../i18n/i18n'
import { toastMsg } from '../../common/functions';
import ZTextInput from '../../components/ZTextInput';
import ZButton from '../../components/ZButton';
import ZModal from '../../components/ZModal';
import ZCollapseBox from '../../components/ZCollapseBox';
import ZTermsCard from '../../components/ZTermsCard';
import ZLoading from '../../components/ZLoading'
import { useAllTerms, useCreateTerms, useDeleteTerms } from '../../services/TermsService';

const TermsScreenGeneral = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [termList, setTermList] = useState([]);
  const [name, setName] = useState('');
  const [terms, setTerms] = useState('');
  const [deleteTermsId, setDeleteTermsId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [collapse, setCollapse] = useState(true);
  const [id, setId] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(1000);
  const [sortBy, setSortBy] = useState("name,asc");

  const { refetch, isFetching } = useAllTerms(
    (response) => {
        if (response.code === "SUCCESS") {
          const filterArr = response.data.data?.filter(i => i?.type === TERMS_TYPE.GENERAL);
          setTermList(filterArr);
          setRefreshing(false);
        } else {
          toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
          setRefreshing(false);
        }
    },
    () => {
      toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
      setRefreshing(false);
    },
    page, pageSize, sortBy
  ); 

  const { mutate: createObj, isLoading: createLoading } = useCreateTerms(
    (response) => {
        if (response.data.code === "SUCCESS") {
          setId(null);
          setName('');
          setTerms('');
          setCollapse(true);
          refetch();
        } else {
          toastMsg(strings.SAVING_FAILED);
        }
    },
    () => {
      toastMsg(strings.SAVING_FAILED);
  });

  const { mutate: deleteObj, isLoading: deleteLoading } = useDeleteTerms(
    (response) => {
        if (response.data.code === "SUCCESS") {
          refetch();
        } else {
          toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
        }
    },
    () => {
      toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
  });

  const handleBackButtonClick = () => {
    props.navigation.navigate('OverviewOrder')
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => backHandler.remove();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
  };

  const addTerms = async () => {
    var obj = {
      id: id,
      name: name,
      description: terms,
      type: TERMS_TYPE.GENERAL
    }
    createObj(obj);
  };

  const handleAddTerms = () => {
    if (name.length > 0 && terms.length > 0) {
      Keyboard.dismiss()
      addTerms()
    } else {
      Keyboard.dismiss()
      toastMsg(strings.NEED_COMPLETE_ALL_FIELD)
    }
  };

  const handleDeletePressed = (value) => {
    setDeleteTermsId(value);
    setModalVisible(true);
  };

  const handleDeleteConfirmed = () => {
    deleteObj(deleteTermsId)
    setModalVisible(false);
    setDeleteTermsId('');
  };

  return (
    <View style={styles.container} >
      <ZLoading isLoading={isFetching || createLoading || deleteLoading} />
      <ZModal
        title={strings.DELETE_CATEGORY}
        okButton={false}
        deleteText={strings.DELETE}
        cancelText={strings.CANCEL}
        visible={modalVisible}
        onPressDelete={handleDeleteConfirmed}
        onPressCancel={() => setModalVisible(false)}
        onPressOutside={() => setModalVisible(false)}
      />
      <ZCollapseBox
        icon={'plus'}
        titleText={strings.ADD_NEW_TERMS}
        collapse={collapse}
        onToggle={() => setCollapse(!collapse)}
      >
        <View style={{ flexDirection: 'column' }}>
          <ScrollView style={{ maxHeight: 250, }}>
            <ZTextInput title={strings.NAME} value={name}
              onChangeText={(value) => setName(value)} />
            <ZTextInput title={strings.TERMS} value={terms} multiline={true}
              onChangeText={(value) => setTerms(value)} />
            <ZButton text={strings.ADD} icon={'plus'} onPress={handleAddTerms} />
          </ScrollView>
        </View>
      </ZCollapseBox>
      <ScrollView style={{ flex: 1, paddingHorizontal: 8, paddingTop: 8 }} contentContainerStyle={{paddingBottom: 20}} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl enabled={true} refreshing={refreshing} onRefresh={onRefresh} />}>
        {termList?.map((value) => (
          <ZTermsCard key={value?.id} type={TERMS_TYPE.GENERAL} data={value}
            onPress={() => props.navigation.navigate("TermsEdit", { term: value })}
            showDelete={true}
            onPressDelete={() => handleDeletePressed(value.id)} />
        ))}
      </ScrollView>
    </View>
  );
};

export default TermsScreenGeneral;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  listSection: {
    marginTop: 7,
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.GREY,
    borderWidth: 1,
    borderRadius: 5
  }
});
