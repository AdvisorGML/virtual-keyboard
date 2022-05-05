import * as StorageSet from './storageset.js';
import en from './en.js';
import ru from './ru.js';

const LanguageSet = { en, ru };

export default class Keyboard {
  constructor(Rows) {
    this.KeyboardRows = Rows;
    this.isCapsLock = false;
    this.isControl = false;
    this.isAlt = false;
  }

  main(language) {
    this.Keys = LanguageSet[language];

    this.container = document.createElement('div');
    this.container.className = 'container';
    document.body.append(this.container);

    this.helper = document.createElement('div');
    this.helper.className = 'helper';
    this.helper.innerHTML = '<h1>VIRTUAL KEYBOARD</h1><p>Use <kbd>Ctrl</kbd> + <kbd>Alt</kbd> to switch language.</p>';

    this.output = document.createElement('div');
    this.output.className = 'output';
    this.output.innerHTML = '<textarea id="output" autofocus spellcheck="false"></textarea>';

    this.keyboard = document.createElement('div');
    this.keyboard.className = 'keyboard';
    this.keyboard.dataset.language = language;
    this.container.append(this.helper, this.output, this.keyboard);
    return this;
  }

  GenerateKeyboard() {
    for (let i = 0; i < this.KeyboardRows.length; i += 1) {
      const Row = document.createElement('div');
      Row.className = 'keyboard-row';
      Row.dataset.row = i;
      this.AddKeys(this.KeyboardRows[i], Row, this.Keys);
      this.keyboard.append(Row);
      this.output.focus();
    }

    document.addEventListener('keydown', this.KeyDown);
    document.addEventListener('keyup', this.KeyUp);
    this.keyboard.addEventListener('mousedown', this.MouseDown);
    this.keyboard.addEventListener('mouseup', this.MouseUp);
  }

  AddKeys = (element, row, keys) => {
    element.forEach((el) => {
      this.Key = document.createElement('div');
      this.Key.className = 'key';
      this.Key.dataset.class = 'unpress';
      this.Key.dataset.key = el;

      const SpecialKey = Boolean(el.match(/Backspace|Tab|Delete|CapsLock|Enter|Shift|Control|Win|Alt|Arrow/));
      if (SpecialKey) {
        this.Key.dataset.class = 'special';
        this.Key.dataset.special = 'true';
      }
      row.append(this.Key);
      const ObjKeys = keys.find((obj) => obj.code === el);

      const SubLetter = document.createElement('div');
      const Letter = document.createElement('div');
      SubLetter.className = 'sub-letter';
      SubLetter.innerHTML = ObjKeys.LetterShift;
      SubLetter.dataset.display = 'false';
      Letter.className = 'letter';
      Letter.innerHTML = ObjKeys.Letter;
      Letter.dataset.display = 'true';
      this.Key.append(SubLetter, Letter);
    });
  };

  KeyDown = (event) => {
    if (event.type === 'keydown') event.preventDefault();
    if (event.code.match(/Control/)) this.isControl = true;
    if (event.code.match(/Alt/)) this.isAlt = true;
    if (this.isControl && this.isAlt) {
      this.ChangeLanguage();
    }
    if (event.key === 'CapsLock') {
      if (!this.isCapsLock) {
        this.isCapsLock = true;
        this.toUpperKey('.letter');
      } else {
        this.isCapsLock = false;
        this.toLowerKey('.letter');
      }
    }

    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      const DivSubLetter = this.keyboard.querySelectorAll('.sub-letter');
      DivSubLetter.forEach((item) => {
        const element = item;
        element.dataset.display = 'true';
      });
      const DivLetter = this.keyboard.querySelectorAll('.letter');
      DivLetter.forEach((item) => {
        const element = item;
        element.dataset.display = 'false';
      });
      if (this.isCapsLock) this.toLowerKey('.sub-letter');
    }

    const element = this.keyboard.querySelector(`[data-key=${event.code}]`);
    if (!element) return;
    element.dataset.class = 'press';
    this.Output(element);
  };

  KeyUp = (event) => {
    if (event.code.match(/Control/)) this.isControl = false;
    if (event.code.match(/Alt/)) this.isAlt = false;
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      const DivSubLetter = this.keyboard.querySelectorAll('.sub-letter');
      DivSubLetter.forEach((item) => {
        const element = item;
        element.dataset.display = 'false';
      });
      const DivLetter = this.keyboard.querySelectorAll('.letter');
      DivLetter.forEach((item) => {
        const element = item;
        element.dataset.display = 'true';
      });
      if (this.isCapsLock) this.toUpperKey('.sub-letter');
    }
    const element = this.keyboard.querySelector(`[data-key=${event.code}]`);
    if (!element) return;
    this.isSpecial = element.getAttribute('data-special');
    element.dataset.class = 'unpress';
    if (this.isSpecial === 'true') element.dataset.class = 'special';
    if (this.isCapsLock && element.getAttribute('data-key') === 'CapsLock') {
      element.dataset.class = 'press';
    }
  };

  MouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const DivKey = event.target.closest('.key');
    if (!DivKey) return;
    const DivKeyCode = DivKey.dataset.key;
    const Obj = Object({
      code: DivKeyCode,
      key: DivKeyCode,
      type: 'mousedown',
    });
    DivKey.addEventListener('mouseleave', this.ResetKey);
    this.KeyDown(Obj);
  };

  MouseUp = (event) => {
    const DivKey = event.target.closest('.key');
    if (!DivKey) return;
    const DivKeyCode = DivKey.dataset.key;
    const Obj = Object({ code: DivKeyCode, key: DivKeyCode, type: 'mouseup' });
    this.KeyUp(Obj);
  };

  ResetKey = (Obj) => {
    const DivKey = Obj.target;
    const DivKeyCode = DivKey.dataset.key;
    this.KeyUp(Object({ code: DivKeyCode, key: DivKeyCode, type: 'mouseup' }));
  };

  toUpperKey = (name) => {
    this.Key = this.keyboard.querySelectorAll('.key');
    this.Key.forEach((item) => {
      const element = item;
      const Letter = element.querySelector(name);
      if (!element.hasAttribute('data-special')) {
        Letter.innerHTML = Letter.innerHTML.toUpperCase();
      }
    });
  };

  toLowerKey = (name) => {
    this.Key = this.keyboard.querySelectorAll('.key');
    this.Key.forEach((item) => {
      const element = item;
      const Letter = element.querySelector(name);
      if (!element.hasAttribute('data-special')) {
        Letter.innerHTML = Letter.innerHTML.toLowerCase();
      }
    });
  };

  ChangeLanguage() {
    const currentLanguage = this.keyboard.dataset.language;
    const LangArr = Object.keys(LanguageSet);
    let Indx = LangArr.indexOf(currentLanguage);
    this.Keys = Indx === 0 ? LanguageSet[LangArr[(Indx += 1)]] : LanguageSet[LangArr[(Indx -= 1)]];
    this.keyboard.dataset.language = LangArr[Indx];
    StorageSet.set('Advisor-KbrdLang', LangArr[Indx]);

    const Buttons = this.keyboard.querySelectorAll('.key');
    Buttons.forEach((button) => {
      if (button.dataset.special !== 'true') {
        const keyObj = this.Keys.find((obj) => obj.code === button.dataset.key);
        const SubLetter = button.querySelector('.sub-letter');
        const Letter = button.querySelector('.letter');
        SubLetter.innerHTML = keyObj.LetterShift;
        Letter.innerHTML = keyObj.Letter;
      }
      if (this.isCapsLock) this.toUpperKey('.letter');
    });
  }

  Output = (element) => {
    this.OutputArea = document.getElementById('output');
    const Text = element.querySelector('[data-display="true"]').innerHTML;
    let OutputStr = this.OutputArea.value;
    let CursorPos = this.OutputArea.selectionStart;
    const LeftText = this.OutputArea.value.slice(0, CursorPos);
    const RightText = this.OutputArea.value.slice(CursorPos);
    this.isSpecialKey = false;
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
        this.isSpecialKey = Boolean(Text.match(/CapsLock|Shift|Ctrl|Win|Alt/));
        if (this.isSpecialKey) {
          OutputStr = `${LeftText}${RightText}`;
        } else {
          OutputStr = `${LeftText}${Text}${RightText}`;
          CursorPos += 1;
        }
        break;
    }

    this.OutputArea.value = OutputStr;
    this.OutputArea.selectionStart = CursorPos;
    this.OutputArea.selectionEnd = CursorPos;
  };
}

// GenerateKeyboard();
