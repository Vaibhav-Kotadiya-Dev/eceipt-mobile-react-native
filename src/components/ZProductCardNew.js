import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, TEXT_SIZE } from '../common/Constants'
import ZIconButton from './ZIconButton';
import ZText from './ZText';
import ZCard from './ZCard';

const ZProductCard = (props) => {
  const item = props.data;
  return (
    <View>
      <ZCard>
        <View style={styles.container}>
          <View style={{ flex: 11 }}>
            <TouchableOpacity activeOpacity={0.7} onPress={props.onPressEdit}>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.containerTitle}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ZText text={'[' + item?.category + ']'} size={TEXT_SIZE.SMALL} color={COLORS.PRIMARY} />
                    <ZText text={item.code} size={TEXT_SIZE.BIG} ellipsizeMode='tail' numberOfLines={1} />
                  </View>
                  <ZText text={item?.description} size={TEXT_SIZE.SMALL} color={COLORS.GREY}
                    ellipsizeMode='tail' numberOfLines={2} />
                </View>
                <View style={styles.containerPrice}>
                  <ZText text={item?.currency + ' ' + item?.unitprice} size={TEXT_SIZE.SMALL} ellipsizeMode='tail' numberOfLines={1}/>
                  <ZText text={'/' + item?.uom} size={TEXT_SIZE.SMALL} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {!props.showDelete ? null :
            <View style={styles.containerIcon}>
              <ZIconButton
                icon={'close'}
                style={{ padding: 0 }}
                iconStyle={{ marginRight: 0 }}
                backgroundColor={COLORS.WHITE}
                color={COLORS.ERRORRED}
                onPress={props.onPressDelete} />
            </View>
          }
        </View>
      </ZCard>
    </View>
  );
};

export default ZProductCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10
  },
  containerTitle: {
    flex: 8,
    marginTop: 10,
    marginBottom: 10
  },
  containerPrice: {
    
    flex: 3,
    marginTop: 10,
    marginBottom: 10,
    alignItems:'flex-end',
    justifyContent: 'flex-end',
  },
  containerIcon: {
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});