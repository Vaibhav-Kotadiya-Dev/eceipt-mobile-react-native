import React, {useState} from 'react';
import { View } from 'react-native';
import { COLORS } from '../common/Constants'
import { Searchbar } from 'react-native-paper';

const ZSearchBar = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <View>
      <Searchbar
        placeholder={props.placeholder}
        onChangeText={(value) => { 
          setSearchQuery(value);
          props.onChangeText(value);
        }}
        value={searchQuery}
        onClearIconPress={props?.onClearIconPress}
        theme={{
          colors: { primary: COLORS.LIGHTBLUE, }
        }}
        onIconPress={props?.onPressSearchIcon}
      />
    </View>
  )
};

export default ZSearchBar;