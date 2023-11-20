import React from 'react';
import { View, Switch } from 'react-native';
import { COLORS, TEXT_SIZE } from '../common/Constants';
import ZText from './ZText';

const ZToggle = (props) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <ZText text={props.text} size={TEXT_SIZE.BIG} />
      <View style={{ position: 'absolute', right: 20 }}>
        <Switch
          style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
          trackColor={{ false: COLORS.GREY, true: COLORS.LIGHTBLUE }}
          thumbColor={props.value ? COLORS.PRIMARY : COLORS.LIGHTGREY}
          onValueChange={props.onValueChange}
          value={props.value} />
      </View>
    </View>
  );
};

export default ZToggle;
