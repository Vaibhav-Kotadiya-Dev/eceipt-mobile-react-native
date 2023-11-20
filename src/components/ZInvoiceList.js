import React, {useState, useEffect} from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { COLORS, TEXT_SIZE } from '../common/Constants'
import ZIconButton from './ZIconButton';
import strings from '../i18n/i18n'
import ZText from './ZText';
import ZCard from './ZCard';


const ZProductList = (props) => {
  const [productList, setProductList] = useState(props.data);

  useEffect(() => {
    setProductList(props.data);
  }, [props.data]);

  const updateProductList = (lst) => {
    props.updateList(lst);
  };

  const deleteProduct = (k) => {
    var tempList = []
    tempList = productList?.filter((value, key) => k != key).map((value, key) => value)
    setProductList(tempList);
    updateProductList(tempList);
  };

  const changeQuantity = (k, v) => {
    var tempList = JSON.parse(JSON.stringify(productList));
    tempList?.filter((value, key) => key == k).map((value, key) => { 
      value.quantity = v
      value.totalPrice = value?.unitprice * v
     })
     setProductList(tempList);
     updateProductList(tempList);
  };

  const changeRemark = (k, v) => {
    var tempList = JSON.parse(JSON.stringify(productList));
    tempList?.filter((value, key) => key == k).map((value, key) => { value.remark = v })
    setProductList(tempList);
    updateProductList(tempList);
  };

  return (
    <View>
      <ZCard>
        {productList?.map((value, key) =>
          <View key={key} style={styles.container}>
            <View style={styles.container1}>
              <View style={styles.containerIcon}>
                <ZIconButton
                  icon={'close'}
                  style={{ padding: 0 }}
                  iconStyle={{ marginRight: 0 }}
                  backgroundColor={COLORS.WHITE}
                  color={COLORS.ERRORRED}
                  onPress={() => deleteProduct(key)} />
              </View>
              <View style={styles.containerTitle}>
                <ZText text={value?.name} size={TEXT_SIZE.NORMAL} ellipsizeMode='tail' numberOfLines={1} />
                <ZText text={value?.description} size={TEXT_SIZE.SMALL} color={COLORS.GREY} ellipsizeMode='tail' numberOfLines={1} />
              </View>
              <View style={styles.containerQty}>
                <TextInput
                  style={styles.containerQtyText}
                  onChangeText={(value) => { changeQuantity(key, value) }}
                  keyboardType='number-pad'
                  defaultValue={value?.quantity?.toString()} />
              </View>
              <View style={styles.containerUOM}>
                <ZText text={value?.uom} size={TEXT_SIZE.SMALL} />
              </View>
            </View>
            <View style={styles.container2}>
              <ZText text={strings.REMARKS} size={TEXT_SIZE.SMALL} color={COLORS.GREY} />
              <TextInput
                style={styles.containerRemarkText}
                onChangeText={(value) => { changeRemark(key, value) }}
                defaultValue={value?.remark} />
            </View>
          </View>
        )}
      </ZCard>
    </View>
  );
};

export default ZProductList;

const styles = StyleSheet.create({
  container: {
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.LIGHTBLUE,

  },
  container1: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHTGREY,
  },
  container3: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHTGREY,
    alignItems: 'center'
  },
  containerRemarkText: {
    flex: 1,
    paddingTop: 1,
    paddingBottom: 1,
    paddingRight: 5,
    borderBottomColor: COLORS.YELLOW,
    borderBottomWidth: 0.5,
    marginBottom: 5,
    marginLeft: 5,
  },
  containerPriceText: {
    flex: 1,
    paddingTop: 1,
    paddingBottom: 1,
    paddingRight: 5,
    borderBottomColor: COLORS.YELLOW,
    borderBottomWidth: 0.5,
    marginBottom: 5,
    marginLeft: 5,
    
  },
  containerIcon: {
    paddingLeft: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  containerTitle: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  containerQty: {
    flex: 1,
  },
  containerQtyText: {
    paddingTop: 1,
    paddingBottom: 1,
    paddingRight: 5,
    borderRadius: 5,
    textAlign: 'right',
    borderColor: 'gray',
    borderWidth: 1,
  },
  containerUOM: {
    width: 30,
    marginRight: 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
});