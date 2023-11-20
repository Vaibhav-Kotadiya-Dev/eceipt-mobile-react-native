import React, {useState, useEffect} from 'react';
import { View, StyleSheet, BackHandler, ScrollView, RefreshControl } from 'react-native';
import { toastMsg } from '../../common/functions';
import ZProductCard from '../../components/ZProductCardNew';
import ZModal from '../../components/ZModal';
import ZLoading from '../../components/ZLoading'
import ZIconButton from '../../components/ZIconButton'
import strings from '../../i18n/i18n'
import { useAllProduct, useDeleteProduct } from '../../services/ProductService';
import { COLORS, TEXT_SIZE } from '../../common/Constants';
import { DataTable } from 'react-native-paper';
import ZText from '../../components/ZText';

const ProductScreen = (props) => {  
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState('');
  const [refreshing , setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("name,asc");
  const [totalProducts, setToalProducts] = useState(0);

  const from = page * pageSize;
  const to = (page + 1) * pageSize;

  const { refetch, isFetching, isLoading } = useAllProduct(
    (response) => {
        if (response.code === "SUCCESS") {
          setProducts(response.data.data);
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

  const { mutate: deleteObj, isLoading: deleteLoading } = useDeleteProduct(
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
        title={strings.DELETE_PRODUCT}
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
          <ZText fontWeight='bold' text={strings.MANAGE_PRODUCT} size={TEXT_SIZE.BIG} ellipsizeMode='tail' numberOfLines={1} />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 8, }} contentContainerStyle={{paddingBottom: 20}} refreshControl={<RefreshControl enabled={true} refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.container}>
          {products?.map((product) => (
            <ZProductCard
              key={product?.id}
              data={product}
              showDelete={true}
              onPressEdit={() => { props.navigation.navigate("ProductEdit", { id: product?.id }) }}
              onPressDelete={() => handleDeletePressed(product?.id)} 
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

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Code for dynamic scroll list

// import React, {useState, useEffect} from 'react';
// import { View, StyleSheet, BackHandler, FlatList, ActivityIndicator } from 'react-native';
// import { toastMsg, shouldFetchMoreData } from '../../common/functions';
// import ZProductCard from '../../components/ZProductCardNew';
// import ZSearchBar from '../../components/ZSearchBar';
// import ZModal from '../../components/ZModal';
// import ZLoading from '../../components/ZLoading'
// import ZIconButton from '../../components/ZIconButton'
// import strings from '../../i18n/i18n'
// import { useAllProduct, useDeleteProduct } from '../../services/ProductService';
// import { COLORS } from '../../common/Constants';

// const ProductScreen = (props) => {  
//   const [items, setItems] = useState([]);
//   const [searchedList, setSearchedList] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [deleteProductId, setDeleteProductId] = useState('');

//   const { data, refetch, isLoading, isError, hasNextPage, fetchNextPage, isRefetching  } = useAllProduct();

//   const { mutate: deleteObj, isLoading: deleteLoading } = useDeleteProduct(
//     (response) => {
//         if (response.data.code === "SUCCESS") {
//             refetch();
//         } else {
//           toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
//         }
//     }, () => { toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN); })

//   const handleBackButtonClick = () => {
//     props.navigation.navigate('OverviewMain')
//     return true;
//   };

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
//     return () => backHandler.remove();
//   }, []);

//   useEffect(() => {
//     if(!isRefetching) {
//       let productsData = data?.pages.flatMap((page) => page.data);
//       setItems(productsData);
//       setSearchedList(productsData);
//     }
//   }, [isRefetching])


//   if (isLoading) {
//     return <ZLoading isLoading={isLoading} />
//   }

//   if (isError) {
//     toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
//     return
//   }
  
//   const onRefresh = () => {
//     refetch();
//   }

//   const handleDeletePressed = (value) => {
//     setDeleteProductId(value);
//     setModalVisible(true);
//   }

//   const handleDeleteConfirmed = () => {
//     deleteObj(deleteProductId)
//     setModalVisible(false);
//     setDeleteProductId('');
//   }

//   const handleSearchTextChange = (text) => {
//     if (text.length > 0) {
//       const arr = items?.filter((item) => item?.name.toUpperCase().includes(text.toUpperCase()));
//       setSearchedList(arr);
//     } else {
//       setSearchedList(items);
//     }
//   }

//   const loadNext = () => {
//     if (hasNextPage) {
//       fetchNextPage();
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <ZLoading isLoading={deleteLoading} />
//       <ZModal
//         title={strings.DELETE_PRODUCT}
//         okButton={false}
//         deleteText={strings.DELETE}
//         cancelText={strings.CANCEL}
//         visible={modalVisible}
//         onPressDelete={handleDeleteConfirmed}
//         onPressCancel={() => setModalVisible(false)}
//         onPressOutside={() => setModalVisible(false)}
//       />

//       <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
//         {/* <View style={{ flex: 1 }}>
//           <ZSearchBar placeholder={strings.SEARCH_BY_ITEM_NUMBER} onChangeText={(text) => handleSearchTextChange(text)} />
//         </View> */}
//         <View style={{ marginLeft: 5, marginRight: 5 }} >
//           <ZIconButton icon={'plus'} iconStyle={{ marginRight: 5, marginLeft: 5 }} backgroundColor={COLORS.YELLOW}
//             onPress={() => { props.navigation.push("ProductAddNew") }} />
//         </View>
//       </View>
//       <FlatList 
//         data={searchedList}
//         extraData={[searchedList]}
//         keyExtractor={(item) => item?.id.toString()}
//         contentContainerStyle={{ flexGrow: 1 }}
//         renderItem={({item}) => (
//           <ZProductCard
//             key={item.id}
//             data={item}
//             showDelete={true}
//             onPressEdit={() => { props.navigation.navigate("ProductEdit", { id: item.id }) }}
//             onPressDelete={() => handleDeletePressed(item.id)} 
//           />
//         )}
//         onRefresh={onRefresh}
//         showsVerticalScrollIndicator={false}
//         refreshing={isLoading}
//         onEndReachedThreshold={0.2}
//         onEndReached={loadNext}
//         // ListFooterComponent={isLoading ? () => (
//         //   <ActivityIndicator />
//         // ) : null}
//       />
//     </View>
//   );
// }

// export default ProductScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });


