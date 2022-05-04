import * as StorageSet from './storageset.js';
import Keyboard from './main.js';
import KeyboardRows from './rows.js';

let language = StorageSet.get('Advisor-KbrdLang');
if (language === null) {
  language = 'en';
  StorageSet.set('Advisor-KbrdLang', 'en');
}

new Keyboard(KeyboardRows).main(language).GenerateKeyboard();
