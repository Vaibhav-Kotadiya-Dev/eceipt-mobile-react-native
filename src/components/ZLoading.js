import React from 'react';
import { View, ActivityIndicator, Modal } from 'react-native';
import { COLORS } from '../common/Constants';

const ZLoading = ({ isLoading }) => {
  return (
    <View style={{
      backgroundColor: 'transparent', height: '100%', width: '100%', position: 'absolute',
      left: 0,
      top: 0
    }}>
      <Modal transparent={true} visible={isLoading}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}>
          <ActivityIndicator size="large" animating={true} color={COLORS.PRIMARY} />
        </View>
      </Modal>
    </View >
  );

};

export default ZLoading;
