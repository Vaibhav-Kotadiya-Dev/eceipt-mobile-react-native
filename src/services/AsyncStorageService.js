import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_DATA_TYPE } from '../common/Constants';

export async function storeData(key, value, dataType) {
  try {
    var storeValue;
    if (dataType == ASYNC_DATA_TYPE.JSON) {
      storeValue = JSON.stringify(value);
    } else {
      storeValue = value;
    }
    await AsyncStorage.setItem(key, storeValue);
  } catch (e) {
    console.log('[ASYNC-S]', e);
  }
}

export async function getData(key, dataType) {
  try {
    var storeValue = await AsyncStorage.getItem(key);
    if (storeValue !== null) {
      if (dataType == ASYNC_DATA_TYPE.JSON) {
        return JSON.parse(storeValue);
      } else {
        return storeValue;
      }
    }
    return null;
  } catch (e) {
    console.log('[ASYNC-G]', e);
  }
}

export async function removeData(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log('[ASYNC-R]', e);
  }
}