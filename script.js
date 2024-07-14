import { Calculator } from "./calculator.js";

import {
  themeStyle,
  STORAGE_NAME,
  historyElementsInLocalStorage,
  input,
  display,
  allClearBtn,
  backspaceBtn,
  decimalBtn,
  equalBtn,
  operationBtns,
  numberBtns,
  historyContainer,
  checkingForANumber,
} from "./constants.js";

function getHistoryItem(value, result) {
  calculator.input.value = value;
  calculator.display.value = result;
  calculator.inputQueue = [];

  for (let i = 0; i < value.length; i++) {
    const symbol = value.charAt(i);
    if (checkingForANumber.test(symbol)) {
      calculator.inputQueue.push({ value: symbol, type: "number" });
    } else if (symbol === ".") {
      calculator.inputQueue.push({ value: symbol, type: "decimal" });
    } else {
      calculator.inputQueue.push({ value: symbol, type: "operator" });
    }
  }
}

function enableLightTheme() {
  document.body.classList.remove("dark-theme");
  localStorage.setItem("themeStyle", "light");
}

function enableDarkTheme() {
  document.body.classList.add("dark-theme");
  localStorage.setItem("themeStyle", "dark");
}

// APP

if (themeStyle === "dark") {
  enableDarkTheme();
}

if (historyElementsInLocalStorage) {
  for (let i = 0; i < historyElementsInLocalStorage.length; i++) {
    const element = historyElementsInLocalStorage[i];
    historyContainer.innerHTML =
      `<div onclick="getHistoryItem('${element.value}', '${element.result}')" class ="history-item">${element.value} / ${element.result}</div>` +
      historyContainer.innerHTML;
  }
} else {
  localStorage.setItem(STORAGE_NAME, JSON.stringify([]));
}

const calculator = new Calculator(input, display);

allClearBtn.addEventListener("click", () => {
  calculator.clearDisplay();
});

backspaceBtn.addEventListener("click", () => {
  calculator.backspace();
});

decimalBtn.addEventListener("click", () => {
  calculator.insertDecimal();
});

equalBtn.addEventListener("click", () => {
  calculator.calcResult();
});

operationBtns.forEach((operator) => {
  operator.addEventListener("click", () => {
    calculator.insertOperator(operator.getAttribute("data-operator"));
  });
});

numberBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    calculator.insertNumber(btn.getAttribute("data-number"));
  });
});
