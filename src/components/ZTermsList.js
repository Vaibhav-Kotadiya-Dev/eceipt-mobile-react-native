import React, {useEffect, useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, TEXT_SIZE } from '../common/Constants'
import ZIconButton from './ZIconButton';
import ZText from './ZText';
import ZCard from './ZCard';

const ZTermsList = (props) => {
  const [termsList, setTermsList] = useState(props.data)

  useEffect(() => {
    setTermsList(props.data);
  }, [props.data])

  const updatetermsList = (lst) => {
    props.updateList(lst)
  }

  const deleteTerm = (k) => {
    var tempList = []
    tempList = termsList?.filter((value, key) => k != key)?.map((value, key) => value)
    setTermsList(tempList);
    updatetermsList(tempList)
  };

  return (
    <View>
      <ZCard>
        {termsList?.map((value, key) =>
          <View key={key} style={styles.container}>
            <View style={styles.container1}>
              <View style={styles.containerIcon}>
                <ZIconButton
                  icon={'close'}
                  style={{ padding: 0 }}
                  iconStyle={{ marginRight: 0 }}
                  backgroundColor={COLORS.WHITE}
                  color={COLORS.ERRORRED}
                  onPress={() => deleteTerm(key)} />
              </View>
              <View style={styles.containerTitle}>
                <ZText text={value?.name} size={TEXT_SIZE.NORMAL} ellipsizeMode='tail' numberOfLines={1} />
                <ZText text={value?.description} size={TEXT_SIZE.SMALL} color={COLORS.GREY} ellipsizeMode='tail' numberOfLines={1} />
              </View>
            </View>
          </View>
        )}

      </ZCard>
    </View>
  );
};

export default ZTermsList;

const styles = StyleSheet.create({
  container: {
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.LIGHTBLUE,
    padding: 5,
  },
  container1: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHTGREY,
    alignItems: 'center'
  },
  containerRemarkText: {
    flex: 1,
    paddingTop: 1,
    paddingBottom: 1,
    paddingRight: 5,
    borderBottomColor: COLORS.YELLOW,
    borderBottomWidth: 0.5,
    marginBottom: 5,
    marginLeft: 5,
  },
  containerIcon: {
    paddingLeft: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  containerTitle: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  containerQty: {
    flex: 1,
  },
  containerQtyText: {
    paddingTop: 1,
    paddingBottom: 1,
    paddingRight: 5,
    borderRadius: 5,
    textAlign: 'right',
    borderColor: 'gray',
    borderWidth: 1,
  },
  containerUOM: {
    width: 30,
    marginRight: 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
});