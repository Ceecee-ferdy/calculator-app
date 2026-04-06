
let calculation = localStorage.getItem('calculation') || '';

let justCalculated = false;

showDisplay();

// NUMBER BUTTONS
document.querySelectorAll('.js-number-button')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.innerText;

      if (justCalculated) {
        calculation = value;
        justCalculated = false;
      } else {
        calculation += value;
      }
      showDisplay();
      saveCalculation();
    });
  });

// DELETE
document.querySelector('.js-delete-button')
  .addEventListener('click', () => {
    calculation = calculation.slice(0, -1);
    showDisplay();
    saveCalculation();
  });

// CLEAR
document.querySelector('.js-clear-all')
  .addEventListener('click', () => {
    calculation = '';
    justCalculated = false;
    showDisplay();
    saveCalculation();
  });

// OPERATORS
document.querySelectorAll('.js-operator-button')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.innerText;

      calculation = calculation.replace(/,/g, '').trim();
      let lastChar = calculation.slice(-1);

      if (['+', '-', '*', '/'].includes(lastChar)) {
        calculation = calculation.slice(0, -1) + value;
      } else {
        calculation += ' ' + value;
      }

      calculation += ' ';
      justCalculated = false;

      showDisplay();
      saveCalculation();
    });
  });

// DECIMAL
document.querySelector('.js-decimal-button')
  .addEventListener('click', () => {
    let parts = calculation.split(' ');
    let lastPart = parts[parts.length - 1];

    if (!lastPart.includes('.')) {
      calculation += '.';
    }

    showDisplay();
    saveCalculation();
  });

// EQUALS
document.querySelector('.js-equal-button')
  .addEventListener('click', () => {
    try {
      let clean = calculation.replace(/,/g, '');
      let parts = clean.split(' ');

      // FIRST PASS (* and /)
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] === '*' || parts[i] === '/') {
          let num1 = Number(parts[i - 1]);
          let num2 = Number(parts[i + 1]);

          let result = parts[i] === '*' ? num1 * num2 : num1 / num2;

          parts.splice(i - 1, 3, result.toString());
          i--;
        }
      }

      // SECOND PASS (+ and -)
      let result = Number(parts[0]);

      for (let i = 1; i < parts.length; i += 2) {
        let operator = parts[i];
        let number = Number(parts[i + 1]);

        if (operator === '+') result += number;
        if (operator === '-') result -= number;
      }

      calculation = result.toString();
      justCalculated = true;

    } catch {
      calculation = 'Error';
    }

    showDisplay();
    saveCalculation();
  });

// PERCENT
document.querySelector('.js-percent-button')
  .addEventListener('click', () => {
    try {
      let clean = calculation.replace(/,/g, '');
      let result = Number(clean) / 100;

      calculation = result.toString();
      justCalculated = true;

    } catch {
      calculation = 'Error';
    }

    showDisplay();
    saveCalculation();
  });

// KEYBOARD SUPPORT
document.addEventListener('keydown', (event) => {
  event.preventDefault();
  const key = event.key;

  if (key >= '0' && key <= '9') {
    if (justCalculated) {
      calculation = key;
      justCalculated = false;
    } else {
      calculation += key;
}
     }

  else if (['+', '-', '*', '/'].includes(key)) {
    calculation = calculation.replace(/,/g, '').trim();

    let lastChar = calculation.slice(-1);

    if (['+', '-', '*', '/'].includes(lastChar)) {
      calculation = calculation.slice(0, -1) + key;
    } else {
      calculation += ' ' + key;
    }

    calculation += ' ';
    justCalculated = false;
  }

  else if (key === '.') {
    let parts = calculation.split(' ');
    let lastPart = parts[parts.length - 1];

    if (!lastPart.includes('.')) {
      calculation += '.';
    }
  }

  else if (key === 'Backspace') {
    calculation = calculation.slice(0, -1);
  }

  else if (key === 'Enter' || key === '=') {
    document.querySelector('.js-equal-button').click();
    return;
  }

  showDisplay();
  saveCalculation();
});

// SAVE
function saveCalculation() {
  localStorage.setItem('calculation', calculation);
}

// DISPLAY
/*
function showDisplay() {
  let display = calculation;
  let clean = display.replace(/,/g, '');

  if (!isNaN(clean) && clean !== '') {
    let num = Number(clean);

    if (clean.length > 10) {
      display = num.toPrecision(8);
    } else {
      display = num.toLocaleString();
    }
  }

  document.querySelector('.js-display-values')
    .innerHTML = display || 0;
} */
 function showDisplay() {
  let display = '';

  // 🔥 STEP 1: split numbers and operators
  let currentNumber = '';

  for (let i = 0; i < calculation.length; i++) {
    let char = calculation[i];

    if ('0123456789.'.includes(char)) {
      currentNumber += char;
    } else {
      // format number before adding operator
      if (currentNumber !== '') {
        display += formatNumber(currentNumber);
        currentNumber = '';
      }

      display += ' ' + char + ' ';
    }
  }

  // last number
  if (currentNumber !== '') {
    display += formatNumber(currentNumber);
  }

  // 🔥 STEP 2: ONLY after "=" (your original logic)
  if (justCalculated) {
    let clean = calculation.replace(/,/g, '');

    if (!isNaN(clean) && clean !== '') {
      let num = Number(clean);

      if (Math.abs(num) >= 1e12) {
        display = num.toExponential(2);
      } else {
        display = num.toLocaleString();
      }
    }
  }

  document.querySelector('.js-display-values')
    .innerHTML = display || 0;
}

function formatNumber(numStr) {
  let [integer, decimal] = numStr.split('.');

  integer = Number(integer).toLocaleString();

  return decimal ? `${integer}.${decimal}` : integer;
}