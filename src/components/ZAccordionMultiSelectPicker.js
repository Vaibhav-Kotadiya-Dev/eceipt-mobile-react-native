import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { PaperSelect } from 'react-native-paper-select';
import strings from "../i18n/i18n";
import { COLORS } from '../common/Constants';

export default function ZAccordionMultiSelectPicker(props) {
  const [list, setList] = useState({
    value: props?.value || '',
    list: props?.data || [],
    selectedList: props?.selectedList || [],
    error: '',
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (props?.data?.length) {
      setList({
        ...list,
        list: props?.data || [],
      })
    }
  }, [props?.data])

  useEffect(() => {
    if (isMounted) {
      if (props?.selectedList?.length) {
        setList({
          ...list,
          value: props?.value || '',
          list: props?.data || [],
          selectedList: props?.selectedList || [],
        })
        setIsMounted(false);
      }
    }
  }, [props?.selectedList])

  const onSelect = (value) => {
    if (props?.onSelect) {
      props?.onSelect(value.selectedList);
    }
    setList({
      ...list,
      value: value.text,
      selectedList: value.selectedList,
      error: '',
    });
  }

  return (
    <View style={styles.container}>
      <PaperSelect
        value={list.value ? list.value : (props?.title || '')}
        onSelection={(value) => onSelect(value)}
        hideSearchBox
        textInputMode='outlined'
        textInputProps={{outlineColor: COLORS.GREY}}
        dialogTitle={props?.title}
        arrayList={[...list.list]}
        selectedArrayList={[...list.selectedList]}
        errorText={list.error}
        multiEnable={true}
        dialogCloseButtonStyle={{
          color: COLORS.ERRORRED,
          padding: 10,
          borderRadius: 8,
        }}
        dialogDoneButtonStyle={{
          color: COLORS.PRIMARY,
          padding: 10,
          borderRadius: 8,
        }}
        dialogCloseButtonText={strings.CANCEL}
        dialogDoneButtonText={strings.SELECT}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#f5f5f5',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },

  button: {
    marginVertical: 10,
    width: '100%',
    backgroundColor: 'blue',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
    color: 'white',
  },
});