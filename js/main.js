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
output.innerHTML = '<textarea id="output" autofocus spellcheck="false"></textarea>';

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
    output.focus();
  }
}

// GenerateKeyboard();

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
  const currentLanguage = keyboard.dataset.language;
  const LangArr = Object.keys(LanguageSet);
  let Indx = LangArr.indexOf(currentLanguage);
  Keys =
    Indx === 0
      ? LanguageSet[LangArr[(Indx += 1)]]
      : LanguageSet[LangArr[(Indx -= 1)]];
  keyboard.dataset.language = LangArr[Indx];
  StorageSet.set('Advisor-KbrdLang', LangArr[Indx]);

  const Buttons = document.querySelectorAll('.key');
  Buttons.forEach((button) => {
    if (button.dataset.special !== 'true') {
      const keyObj = Keys.find((obj) => obj.code === button.dataset.key);
      const SubLetter = button.querySelector('.sub-letter');
      const Letter = button.querySelector('.letter');
      SubLetter.innerHTML = keyObj.LetterShift;
      Letter.innerHTML = keyObj.Letter;
      // console.log(button.dataset.key);
    }
    if (isCapsLock) toUpperKey('.letter');
  });
}

function Output(element) {
  const OutputArea = document.getElementById('output');
  const Text = element.querySelector('[data-display="true"]').innerHTML;
  let OutputStr = OutputArea.value;
  let CursorPos = OutputArea.selectionStart;
  const LeftText = OutputArea.value.slice(0, CursorPos);
  const RightText = OutputArea.value.slice(CursorPos);
  let isSpecialKey = false;
  switch (Text) {
    case 'Tab':
      OutputStr = `${LeftText}\t${RightText}`;
      CursorPos += 1;
      break;
    case 'Enter':
      OutputStr = `${LeftText}\n${RightText}`;
      CursorPos += 1;
      break;
    case 'ArrowLeft':
      OutputStr = '←';
      break;
    case 'ArrowUp':
      OutputStr = '↑';
      break;
    case 'ArrowDown':
      OutputStr = '↓';
      break;
    case 'ArrowRight':
      OutputStr = '→';
      break;
    case 'Backspace':
      OutputStr = `${LeftText.slice(0, -1)}${RightText}`;
      CursorPos -= 1;
      break;
    case 'Delete':
      OutputStr = `${LeftText}${RightText.slice(1)}`;
      break;
    default:
      isSpecialKey = Boolean(Text.match(/CapsLock|Shift|Ctrl|Win|Alt/));
      if (isSpecialKey) {
        OutputStr = `${LeftText}${RightText}`;
      } else {
        OutputStr = `${LeftText}${Text}${RightText}`;
        CursorPos += 1;
      }
      break;
  }

  OutputArea.value = OutputStr;
  OutputArea.selectionStart = CursorPos;
  OutputArea.selectionEnd = CursorPos;
  // ;
}

function KeyDown(event) {
  console.log(event.type);
  if (event.type === 'keydown') event.preventDefault();
  // console.log(event);
  if (event.code.match(/Control/)) isControl = true;
  if (event.code.match(/Alt/)) isAlt = true;
  if (isControl && isAlt) {
    ChangeLanguage();
  }
  if (event.key === 'CapsLock') {
    if (!isCapsLock) {
      isCapsLock = true;
      toUpperKey('.letter');
    } else {
      isCapsLock = false;
      toLowerKey('.letter');
    }
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

  const element = document.querySelector(`[data-key=${event.code}]`);
  element.dataset.class = 'press';
  Output(element);
}

function KeyUp(event) {
  // console.log(`KeyUP: ${event.code}`);
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

function MouseDown(event) {
  event.stopPropagation();
  const DivKey = event.target.closest('.key');
  if (!DivKey) return;
  const DivKeyCode = DivKey.dataset.key;
  const Obj = Object({ code: DivKeyCode, key: DivKeyCode, type: 'mousedown' });
  KeyDown(Obj);
}

function MouseUp(event) {
  event.stopPropagation();
  const DivKey = event.target.closest('.key');
  if (!DivKey) return;
  const DivKeyCode = DivKey.dataset.key;
  const Obj = Object({ code: DivKeyCode, key: DivKeyCode });
  KeyUp(Obj);
}

GenerateKeyboard();

document.addEventListener('keydown', KeyDown);
document.addEventListener('keyup', KeyUp);
keyboard.addEventListener('mousedown', MouseDown);
keyboard.addEventListener('mouseup', MouseUp);
