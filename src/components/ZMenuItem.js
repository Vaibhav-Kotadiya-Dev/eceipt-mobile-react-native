import React from 'react';
import { StyleSheet } from 'react-native';
import { DrawerItem } from '@react-navigation/drawer';
import { TEXT_SIZE, COLORS } from '../common/Constants'
import ZIcon from '../components/ZIcon';

const ZMenuItem = (props) => {
  return (
    <DrawerItem
      icon={() => (<ZIcon icon={props.icon} />)}
      label={props.text}
      labelStyle={{...styles.drawerItem, ...props.labelStyle}}
      onPress={props.onPress}
    />
  );
};

export default ZMenuItem;

const styles = StyleSheet.create({
  drawerItem: {
    fontSize:TEXT_SIZE.NORMAL,
    color:COLORS.DARK_BLUE
    
  }
});