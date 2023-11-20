import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../common/Constants';
import { List } from 'react-native-paper';

const ZAccordionPicker = (props) => {
  const [title, setTitle] = useState(props.title);
  const [expanded, setExpanded] = useState(false);


  return (
    <View style={styles.container}>
      <List.Section style={styles.listSection}>
        <List.Accordion
          title={props.value ? props.value : title}
          expanded={expanded}
          containerStyle={styles.containerStyle}
          style={styles.listAccordion}
          onPress={() => setExpanded(!expanded)}
          titleStyle={{color: COLORS.TEXT_COLOR}}
          theme={{
            colors: { primary: COLORS.DARK_BLUE, text: COLORS.DARK_BLUE, background: COLORS.WHITE, onSurfaceVariant: COLORS.TEXT_COLOR },
          }}>

          {Object.entries(props.data).map(([key, value]) => (
            <TouchableOpacity key={key}>
              <List.Item title={value} onPress={() => {
                setExpanded(false);
                setTitle(value);
                props.onSelect(value);
              }}
                theme={{ colors: { text: COLORS.DARK_BLUE } }} />
            </TouchableOpacity >
          ))}
        </List.Accordion>
      </List.Section>
    </View>
  );
};

export default ZAccordionPicker;

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
    borderRadius: 5,
  },
  containerStyle: {
    borderRadius: 5,
  },
  listAccordion: {
    height: 60,
  }
});