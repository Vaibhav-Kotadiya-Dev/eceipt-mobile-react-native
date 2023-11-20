import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, BackHandler } from 'react-native';
import { COLORS, TEXT_SIZE } from '../../common/Constants';
import { toastMsg } from '../../common/functions';
import strings from '../../i18n/i18n'
import ZClientCard from '../../components/ZClientCard';
import ZModal from '../../components/ZModal';
import ZLoading from '../../components/ZLoading'
import ZIconButton from '../../components/ZIconButton';
import { useAllClient, useDeleteClient } from '../../services/ClientService';
import { DataTable } from 'react-native-paper';
import ZText from '../../components/ZText';

const ClientScreen = (props) => {
  const [clients , setClients] = useState([]);
  const [deleteClientId , setDeleteClientId] = useState('');
  const [modalVisible , setModalVisible] = useState(false);
  const [refreshing , setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("name,asc");
  const [totalProducts, setToalProducts] = useState(0);

  const from = page * pageSize;
  const to = (page + 1) * pageSize;

  const { refetch, isFetching, isLoading } = useAllClient(
    (response) => {
        if (response.code === "SUCCESS") {
          setClients(response.data.data);
          // setSearchedList(response.data.data);
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

  const { mutate: deleteObj, isLoading: deleteLoading } = useDeleteClient(
    (response) => {
        if (response.data.code === "SUCCESS") {
          refetch({refetchPage: ''});
        } else {
          toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
        }
    },
    () => {
      toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
  });

  const handleBackButtonClick = () => {
    props.navigation.navigate('OverviewMain')
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => backHandler.remove();
  }, [])

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
  };

  const handleDeletePressed = (value) => {
    setDeleteClientId(value);
    setModalVisible(true);
  };

  const handleDeleteConfirmed = () => {
    deleteObj(deleteClientId)
    setModalVisible(false);
    setDeleteClientId('');
  }

  return (
    <View style={{ flex: 1, paddingBottom: 20 }}>
      <ZLoading isLoading={deleteLoading || isLoading || isFetching} />
      <ZModal
        title={strings.DELETE_CLIENT}
        okButton={false}
        deleteText={strings.DELETE}
        cancelText={strings.CANCEL}
        visible={modalVisible}
        onPressDelete={() => handleDeleteConfirmed()}
        onPressCancel={() => setModalVisible(false)}
        onPressOutside={() => setModalVisible(false)}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 8 }}>
        <View style={{ flex: 1, paddingLeft: 8, }}>
          <ZText fontWeight='bold' text={strings.MANAGE_CLIENT} size={TEXT_SIZE.BIG} ellipsizeMode='tail' numberOfLines={1} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 8, }} contentContainerStyle={{paddingBottom: 20}} refreshControl={<RefreshControl enabled={true} refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.container}>
          {clients?.map((client) => (
            <ZClientCard
              key={client.name}
              data={client}
              onPressEdit={() => { props.navigation.navigate("ClientEdit", { client: client }) }}
              onPressDelete={() => { handleDeletePressed(client.id) }} />
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ClientScreen;

// Code for dynamic scroll list

// import React, {useState, useEffect} from 'react';
// import { View, StyleSheet, FlatList, BackHandler } from 'react-native';
// import { COLORS } from '../../common/Constants';
// import { toastMsg } from '../../common/functions';
// import strings from '../../i18n/i18n'

// import ZClientCard from '../../components/ZClientCard';
// import ZSearchBar from '../../components/ZSearchBar';
// import ZModal from '../../components/ZModal';
// import ZLoading from '../../components/ZLoading'
// import ZIconButton from '../../components/ZIconButton';
// import { useAllClient, useDeleteClient } from '../../services/ClientService';

// const ClientScreen = (props) => {
//   let [clients , setClients] = useState([]);
//   let [searchedList , setSearchedList] = useState([]);
//   const [deleteClientId , setDeleteClientId] = useState('');
//   const [modalVisible , setModalVisible] = useState(false);

//   const { data, refetch, isLoading, isError, hasNextPage, fetchNextPage, isRefetching  } = useAllClient();

//   const { mutate: deleteObj, isLoading: deleteLoading } = useDeleteClient(
//     (response) => {
//         if (response.data.code === "SUCCESS") {
//           refetch({refetchPage: ''});
//         } else {
//           toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
//         }
//     },
//     () => {
//       toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
//   });

//   const handleBackButtonClick = () => {
//     props.navigation.navigate('OverviewMain')
//     return true;
//   };

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
//     return () => backHandler.remove();
//   }, [])

//   useEffect(() => {
//     if(!isRefetching) {
//       let productsData = data?.pages.flatMap((page) => page.data);
//       setClients(productsData);
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
//   };

//   const handleDeletePressed = (value) => {
//     setDeleteClientId(value);
//     setModalVisible(true);
//   };

//   const handleDeleteConfirmed = () => {
//     deleteObj(deleteClientId)
//     setModalVisible(false);
//     setDeleteClientId('');
//   }

//   const handleSearchTextChange = (text) => {
//     if (text.length > 0) {
//       const arr = clients.filter((client) => client.name.toUpperCase().includes(text.toUpperCase()))
//       setSearchedList(arr);
//     } else {
//       setSearchedList(clients);
//     }
//   };

//   const loadNext = () => {
//     if (hasNextPage) {
//       fetchNextPage();
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <ZLoading isLoading={deleteLoading} />
//       <ZModal
//         title={strings.DELETE_CLIENT}
//         okButton={false}
//         deleteText={strings.DELETE}
//         cancelText={strings.CANCEL}
//         visible={modalVisible}
//         onPressDelete={() => handleDeleteConfirmed()}
//         onPressCancel={() => setModalVisible(false)}
//         onPressOutside={() => setModalVisible(false)}
//       />

//       <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
//         {/* <View style={{ flex: 1 }}>
//           <ZSearchBar placeholder={strings.SEARCH_BY_COMPANY_NAME} onChangeText={(text) => { handleSearchTextChange(text) }} />
//         </View> */}
//         <View style={{ marginLeft: 5, marginRight: 5 }} >
//           <ZIconButton icon={'plus'} iconStyle={{ marginRight: 5, marginLeft: 5 }} backgroundColor={COLORS.YELLOW}
//             onPress={() => { props.navigation.push("ClientAdd") }} />
//         </View>
//       </View>
//       <FlatList 
//         data={searchedList}
//         extraData={[searchedList]}
//         keyExtractor={(item) => item?.id.toString()}
//         contentContainerStyle={{ flexGrow: 1 }}
//         renderItem={({item}) => (
//           <ZClientCard
//             key={item.name}
//             data={item}
//             onPressEdit={() => { props.navigation.navigate("ClientEdit", { client: item }) }}
//             onPressDelete={() => { handleDeletePressed(item.id) }} 
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
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default ClientScreen;





