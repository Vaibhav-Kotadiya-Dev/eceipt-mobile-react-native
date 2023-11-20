import React, {useEffect, useState} from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  BackHandler,
} from "react-native";
import {ORDER_STATUS} from "../../common/Constants";
import strings from "../../i18n/i18n";
import { useAll } from '../../services/DeliveryOrderService';
import ZSearchBar from "../../components/ZSearchBar";
import ZModal from "../../components/ZModal";
import ZDoCard from "../../components/ZDoCard";
import ZLoading from "../../components/ZLoading";
import { DataTable } from 'react-native-paper';

export default function DeliveryOrderScreenList({navigation}) {
  const [doList, setDoList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdDate,desc");
  const [status, setStatus] = useState("ALL");
  const [totalItems, setTotalItems] = useState(0);
  const [orderNumber, setOrderNumber] = useState(null);
  const [search, setSearch] = useState('');

  const from = page * pageSize;
  const to = (page + 1) * pageSize;

  const {refetch, isLoading, isFetching} = useAll(
    response => {
      if (response.code === "SUCCESS") {
        setDoList(response.data?.data);
        setRefreshing(false);
        setTotalItems(response.data?.page?.total);
      } else {
        setDoList([]);
        setRefreshing(false);
      }
    },
    () => {
      setDoList([]);
      setRefreshing(false);
    },
    page,
    pageSize,
    sortBy,
    status,
    orderNumber,
  );

  const handleBackButtonClick = () => {
    navigation.navigate("OverviewMain");
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick,
      );
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
  };

  const handleSearchTextChange = () => {
    setPage(0);
    setOrderNumber(search);
  };

  const onClearFilter = () => {
    setPage(0);
    setOrderNumber(null);
  }

  return (
    <View style={{flex: 1, paddingBottom: 20}}>
      <ZLoading isLoading={isLoading || isFetching} />
      <ZModal
        title={strings.DELETE_PRODUCT}
        okButton={false}
        deleteText={strings.DELETE}
        cancelText={strings.CANCEL}
        visible={modalVisible}
        onPressDelete={() => setModalVisible(false)}
        onPressCancel={() => setModalVisible(false)}
        onPressOutside={() => setModalVisible(false)}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <View style={{flex: 1, paddingTop: 8, marginHorizontal: 5,}}>
          <ZSearchBar
            placeholder={strings.SEARCH_BY_ORDER_NUMBER}
            onChangeText={text => setSearch(text)}
            onClearIconPress={onClearFilter}
            onPressSearchIcon={handleSearchTextChange}
          />
        </View>
      </View>

      <ScrollView
        style={{flex: 1, paddingTop: 8}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}
        refreshControl={
          <RefreshControl
            enabled={true}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <View style={styles.container}>
          {doList?.map(item => (
            <ZDoCard
              key={item.id}
              data={item}
              onPressEdit={() => {
                if (item?.status === ORDER_STATUS.DRAFT) {
                  navigation.navigate("DeliveryOrderEdit", {
                    screen: 'DeliveryOrderEditScreenTab',
                    params: {
                      screen: 'DeliveryOrderEditStackScreen',
                      params: {id: item.id},
                    }
                  });
                } else {
                  navigation.navigate("DeliveryOrderView", {id: item.id});
                }
              }}
            />
          ))}
        </View>
      </ScrollView>
      <DataTable>
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(totalItems / pageSize)}
          onPageChange={page => setPage(page)}
          label={`${from + 1}-${to} of ${totalItems}`}
        />
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
