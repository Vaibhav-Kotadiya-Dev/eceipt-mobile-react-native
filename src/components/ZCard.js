import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

const ZCard = (props) => {
  return (
    <View style={styles.container}>
      <Card >
        <Card.Content style={styles.content}>
          {props.children}
        </Card.Content>
      </Card>
    </View>
  );
};

export default ZCard;

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  content: {
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 1,
    paddingRight: 1
  }
});