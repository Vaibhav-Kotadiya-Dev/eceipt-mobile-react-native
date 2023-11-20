import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TEXT_SIZE, TERMS_TYPE } from '../common/Constants'
import ZIconButton from './ZIconButton';
import ZText from './ZText';
import ZCard from './ZCard';
import ZIcon from './ZIcon';

const ZTermsCard = (props) => {
  const item = props.data;

  const handleDeletePressed = () => {
    return props?.onPressDelete(props.data)
  }

  return (
    <View>
      <ZCard>
        <View style={styles.container} >
          <View style={styles.containerTitle}>
            <TouchableOpacity onPress={props.onPress}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* <ZText text={'[' + props.prefix + ']'} size={TEXT_SIZE.SMALL} color={COLORS.PRIMARY} /> */}
                  {props.type == TERMS_TYPE.GENERAL ? <ZIcon icon={'alpha-g-box-outline'} /> : null}
                  {props.type == TERMS_TYPE.PAYMENT ? <ZIcon icon={'alpha-p-box-outline'} /> : null}
                  {props.type == TERMS_TYPE.DELIVERY ? <ZIcon icon={'alpha-d-box-outline'} /> : null}
                  <ZText text={item?.name || ''} size={TEXT_SIZE.BIG} ellipsizeMode='tail' numberOfLines={1} />
                </View>
                <ZText text={item?.description || ''} size={TEXT_SIZE.SMALL} color={COLORS.GREY}
                  ellipsizeMode='tail' numberOfLines={2} />
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
                onPress={handleDeletePressed} />
            </View>
          }
        </View>
      </ZCard>
    </View>
  );
};

export default ZTermsCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10
  },
  containerTitle: {
    flex: 8,
    height: 60,
    marginTop: 10,
    marginBottom: 10
  },
  containerIcon: {
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',

  },
});