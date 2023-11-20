
import React, {useEffect} from 'react';
import { View, StyleSheet, ScrollView, BackHandler, Linking } from 'react-native';
import { COLORS, TEXT_SIZE } from '../../common/Constants';
import strings from '../../i18n/i18n'
import ZText from '../../components/ZText';

const InstructionScreen = (props) => {
  const handleBackButtonClick = () => {
    props.navigation.navigate('SettingsMain')
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>
        <ZText text={strings.INSTRUCTION} size={TEXT_SIZE.TITLE} color={COLORS.ORANGE} />
        <ZText style={{ marginBottom: 5 }} text={strings.INST_1} size={TEXT_SIZE.NORMAL} />
        <ZText text={strings.INST_2} size={TEXT_SIZE.NORMAL} />
        <ZText text={strings.INST_3} size={TEXT_SIZE.SMALL} />
        <ZText text={strings.INST_4} size={TEXT_SIZE.SMALL} />
        <ZText text={strings.INST_5} size={TEXT_SIZE.SMALL} />
        <ZText text={strings.INST_6} size={TEXT_SIZE.SMALL} />
        <ZText style={{ marginBottom: 5 }} text={strings.INST_7} size={TEXT_SIZE.SMALL} />
        <ZText text={strings.INST_8} size={TEXT_SIZE.NORMAL} />
        <ZText style={{ marginBottom: 5 }} text={strings.INST_9} size={TEXT_SIZE.NORMAL} />
        <ZText text={strings.INST_10} size={TEXT_SIZE.TITLE} color={COLORS.ORANGE} />
        <ZText style={{ marginBottom: 5 }} text={strings.INST_11} size={TEXT_SIZE.NORMAL} />
        <ZText text={strings.INST_12} size={TEXT_SIZE.TITLE} color={COLORS.ORANGE} />

        <ZText text={strings.INST_13} size={TEXT_SIZE.NORMAL} />

        <View style={{alignItems:'center'}}>
          <ZText text={'support@eceiptmobile.com'} size={TEXT_SIZE.NORMAL} color={COLORS.ORANGE} onPress={() => Linking.openURL('mailto:support@eceiptmobile.com')} />
        </View>
        <ZText text={strings.INST_14} size={TEXT_SIZE.NORMAL} />
      </ScrollView>
    </View >
  );
}

export default InstructionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    borderBottomColor: COLORS.LIGHTGREY,
    borderBottomWidth: 1
  },
  numberFormatInput: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

