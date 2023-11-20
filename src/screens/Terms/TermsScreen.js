import React, {useState, useEffect} from 'react';
import { View, StyleSheet, BackHandler, ScrollView, RefreshControl } from 'react-native';
import { toastMsg } from '../../common/functions';
import ZModal from '../../components/ZModal';
import ZLoading from '../../components/ZLoading'
import strings from '../../i18n/i18n'
import { useAllTerms, useDeleteTerms } from '../../services/TermsService';
import { TEXT_SIZE } from '../../common/Constants';
import ZTermsCard from '../../components/ZTermsCard';
import { DataTable } from 'react-native-paper';
import ZText from '../../components/ZText';

const TermsScreen = (props) => {  
  const [terms, setTerms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState('');
  const [refreshing , setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("name,asc");
  const [totalProducts, setToalProducts] = useState(0);

  const from = page * pageSize;
  const to = (page + 1) * pageSize;

  const { refetch, isFetching, isLoading } = useAllTerms(
    (response) => {
        if (response.code === "SUCCESS") {
          setTerms(response.data.data);
          setToalProducts(response.data?.page?.total);
          setRefreshing(false)
        } else {
          toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
          setRefreshing(false)
        }
    },
    () => {
      toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
      setRefreshing(false)
    },
    page, pageSize, sortBy
  );

  const { mutate: deleteObj, isLoading: deleteLoading } = useDeleteTerms(
    (response) => {
        if (response.data.code === "SUCCESS") {
            refetch();
        } else {
          toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
        }
    }, () => { toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN); })

  const handleBackButtonClick = () => {
    props.navigation.navigate('OverviewMain')
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


  const handleDeletePressed = (value) => {
    setDeleteProductId(value);
    setModalVisible(true);
  }

  const handleDeleteConfirmed = () => {
    deleteObj(deleteProductId)
    setModalVisible(false);
    setDeleteProductId('');
  }

  return (
    <View style={{ flex: 1, paddingBottom: 20 }}>
      <ZLoading isLoading={deleteLoading || isLoading || isFetching} />
      <ZModal
        title={strings.DELETE_TERM}
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
          <ZText fontWeight='bold' text={strings.MANAGE_TERMS} size={TEXT_SIZE.BIG} ellipsizeMode='tail' numberOfLines={1} />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 8, }} contentContainerStyle={{paddingBottom: 20}} refreshControl={<RefreshControl enabled={true} refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.container}>
          {terms?.map((value) => (
            <ZTermsCard 
              key={value?.id} 
              type={value?.type} 
              data={value}
              showDelete={true}
              onPress={() => props.navigation.navigate("TermsEdit", { term: value })}
              onPressDelete={() => handleDeletePressed(value.id)} 
            />
          ))}
        </View>
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

export default TermsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
