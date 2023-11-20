import React, {useEffect, useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TEXT_SIZE, ORDER_STATUS } from '../common/Constants'
import strings from '../i18n/i18n'
import ZText from './ZText';
import ZCard from './ZCard';
import ZIcon from './ZIcon';


const ZInvoiceCard = (props) => {
  const [data, setData] = useState(props.data);

  useEffect(() => {
    setData(props.data);
  }, [props.data])

  return (
    <View>
      <ZCard>
        <View style={styles.container}>
          <TouchableOpacity onPress={props?.onPressEdit} activeOpacity={0.7}>
            <View style={styles.containerTitle}>
            <ZIcon style={{color: data?.status === ORDER_STATUS.SETTLED ? COLORS.GREEN : data?.status === ORDER_STATUS.INVOICED ? COLORS.ORANGE : data?.status === ORDER_STATUS.GENERATED ? COLORS.LIGHTBLUE : data?.status === ORDER_STATUS.DRAFT ? COLORS.GREY : COLORS.ERRORRED}} icon={data?.status === ORDER_STATUS.SETTLED ? 'alpha-s-box-outline' : data?.status === ORDER_STATUS.INVOICED ? 'alpha-i-box-outline' : data?.status === ORDER_STATUS.TRANSIT ? 'alpha-g-box-outline' : data?.status === ORDER_STATUS.DRAFT ? 'alpha-d-box-outline' : 'alpha-c-box-outline'} />
              <View style={{ flex: 1 }}>
                <ZText text={data?.orderNumber} size={TEXT_SIZE.BIG} ellipsizeMode='tail' numberOfLines={1} />
              </View>
              <ZText text={strings.INVOICE_DATE} size={TEXT_SIZE.SMALL} ellipsizeMode='tail' numberOfLines={1} />
              <ZText text={new Date(data?.invoiceDate).toDateString().split(" ")[0]} size={TEXT_SIZE.SMALL} ellipsizeMode='tail' numberOfLines={1} />
            </View>
            <View style={{ flexDirection: 'row' }}>

              <View style={{ flex: 1 }}>
                <View style={styles.containerTitle}>
                  <ZText text={strings.TO} size={TEXT_SIZE.SMALL} color={COLORS.GREY} ellipsizeMode='tail' numberOfLines={1} />
                  <ZText text={data?.clientName} size={TEXT_SIZE.NORMAL} color={COLORS.GREY} ellipsizeMode='tail' numberOfLines={1} fontWeight={'bold'} />
                </View>
                <View style={styles.containerQty}>
                  <ZText text={data?.totalProduct} size={TEXT_SIZE.SMALL} color={COLORS.GREY} ellipsizeMode='tail' numberOfLines={1} fontWeight={'bold'} />
                  <ZText text={strings.PRODUCT} size={TEXT_SIZE.SMALL} color={COLORS.GREY} ellipsizeMode='tail' numberOfLines={1} />
                  <ZText text={strings.TOTAL_QUANTITY} size={TEXT_SIZE.SMALL} color={COLORS.GREY} ellipsizeMode='tail' numberOfLines={1} />
                  <ZText text={data?.totalQuantity} size={TEXT_SIZE.SMALL} color={COLORS.GREY} ellipsizeMode='tail' numberOfLines={1} fontWeight={'bold'} />
                </View>
              </View>
              <View style={{ alignContent: 'center', justifyContent: 'center' }}>
                <ZText text={(data?.currency || '') + data?.totalPrice} size={TEXT_SIZE.BIG} color={COLORS.DARK_BLUE} ellipsizeMode='tail' numberOfLines={1} fontWeight={'bold'} />
                <View style={{ alignItems: 'flex-end' }}>
                  <ZText text={data?.status} size={TEXT_SIZE.SMALL} color={data?.status === ORDER_STATUS.SETTLED ? COLORS.GREEN : data?.status === ORDER_STATUS.INVOICED ? COLORS.ORANGE : data?.status === ORDER_STATUS.GENERATED ? COLORS.LIGHTBLUE : data?.status === ORDER_STATUS.DRAFT ? COLORS.GREY : COLORS.ERRORRED} ellipsizeMode='tail' numberOfLines={1} fontWeight={'bold'} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ZCard>
    </View>
  );
};

export default ZInvoiceCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5
  },
  containerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerQty: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
});