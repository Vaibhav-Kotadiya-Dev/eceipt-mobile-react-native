import React, {useState, useEffect} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TEXT_SIZE } from '../common/Constants'
import strings from '../i18n/i18n'
import ZIconButton from './ZIconButton';
import ZText from './ZText';
import ZCard from './ZCard';

const ZClientCard = (props) => {

  const [client, setClient] = useState(props.data);

  useEffect(() => {
    setClient(props.data);
  }, [props.data])

  return (
    <View>
      <ZCard>
        <View style={styles.container}>
          <View style={{ flex: 11 }}>
            <TouchableOpacity onPress={props.onPressEdit}>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.containerTitle}>
                  <ZText text={client?.name || ''} size={TEXT_SIZE.BIG} ellipsizeMode='tail' numberOfLines={1} />
                  <ZText text={client?.description || ''} size={TEXT_SIZE.NORMAL} color={COLORS.GREY} ellipsizeMode='tail' numberOfLines={1} />
                  <ZText text={strings.REMARKS + ': ' + (client?.remark || '')} size={TEXT_SIZE.SMALL} color={COLORS.GREY} ellipsizeMode='tail' numberOfLines={1} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.containerIcon}>
            <ZIconButton
              icon={'close'}
              style={{ padding: 0 }}
              iconStyle={{ marginRight: 0 }}
              backgroundColor={COLORS.WHITE}
              color={COLORS.ERRORRED}
              onPress={props.onPressDelete} />
          </View>
        </View>
      </ZCard>
    </View>
  );
};

export default ZClientCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10
  },
  containerTitle: {
    flex: 8,
    height: 70,
    marginTop: 5,
    marginBottom: 5
  },
  containerIcon: {
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});