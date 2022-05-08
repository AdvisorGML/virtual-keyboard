class Keyboard {
  constructor(Rows) {
    this.KeyboardRows = Rows;
    this.isCapsLock = false;
    this.isControl = false;
    this.isAlt = false;
    this.isShift = false;
  }

  StorageGet = (name) => {
    this.StorageLanguage = window.localStorage.getItem(name) || null;
    return this.StorageLanguage;
  };

  StorageSet = (name, value) => {
    this.set = window.localStorage.setItem(name, value);
  };

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

      const SpecialKey = Boolean(el.match(/Backspace|Tab|Delete|CapsLock|Enter|Shift|Control|LNG|Alt|Arrow/));
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
    if (event.type === 'mousedown' && event.code === 'LNG') {
      this.ChangeLanguage();
    }
    if (this.isControl && this.isAlt) {
      this.ChangeLanguage();
    }
    if (event.key === 'CapsLock') {
      if (!this.isCapsLock && !this.isShift) {
        this.isCapsLock = true;
        this.toUpperKey('.letter');
      } else if (!this.isCapsLock && this.isShift) {
        this.isCapsLock = true;
        this.toLowerKey('.sub-letter');
        this.toUpperKey('.letter');
      } else if (this.isCapsLock && this.isShift) {
        this.isCapsLock = false;
        this.toUpperKey('.sub-letter');
      } else {
        this.isCapsLock = false;
        this.toLowerKey('.letter');
      }
    }

    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      this.isShift = true;
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
      if (this.isCapsLock) {
        this.toUpperKey('.sub-letter');
      }
      if (!this.isCapsLock) this.toLowerKey('.letter');
      this.isShift = false;
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

  Output = (element) => {
    this.OutputArea = document.getElementById('output');
    const Text = element.querySelector('[data-display="true"]').innerText;
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
      case '':
        OutputStr = `${LeftText} ${RightText}`;
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
        this.isSpecialKey = Boolean(Text.match(/CapsLock|Shift|Ctrl|LNG|Alt/));
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

  InitLanguage = (lang) => {
    const LetterArr = [
      ['Backquote', '`', '~', 'ё', 'Ё'],
      ['Digit1', '1', '!', '1', '!'],
      ['Digit2', '2', '@', '2', '"'],
      ['Digit3', '3', '#', '3', '№'],
      ['Digit4', '4', '$', '4', ';'],
      ['Digit5', '5', '%', '5', '%'],
      ['Digit6', '6', '^', '6', ':'],
      ['Digit7', '7', '&', '7', '?'],
      ['Digit8', '8', '*', '8', '*'],
      ['Digit9', '9', '(', '9', '('],
      ['Digit0', '0', ')', '0', ')'],
      ['Minus', '-', '_', '-', '_'],
      ['Equal', '=', '+', '=', '+'],
      ['Backspace', 'Backspace', 'Backspace', 'Backspace', 'Backspace'],
      ['Delete', 'Delete', 'Delete', 'Delete', 'Delete'],
      ['Tab', 'Tab', 'Tab', 'Tab', 'Tab'],
      ['KeyQ', 'q', 'Q', 'й', 'Й'],
      ['KeyW', 'w', 'W', 'ц', 'Ц'],
      ['KeyE', 'e', 'E', 'у', 'У'],
      ['KeyR', 'r', 'R', 'к', 'К'],
      ['KeyT', 't', 'T', 'е', 'Е'],
      ['KeyY', 'y', 'Y', 'н', 'Н'],
      ['KeyU', 'u', 'U', 'г', 'Г'],
      ['KeyI', 'i', 'I', 'ш', 'Ш'],
      ['KeyO', 'o', 'O', 'щ', 'Щ'],
      ['KeyP', 'p', 'P', 'з', 'З'],
      ['BracketLeft', '[', '{', 'х', 'Х'],
      ['BracketRight', ']', '}', 'ъ', 'Ъ'],
      ['Enter', 'Enter', 'Enter', 'Enter', 'Enter'],
      ['CapsLock', 'CapsLock', 'CapsLock', 'CapsLock', 'CapsLock'],
      ['KeyA', 'a', 'A', 'ф', 'Ф'],
      ['KeyS', 's', 'S', 'ы', 'Ы'],
      ['KeyD', 'd', 'D', 'в', 'В'],
      ['KeyF', 'f', 'F', 'а', 'А'],
      ['KeyG', 'g', 'G', 'п', 'П'],
      ['KeyH', 'h', 'H', 'р', 'Р'],
      ['KeyJ', 'j', 'J', 'о', 'О'],
      ['KeyK', 'k', 'K', 'л', 'Л'],
      ['KeyL', 'l', 'L', 'д', 'Д'],
      ['Semicolon', ';', ':', 'ж', 'Ж'],
      ['Quote', "'", '"', 'э', 'Э'],
      ['Backslash', '\\', '|', '\\', '/'],
      ['ShiftLeft', 'Shift', 'Shift', 'Shift', 'Shift'],
      ['IntlBackslash', '<', '>', '/', '|'],
      ['KeyZ', 'z', 'Z', 'я', 'Я'],
      ['KeyX', 'x', 'X', 'ч', 'Ч'],
      ['KeyC', 'c', 'C', 'с', 'С'],
      ['KeyV', 'v', 'V', 'м', 'М'],
      ['KeyB', 'b', 'B', 'и', 'И'],
      ['KeyN', 'n', 'N', 'т', 'Т'],
      ['KeyM', 'm', 'M', 'ь', 'Ь'],
      ['Comma', ',', '<', 'б', 'Б'],
      ['Period', '.', '>', 'ю', 'Ю'],
      ['Slash', '/', '?', '.', ','],
      ['ShiftRight', 'Shift', 'Shift', 'Shift', 'Shift'],
      ['ControlLeft', 'Ctrl', 'Ctrl', 'Ctrl', 'Ctrl'],
      ['AltLeft', 'Alt', 'Alt', 'Alt', 'Alt'],
      ['Space', ' ', ' ', ' ', ' '],
      ['AltRight', 'Alt', 'Alt', 'Alt', 'Alt'],
      ['ControlRight', 'Ctrl', 'Ctrl', 'Ctrl', 'Ctrl'],
      ['ArrowLeft', '&larr;', '&larr;', '&larr;', '&larr;'],
      ['ArrowUp', '&uarr;', '&uarr;', '&uarr;', '&uarr;'],
      ['ArrowDown', '&darr;', '&darr;', '&darr;', '&darr;'],
      ['ArrowRight', '&rarr;', '&rarr;', '&rarr;', '&rarr;'],
      ['LNG', '<div class="icon">LNG</div>', '<div class="icon">LNG</div>', '<div class="icon">LNG</div>', '<div class="icon">LNG</div>'],
    ];

    const en = LetterArr.map((el) => {
      const tmp = Object({ code: el[0], Letter: el[1], LetterShift: el[2] });
      return tmp;
    });

    const ru = LetterArr.map((el) => {
      const tmp = Object({ code: el[0], Letter: el[3], LetterShift: el[4] });
      return tmp;
    });

    this.LanguageSet = { en, ru };
    return this.LanguageSet[lang];
  };

  Main(language) {
    this.Keys = this.InitLanguage(language);

    this.container = document.createElement('div');
    this.container.className = 'container';
    document.body.append(this.container);

    this.helper = document.createElement('div');
    this.helper.className = 'helper';
    this.helper.innerHTML = '<h1>VIRTUAL KEYBOARD</h1><p>Created in the Linux OS. Use <kbd>Ctrl</kbd> + <kbd>Alt</kbd> to switch language.</p>';

    this.output = document.createElement('div');
    this.output.className = 'output';
    this.output.innerHTML = '<textarea id="output" autofocus spellcheck="false"></textarea>';

    this.keyboard = document.createElement('div');
    this.keyboard.className = 'keyboard';
    this.keyboard.dataset.language = language;
    this.container.append(this.helper, this.output, this.keyboard);
    return this;
  }

  ChangeLanguage() {
    const currentLanguage = this.keyboard.dataset.language;
    const LangArr = Object.keys(this.LanguageSet);
    let Indx = LangArr.indexOf(currentLanguage);
    if (Indx === 0) {
      this.Keys = this.LanguageSet[LangArr[(Indx += 1)]];
    } else {
      this.Keys = this.LanguageSet[LangArr[(Indx -= 1)]];
    }
    this.keyboard.dataset.language = LangArr[Indx];
    this.StorageSet('Advisor-KbrdLang', LangArr[Indx]);

    const Buttons = this.keyboard.querySelectorAll('.key');
    Buttons.forEach((button) => {
      if (button.dataset.special !== 'true') {
        const keyObj = this.Keys.find((obj) => obj.code === button.dataset.key);
        const SubLetter = button.querySelector('.sub-letter');
        const Letter = button.querySelector('.letter');
        SubLetter.innerHTML = keyObj.LetterShift;
        Letter.innerHTML = keyObj.Letter;
      }
      if (this.isCapsLock && !this.isShift) {
        this.toUpperKey('.letter');
      } else if (this.isCapsLock && this.isShift) {
        this.toLowerKey('.sub-letter');
        this.toUpperKey('.letter');
      }
    });
  }
}

let language = new Keyboard().StorageGet('Advisor-KbrdLang');
if (language === null) {
  language = 'en';
  new Keyboard().StorageSet('Advisor-KbrdLang', 'en');
}
const KeyboardRows = [
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
  ['ControlLeft', 'AltLeft', 'LNG', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'],
];
new Keyboard(KeyboardRows).Main(language).GenerateKeyboard();
