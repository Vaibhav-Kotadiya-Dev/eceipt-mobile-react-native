import React from 'react';
import { View } from 'react-native';
import { Title } from 'react-native-paper';
import {TEXT_SIZE} from '../common/Constants'

const ZMenuTitle = (props) => {
  const fontSize = props.fontSize ? props.fontSize : TEXT_SIZE.TITLE;
  const height = props.height ? props.height : 60;
  return (
    <View style={{ flex: 1 }}>
      <Title style={{
        fontSize: fontSize,
        marginTop: 3,
        height: height,
        fontWeight: 'bold',
      }} ellipsizeMode='clip'>{props.text}</Title>
    </View>
  );
};

export default ZMenuTitle;