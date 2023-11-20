import React from 'react';
import { MENU_ICON_SIZE, COLORS } from '../common/Constants'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ZIconButton = (props) => {
  const color = props.color ? props.color : COLORS.WHITE;
  const size = props.size ? props.size : MENU_ICON_SIZE.NORMAL;
  const backgroundColor = props.backgroundColor ? props.backgroundColor : COLORS.PRIMARY;
  return (
    <Icon.Button
      style={props.style}
      iconStyle={props.iconStyle}
      name={props.icon}
      color={color} 
      size={size}
      backgroundColor={backgroundColor}
      onPress={props.onPress}      
      >{props.text}</Icon.Button>
  );
};

export default ZIconButton;