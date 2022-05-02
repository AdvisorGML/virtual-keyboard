/* eslint no-console: off */
/* eslint-disable import/extensions */
/* eslint-env browser */

import * as StorageSet from './storageset.js';
import KeyboardRows from './rows.js';
import en from './en.js';
import ru from './ru.js';

const LanguageSet = { en, ru };

let language = StorageSet.get('Advisor-KbrdLang');
if (language === null) {
  language = 'en';
  StorageSet.set('Advisor-KbrdLang', 'en');
}
let Keys = LanguageSet[language];

// let Keys = language != null ? LanguageSet[language] : LanguageSet.en;

let isCapsLock = false;
let isControl = false;
let isAlt = false;

const container = document.createElement('div');
container.className = 'container';
document.body.append(container);

const helper = document.createElement('div');
helper.className = 'helper';
helper.innerHTML =
  '<h1>VIRTUAL KEYBOARD</h1><p>Use <kbd>Ctrl</kbd> + <kbd>Alt</kbd> to switch language.</p>';

const output = document.createElement('div');
output.className = 'output';
output.innerHTML = '<textarea id="output"></textarea>';

const keyboard = document.createElement('div');
keyboard.className = 'keyboard';
keyboard.dataset.language = language;
container.append(helper, output, keyboard);

// Add Keyboard
function AddKeys(element, row, keys) {
  element.forEach((el) => {
    const Key = document.createElement('div');
    Key.className = 'key';
    Key.dataset.class = 'unpress';

    Key.dataset.key = el;
    const SpecialKey = Boolean(
      el.match(
        /Backspace|Tab|Delete|CapsLock|Enter|Shift|Control|Win|Alt|Arrow/
      )
    );
    if (SpecialKey) {
      Key.dataset.class = 'special';
      Key.dataset.special = 'true';
    }
    row.append(Key);
    const ObjKeys = keys.find((obj) => obj.code === el);

    const SubLetter = document.createElement('div');
    const Letter = document.createElement('div');
    SubLetter.className = 'sub-letter';
    SubLetter.innerHTML = ObjKeys.LetterShift;
    SubLetter.dataset.display = 'false';
    Letter.className = 'letter';
    Letter.innerHTML = ObjKeys.Letter;
    Letter.dataset.display = 'true';
    Key.append(SubLetter, Letter);
  });
}
function GenerateKeyboard() {
  for (let i = 0; i < KeyboardRows.length; i += 1) {
    const Row = document.createElement('div');
    Row.className = 'keyboard-row';
    Row.dataset.row = i;
    AddKeys(KeyboardRows[i], Row, Keys);
    keyboard.append(Row);
    // output.focus();
  }
}

GenerateKeyboard();

function toUpperKey(name) {
  const Key = document.querySelectorAll('.key');
  Key.forEach((item) => {
    const element = item;
    const Letter = element.querySelector(name);
    if (!element.hasAttribute('data-special')) {
      Letter.innerHTML = Letter.innerHTML.toUpperCase();
    }
  });
}
function toLowerKey(name) {
  const Key = document.querySelectorAll('.key');
  Key.forEach((item) => {
    const element = item;
    const Letter = element.querySelector(name);
    if (!element.hasAttribute('data-special')) {
      Letter.innerHTML = Letter.innerHTML.toLowerCase();
    }
  });
}
function ChangeLanguage() {
  // let currentLanguage = keyboard.dataset.language;
  const currentLanguage = keyboard.dataset.language;
  console.log(`CURRENT LANGUAGE: ${currentLanguage}`);
  const LangArr = Object.keys(LanguageSet);
  let Indx = LangArr.indexOf(currentLanguage);
  Keys =
    Indx === 0
      ? LanguageSet[LangArr[(Indx += 1)]]
      : LanguageSet[LangArr[(Indx -= 1)]];
  keyboard.dataset.language = LangArr[Indx];
  StorageSet.set('Advisor-KbrdLang', LangArr[Indx]);
  // keyboard.innerHTML = '';
  // GenerateKeyboard();

  const Buttons = document.querySelectorAll('.key');
  Buttons.forEach((button) => {
    if (button.dataset.special !== 'true') {
      const keyObj = Keys.find((obj) => obj.code === button.dataset.key);
      const SubLetter = button.querySelector('.sub-letter');
      const Letter = button.querySelector('.letter');
      SubLetter.innerHTML = keyObj.LetterShift;
      Letter.innerHTML = keyObj.Letter;
      console.log(button.dataset.key);
    }
    if (isCapsLock) toUpperKey('.letter');
  });
}

function KeyDown(event) {
  console.log(event.code);
  if (event.code.match(/Control/)) isControl = true;
  if (event.code.match(/Alt/)) isAlt = true;
  if (isControl && isAlt) {
    console.log('CHANGE LAGUAGE');
    ChangeLanguage();
  }
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    const DivSubLetter = document.querySelectorAll('.sub-letter');
    DivSubLetter.forEach((item) => {
      const element = item;
      element.dataset.display = 'true';
    });
    const DivLetter = document.querySelectorAll('.letter');
    DivLetter.forEach((item) => {
      const element = item;
      element.dataset.display = 'false';
    });
    if (isCapsLock) toLowerKey('.sub-letter');
  }

  let str;
  const element = document.querySelector(`[data-key=${event.code}]`);
  element.dataset.class = 'press';
  const OutputArea = document.getElementById('output');
  switch (event.key) {
    case 'Tab':
      str = '\t';
      break;
    case 'Enter':
      str = '\n';
      break;
    case 'ArrowLeft':
      str = '←';
      break;
    case 'ArrowUp':
      str = '↑';
      break;
    case 'ArrowDown':
      str = '↓';
      break;
    case 'ArrowRight':
      str = '→';
      break;
    case 'CapsLock':
      if (!isCapsLock) {
        isCapsLock = true;
        toUpperKey('.letter');
      } else {
        isCapsLock = false;
        toLowerKey('.letter');
      }

      break;
    default:
      str = event.key;
  }
  const SpecialKey = Boolean(
    event.key.match(/Backspace|Delete|CapsLock|Shift|Control|Win|Alt/)
  );
  if (SpecialKey) str = '';

  OutputArea.value += str;
  OutputArea.focus();
}

function KeyUp(event) {
  console.log(`KeyUP: ${event.code}`);
  if (event.code.match(/Control/)) isControl = false;
  if (event.code.match(/Alt/)) isAlt = false;
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    const DivSubLetter = document.querySelectorAll('.sub-letter');
    DivSubLetter.forEach((item) => {
      const element = item;
      element.dataset.display = 'false';
    });
    const DivLetter = document.querySelectorAll('.letter');
    DivLetter.forEach((item) => {
      const element = item;
      element.dataset.display = 'true';
    });
    if (isCapsLock) toUpperKey('.sub-letter');
  }
  const element = document.querySelector(`[data-key=${event.code}]`);
  const isSpecial = element.getAttribute('data-special');
  element.dataset.class = 'unpress';
  if (isSpecial === 'true') element.dataset.class = 'special';
  if (isCapsLock && element.getAttribute('data-key') === 'CapsLock') {
    element.dataset.class = 'press';
  }
  // }
}

document.addEventListener('keydown', KeyDown);
document.addEventListener('keyup', KeyUp);
// document.addEventListener('mousedown', KeyDown);
// document.addEventListener('mouseup', KeyUp);
