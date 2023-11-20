import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../common/Constants';
import { List } from 'react-native-paper';
import ZTextInput from './ZTextInput';
import ZIconButton from './ZIconButton';

const ZAccordionPickerInput = (props) => {
  const [title, setTitle] = useState(props.title);
  const [expanded, setExpanded] = useState(false);
  const [customizedCurrency, setCustomizedCurrency] = useState('');

  return (
    <View style={styles.container}>
      <List.Section style={styles.listSection}>
        <List.Accordion
          title={props.value ? props.value : title}
          expanded={expanded}
          onPress={() => setExpanded(!expanded)}
          theme={{
            colors: { primary: COLORS.DARK_BLUE, text: COLORS.DARK_BLUE }
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <ZTextInput title={''} value={customizedCurrency}
                onChangeText={(value) => setCustomizedCurrency(value)} />
            </View>
            <View style={{ marginLeft: 5, marginRight: 5 }} >
              <ZIconButton icon={'check'} iconStyle={{ marginRight: 5, marginLeft: 5 }} backgroundColor={COLORS.GREEN}
                onPress={() => { 
                  setExpanded(false);
                  setTitle(customizedCurrency);
                  props.onSelect(customizedCurrency)
                }} />
            </View>
          </View>
          {Object.entries(props.data).map(([key, value]) => (
            <TouchableOpacity key={key}>
              <List.Item title={value} onPress={() => {
                setExpanded(false);
                setTitle(value);
                props.onSelect(value)
              }}
                theme={{ colors: { text: COLORS.DARK_BLUE } }} />
            </TouchableOpacity >
          ))}
        </List.Accordion>
      </List.Section>
    </View>
  );
};

export default ZAccordionPickerInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
  },
  listSection: {
    flex: 1,
    marginTop: 7,
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.GREY,
    borderWidth: 1,
    borderRadius: 5
  }
});