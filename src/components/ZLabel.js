import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { TEXT_SIZE, COLORS } from '../common/Constants'

const ZLabel = (props) => {
  const color = props.color ? props.color : COLORS.TEXT_COLOR;
  const size = props.size ? props.size : TEXT_SIZE.NORMAL;
  return (
    <View style={[props.style, {
      margin: 5,
      padding: 5,
      paddingBottom:3,
      paddingTop:3,
      borderRadius: 5,
      alignItems:'center',
      backgroundColor: props.backgroundColor
    }]}>
      <Text 
        ellipsizeMode={props.ellipsizeMode}
        numberOfLines={props.numberOfLines}
        style={{ color: color, fontSize: size, fontWeight: props.fontWeight, height: props.height }}
        onPress={props.onPress}
      >
        {props.text}
      </Text>
    </View>);
};

export default ZLabel;
