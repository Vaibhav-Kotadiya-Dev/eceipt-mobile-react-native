import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, TEXT_SIZE } from '../common/Constants'
import ZIconButton from './ZIconButton';
import ZText from './ZText';
import ZCard from './ZCard'
import strings from '../i18n/i18n';

const ZCategoryCard = (props) => {
  const handleDeletePressed = () => {
    return props.onPress(props.data.name)
  };

  return (
    <ZCard>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <ZText text={`${strings.NAME}: ${props.data}`} size={TEXT_SIZE.TITLE} color={COLORS.PRIMARY} />
          {props?.description ? (
            <ZText text={`${strings.DESCRIPTION}: ${props?.description}`} size={TEXT_SIZE.TITLE} color={COLORS.PRIMARY} />
          ) : null}
        </View>
        <View>
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
  );
};

export default ZCategoryCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'center',
    margin: 10
  },
});