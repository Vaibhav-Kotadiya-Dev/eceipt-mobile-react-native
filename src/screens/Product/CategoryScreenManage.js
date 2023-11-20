import React, {useState, useEffect} from 'react';
import { View, ScrollView, StyleSheet, BackHandler } from 'react-native';
import { COLORS } from '../../common/Constants';
import ZTextInput from '../../components/ZTextInput';
import strings from '../../i18n/i18n'
import ZCategoryCard from '../../components/ZCategoryCard';
import ZModal from '../../components/ZModal';
import ZLoading from '../../components/ZLoading'
import { toastMsg } from '../../common/functions';
import ZIconButton from '../../components/ZIconButton';
import { useAllCategory, useDeleteCategory, useCreateCategory } from '../../services/CategoryService';
import { DataTable } from 'react-native-paper';

const CategoryScreenManage = (props) => {
  const [categoryList, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [deleteCategoryId, setDeleteCategoryId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalProducts, setToalProducts] = useState(0);

  const from = page * pageSize;
  const to = (page + 1) * pageSize;

  const { refetch, isFetching } = useAllCategory(
    (response) => {
        if (response.code === "SUCCESS") {
          setCategoryList(response?.data?.data);
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

  const { mutate: deleteObj, isLoading: deleteLoading } = useDeleteCategory(
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

  const { mutate: createObj, isLoading: createLoading } = useCreateCategory(
    (response) => {
        if (response.data.code === "SUCCESS") {
          setCategoryName('');
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

  const addCat = async (value) => {
    var obj = {
      id: null,
      description: value,
      name: value
    };
    createObj(obj);
  };

  const handleDeletePressed = (value) => {
    setDeleteCategoryId(value);
    setModalVisible(true);
  };

  const handleDeleteConfirmed = () => {
    deleteObj(deleteCategoryId);
    setModalVisible(false);
  };

  return (
    <View style={styles.container} >
      <ZLoading isLoading={isFetching || deleteLoading || createLoading} />
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
      <View style={{ marginBottom: 5, flexDirection: 'row', alignItems:'center', borderBottomWidth: 1, borderBottomColor: COLORS.GREY }}>
        <View style={{ flex: 2 }}>
          <ZTextInput title={strings.CATEGORY_NAME} value={categoryName}
            onChangeText={(value) => setCategoryName(value)} />
        </View>
        <View style={{ marginLeft: 5, marginRight: 5 }} >
          <ZIconButton icon={'plus'} iconStyle={{ marginRight: 5, marginLeft: 5 }} backgroundColor={COLORS.YELLOW}
            onPress={() => { addCat(categoryName) }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 8, }} contentContainerStyle={{paddingBottom: 20}}>
        {categoryList?.map((value) => (
          <ZCategoryCard 
            key={value?.id} 
            data={value?.name} 
            description={value?.description}
            onPress={() => handleDeletePressed(value?.id)} 
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
