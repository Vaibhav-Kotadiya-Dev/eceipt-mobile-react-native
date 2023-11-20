import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { COLORS, STYLE } from '../common/Constants';

const ZTextInput = (props) => {
  return (
    <View style={{ margin: 5 }}>
      <TextInput
        mode='outlined'
        secureTextEntry={props.secureTextEntry}
        style={[props.style]}
        label={props.title}
        placeholder={props.title}
        selectionColor={COLORS.LIGHTBLUE}
        value={props.value}
        error={props.error}
        numberOfLines = {props.numberOfLines}
        disabled={props.disabled}
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        multiline={props.multiline}
        left={props.left}
        right={props.rightText ? <TextInput.Affix text={props.rightText} /> :
          props.rightIcon ? <TextInput.Icon name={props.rightIcon} onPress={props.rightIconOnPress} color={COLORS.GREY} /> : null}
        theme={{
          colors: {
            placeholder: COLORS.GREY,
            text: COLORS.DARK_BLUE,
            primary: COLORS.LIGHTBLUE,
            background: COLORS.WHITE,
            underlineColor: 'transparent',
          }
        }}
      />
    </View>
  );
};

export default ZTextInput;

const styles = StyleSheet.create({
  container: {
    borderWidth: STYLE.BORDERWIDTH,
    borderColor: STYLE.BORDERCOLOR
  },
});
