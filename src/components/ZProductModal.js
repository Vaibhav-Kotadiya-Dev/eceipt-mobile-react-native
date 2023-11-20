import React, { useState } from 'react';
import { View, StyleSheet, Modal, ScrollView, RefreshControl } from 'react-native';
import { COLORS, TEXT_SIZE } from '../common/Constants';
import ZLoading from './ZLoading'
import strings from '../i18n/i18n'
import ZText from './ZText'
import ZButton from './ZButton';
import ZSearchBar from './ZSearchBar';
import ZProductCard from './ZProductCard';
import { useAllProduct } from '../services/ProductService';
import { toastMsg } from '../common/functions';

const ZProductModal = (props) => {
  const [productList, setProductList] = useState([]);
  const [searchedList, setSearchedList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(1000);
  const [sortBy, setSortBy] = useState("name,asc");

  const { refetch, isLoading  } = useAllProduct(
    (response) => {
        if (response.code === "SUCCESS") {
            setProductList(response.data?.data);
            setSearchedList(response.data?.data);
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

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
  }

  const handleSearchTextChange = (text) => {
    if (text.length > 0) {
      const arr = productList.filter((item) => item?.name.toUpperCase().includes(text.toUpperCase()));
      setSearchedList(arr);
    } else {
      setSearchedList(productList);
    }
  }

  return (
    <View style={{ backgroundColor: 'transparent' }}>
      <ZLoading isLoading={isLoading} />
      <Modal visible={props.visible} transparent={true}>
        <View style={styles.main}>
          <View style={styles.views}>
            <View style={styles.title}>
              <ZText text={props.title} size={TEXT_SIZE.TITLE} textColor={COLORS.PRIMARY} fontWeight={'bold'} />
            </View>
            <ZSearchBar placeholder={strings.SEARCH_BY_ITEM_NUMBER} onChangeText={(text) => handleSearchTextChange(text)} />
            <ScrollView style={styles.container} refreshControl={<RefreshControl enabled={true} refreshing={refreshing} onRefresh={onRefresh} />}>
              {searchedList?.map((value) => (
                <ZProductCard
                  key={value.id}
                  data={value}
                  showDelete={false}
                  onPressEdit={() => { props.onPressItem(value) }} />
              ))}
            </ScrollView>
            <View>
              <ZButton text={props.cancelText} color={COLORS.SECONDRY} onPress={props.onPressCancel} />
            </View>
          </View>
        </View>
      </Modal>
    </View >

  );
};

export default ZProductModal;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '100%',
  },
  views: {
    width: '90%',
    height: '90%',
    backgroundColor: COLORS.WHITE,
    borderRadius: 5,
    borderColor: COLORS.LIGHTGREY,

  },
  title: {
    backgroundColor: COLORS.YELLOW,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHTGREY,
    padding: 10
  },


});