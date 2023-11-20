import React from 'react';
import { COLORS, TEXT_SIZE } from '../common/Constants'
import { View, StyleSheet } from 'react-native';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';

import ZText from './ZText';
import ZIcon from './ZIcon';

const ZCollapseBox = (props) => {
  return (
    <Collapse isCollapsed={!props.collapse} onToggle={props.onToggle}
      onTo
      style={styles.container}>
      <CollapseHeader style={styles.header}>
        <View style={styles.headerView}>
          {props.icon ? <ZIcon icon={props.icon} /> : null}
          <ZText text={props.titleText} size={TEXT_SIZE.TITLE} />
        </View>
      </CollapseHeader>
      <CollapseBody style={styles.body}>
        {props.children}
      </CollapseBody>
    </Collapse>
  );
};

export default ZCollapseBox;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 5,
    borderBottomColor: COLORS.DARK_BLUE,
    borderBottomWidth: 1
  },
  header: {
    height: 60,
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  headerView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    backgroundColor: COLORS.LIGHTGREY,
  },
});