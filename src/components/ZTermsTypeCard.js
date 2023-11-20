import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TEXT_SIZE } from '../common/Constants'
import ZIconButton from './ZIconButton';
import ZText from './ZText';
import ZCard from './ZCard';

const ZTermsCard = (props) => {
  const item = props.data;

  const handleDeletePressed = () => {
    return props.onPressDelete(props.data)
  }

  return (
    <View>
      <ZCard>
        <View style={styles.container} >
          <View style={styles.containerTitle}>
            <TouchableOpacity onPress={props.onPress}>
              <ZText text={item?.type || ''} size={TEXT_SIZE.BIG} ellipsizeMode='tail' numberOfLines={1} />
              <ZText text={item?.description || ''} size={TEXT_SIZE.SMALL} color={COLORS.GREY}
                ellipsizeMode='tail' numberOfLines={2} />
            </TouchableOpacity>
          </View>
          <View style={styles.containerIcon}>
            <ZIconButton
              icon={'close'}
              style={{ padding: 0 }}
              iconStyle={{ marginRight: 0 }}
              backgroundColor={COLORS.WHITE}
              color={COLORS.ERRORRED}
              onPress={handleDeletePressed} />
          </View>
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