import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { COLORS } from '../common/Constants';
import ZIcon from './ZIcon';
import ZText from './ZText';

const ZButton = (props) => {
  return (
    <View
      style={{
        height: 50,
        margin: 5,
        backgroundColor: props.color ? props.color : COLORS.PRIMARY,
        borderRadius: 5,
      }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={props.onPress}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}>
        <View style={{ flexDirection: "row", alignItems: 'center' }}>
          <ZIcon icon={props.icon} color={COLORS.WHITE} />
          <ZText text={props.text} color={COLORS.WHITE} fontWeight={'bold'}/>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ZButton;
