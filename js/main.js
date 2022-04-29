/* eslint no-console: off */
/* eslint-disable import/extensions */

import KeybordRows from './rows.js';
import Keys from './en.js';

// eslint-disable-next-line no-undef
const container = document.createElement('div');
container.className = 'container';
// eslint-disable-next-line no-undef
document.body.append(container);

// eslint-disable-next-line no-undef
const helper = document.createElement('div');
helper.className = 'helper';
helper.innerHTML = '<h1>VIRTUAL KEYBOARD</h1><p>Use <kbd>Ctrl</kbd> + <kbd>Alt</kbd> to switch language.</p>';

// eslint-disable-next-line no-undef
const output = document.createElement('div');
output.className = 'output';
output.innerHTML = '<textarea id="output"></textarea>';

// eslint-disable-next-line no-undef
const keyboard = document.createElement('div');
keyboard.className = 'keyboard';
container.append(helper, output, keyboard);

// Add Keybord
function AddKeys(element, row, keys) {
  element.forEach((el) => {
    const Key = document.createElement('div');
    Key.className = 'key';
    Key.dataset.key = el;
    const SpecialKey = Boolean(el.match(/Backspace|Tab|Delete|CapsLock|Enter|Shift|Control|Win|Alt|Arrow/));
    if (SpecialKey) Key.dataset.special = el;
    row.append(Key);
    const ObjKeys = keys.find((obj) => obj.code === el);

    console.log(`${el} ${ObjKeys}`);
    const SubLetter = document.createElement('div');
    const Letter = document.createElement('div');
    SubLetter.className = 'sub-letter';
    // SubLetter.innerHTML = ObjKeys.LetterShift;
    Letter.className = 'letter';
    Letter.innerHTML = ObjKeys.Letter;
    Key.append(SubLetter, Letter);
  });
}
function GenerateKeyboard() {
  for (let i = 0; i < KeybordRows.length; i += 1) {
    const Row = document.createElement('div');
    Row.className = 'keyboard-row';
    Row.dataset.row = i;
    AddKeys(KeybordRows[i], Row, Keys);
    keyboard.append(Row);
  }
}

GenerateKeyboard();
