import React, {useState, useEffect} from 'react';
import { View, ScrollView, StyleSheet, BackHandler } from 'react-native';
import { COLORS, TEXT_SIZE } from '../../common/Constants';
import strings from '../../i18n/i18n'
import ZCategoryCard from '../../components/ZCategoryCard';
import ZModal from '../../components/ZModal';
import ZLoading from '../../components/ZLoading'
import { toastMsg } from '../../common/functions';
import { useAllUom, useDeleteUom } from '../../services/UomService';
import { DataTable } from 'react-native-paper';
import ZText from '../../components/ZText';
import ZUomCard from '../../components/ZUomCard';

const CategoryScreenManage = (props) => {
  const [uomList, setUomList] = useState([]);
  const [deleteUomId, setDeleteUomId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalProducts, setToalProducts] = useState(0);

  const from = page * pageSize;
  const to = (page + 1) * pageSize;

  const { refetch, isFetching } = useAllUom(
    (response) => {
        if (response.code === "SUCCESS") {
          setUomList(response?.data?.data);
          setToalProducts(response.data?.page?.total);
        } else {
          toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
        }
    },
    () => {
      toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
    },
    page, pageSize
  );

  const { mutate: deleteObj, isLoading: deleteLoading } = useDeleteUom(
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
    props.navigation.navigate('ProductList')
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => backHandler.remove();
  }, []);

  const handleDeletePressed = (value) => {
    setDeleteUomId(value);
    setModalVisible(true);
  };

  const handleDeleteConfirmed = () => {
    deleteObj(deleteUomId);
    setModalVisible(false);
  };

  return (
    <View style={styles.container} >
      <ZLoading isLoading={isFetching || deleteLoading} />
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
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 8 }}>
        <View style={{ flex: 1, paddingLeft: 8 }}>
          <ZText fontWeight='bold' text={strings.MANAGE_UOM} size={TEXT_SIZE.BIG} ellipsizeMode='tail' numberOfLines={1} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 8, }} contentContainerStyle={{paddingBottom: 20}}>
        {uomList?.map((value) => (
          <ZUomCard 
            key={value?.id} 
            data={value}
            onPress={() => props.navigation.navigate("UomEdit", { term: value })}
            onPressDelete={() => handleDeletePressed(value.id)} 
          />
        ))}
      </ScrollView>
      <DataTable>
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(totalProducts / pageSize)}
          onPageChange={page => setPage(page)}
          label={`${from + 1}-${to} of ${totalProducts}`}
        />
      </DataTable>
    </View>
  );
}

export default CategoryScreenManage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    paddingBottom: 20
  },
  listSection: {
    marginTop: 7,
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.GREY,
    borderWidth: 1,
    borderRadius: 5
  }
});
