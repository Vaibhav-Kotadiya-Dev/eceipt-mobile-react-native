import React from 'react';
import { MENU_ICON_SIZE, COLORS } from '../common/Constants'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ZIcon = (props) => {
  const color = props.color ? props.color : COLORS.PRIMARY;
  const size = props.size ? props.size : MENU_ICON_SIZE.NORMAL;
  return (
    <Icon style={props.style} name={props.icon} color={color} size={size} onPress={props.onPress}/>
  );
};

export default ZIcon;