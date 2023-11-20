import React from 'react';
import { View, Dimensions, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { COLORS, TEXT_SIZE } from '../common/Constants';
import ZText from './ZText'
import ZButton from './ZButton';

const { width } = Dimensions.get('window');

const ZModal = (props) => {
  return (
    <View style={{ backgroundColor: 'transparent' }}>
      <Modal visible={props.visible} transparent={true}>
        <TouchableOpacity
          onPress={props.onPressOutside}
          style={styles.touch}>
          <View
            style={styles.views}>

            <ZText text={props.title} size={TEXT_SIZE.TITLE} textColor={COLORS.PRIMARY} fontWeight={'bold'} />
            {props.text ?
              <ZText text={props.text} size={TEXT_SIZE.NORMAL} textColor={COLORS.PRIMARY} />
              : null}
            <View style={{ flexDirection: 'row' }}>
              {props.okButton == false ? null : (
                <View style={{ flex: 1 }}>
                  <ZButton text={props.okText} color={COLORS.PRIMARY} onPress={props.onPressOK} />
                </View>)}
              {props.deleteButton === false ? null : (
                <View style={{ flex: 1 }}>
                  <ZButton text={props.deleteText} color={COLORS.ERRORRED} onPress={props.onPressDelete} />
                </View>)}
              {props.cancelButton === false ? null : (
                <View style={{ flex: 1 }}>
                  <ZButton text={props.cancelText} color={COLORS.SECONDRY} onPress={props.onPressCancel} />
                </View>)}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View >

  );
};

export default ZModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white', padding: 20
  },
  touch: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    width,
  },
  views: {
    width: '90%',
    backgroundColor: COLORS.WHITE,
    borderRadius: 5,
    borderColor: COLORS.LIGHTGREY,
    padding: 10,
  },
});