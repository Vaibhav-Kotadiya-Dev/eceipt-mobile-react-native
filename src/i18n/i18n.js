import LocalizedStrings from 'react-native-localization';
import english from './english'
import chinese from './chinese'
import slovenian from './slovenian'
import malay from './malay'

export const DEFAULT_LANGUAGE = 'en';

let strings = new LocalizedStrings({
  en: english,
  cn: chinese,
  sl: slovenian,
  ms: malay
});
module.exports = strings;

// export const changeLaguage = (languageKey) => {
//   strings.setLanguage(languageKey)
// }