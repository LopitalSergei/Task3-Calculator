// import { Calculator } from "./calculator.js";

// import {
//   themeStyle,
//   STORAGE_NAME,
//   historyElementsInLocalStorage,
//   input,
//   display,
//   allClearBtn,
//   signSwitchBtn,
//   backspaceBtn,
//   decimalBtn,
//   equalBtn,
//   operationBtns,
//   numberBtns,
//   historyContainer,
//   checkingForANumber,
// } from "./constants.js";

const themeStyle = localStorage.getItem("themeStyle");

const STORAGE_NAME = "historyStorage";
const historyElementsInLocalStorage = JSON.parse(
  localStorage.getItem(STORAGE_NAME)
);

const calculatorEl = document.querySelector(".calculator");
const input = calculatorEl.querySelector("#userInput");
const display = calculatorEl.querySelector("#display");
const allClearBtn = calculatorEl.querySelector("[data-clear]");
const backspaceBtn = calculatorEl.querySelector("[data-backspace]");
const signSwitchBtn = calculatorEl.querySelector("[data-change]");
const decimalBtn = calculatorEl.querySelector("[data-decimal]");
const equalBtn = calculatorEl.querySelector("[data-equal]");
const operationBtns = calculatorEl.querySelectorAll("[data-operator]");
const numberBtns = calculatorEl.querySelectorAll("[data-number]");

const historyContainer = document.querySelector(".history-container");

const checkingForANumber = /^\d+$/;

class Calculator {
  constructor(input, display) {
    this.input = input;
    this.display = display;
    this.inputQueue = [];
    this.inputDecimal = false;
    this.equalsFlag = false;
    this.operatorFlag = false;
  }

  clearDisplay() {
    this.inputQueue = [];
    this.input.value = "";
    this.inputDecimal = false;
    this.display.value = "";
    this.equalsFlag = false;
    this.operatorFlag = false;
  }

  backspace() {
    if (
      this.inputQueue.length !== 0 &&
      this.inputQueue[this.inputQueue.length - 1].type === "decimal"
    ) {
      this.inputDecimal = false;
    }
    this.input.value = this.input.value.slice(0, this.input.value.length - 1);
    this.inputQueue.pop();
  }

  switchSign() {
    if (!this.operatorFlag && this.inputQueue[0].type === "number") {
      this.inputQueue.unshift({ value: "-", type: "operator" });
      this.input.value = "-" + this.input.value;
    } else if (!this.operatorFlag && this.inputQueue[0].type === "operator") {
      this.inputQueue.shift();
      this.input.value = this.input.value.slice(1);
    }
  }

  insertNumber(value) {
    if (this.equalsFlag) {
      console.log("flag");
      this.inputQueue = [];
      this.input.value = "";
      this.equalsFlag = false;
    }
    if (
      this.inputQueue.length === 1 &&
      this.inputQueue[this.inputQueue.length - 1].type === "operator"
    ) {
      this.inputQueue[this.inputQueue.length - 1] = {
        value: value,
        type: "number",
      };
      this.input.value =
        this.input.value.slice(0, this.input.value.length - 1) + value;
    } else {
      this.inputQueue.push({ value: value, type: "number" });
      this.input.value += value;
      console.log(this.inputQueue);
    }
  }

  insertOperator(operator) {
    this.operatorFlag = true;
    this.equalsFlag = false;
    console.log(this.inputQueue);
    this.inputDecimal = false;
    if (this.inputQueue.length === 0) {
      this.inputQueue.push({ value: operator, type: "operator" });
      this.input.value += operator;
    } else if (
      this.inputQueue[this.inputQueue.length - 1].type === "operator"
    ) {
      this.inputQueue[this.inputQueue.length - 1] = {
        value: operator,
        type: "operator",
      };
      this.input.value =
        this.input.value.slice(0, this.input.value.length - 1) + operator;
    } else {
      this.inputQueue.push({ value: operator, type: "operator" });

      this.input.value += operator;
    }
  }

  insertDecimal() {
    if (!this.inputDecimal) {
      this.inputQueue.push({ value: ".", type: "decimal" });
      this.input.value += ".";
      this.inputDecimal = true;
    }
  }

  calcResult() {
    console.log(this.inputQueue);
    if (this.inputQueue.length === 0) {
      return 0;
    }
    if (this.getLastInput().type === "number") {
      const result =
        parseInt(this.calculate(this.tokenize(this.input.value)) * 1000) / 1000;

      const historyElements =
        `<div onclick="getHistoryItem('${this.input.value}', '${result}')" class ="history-item">${this.input.value} / ${result}</div>` +
        historyContainer.innerHTML;
      historyContainer.innerHTML = historyElements;
      this.display.value = result;
      historyElementsInLocalStorage.push({
        value: this.input.value,
        result: result,
      });
      localStorage.setItem(
        STORAGE_NAME,
        JSON.stringify(historyElementsInLocalStorage)
      );
      this.input.value = result;
      this.inputQueue = [{ value: `${result}`, type: "number" }];
      this.equalsFlag = true;
      this.inputDecimal = false;
      this.operatorFlag = false;
    } else {
      this.display.value = NaN;
    }
  }

  getLastInput() {
    return this.inputQueue[this.inputQueue.length - 1];
  }

  tokenize(str) {
    const operationQueue = [];
    let token = "";
    for (const character of str) {
      if ("×÷+-".includes(character)) {
        if (token === "" && character === "-") {
          token = "-";
        } else {
          operationQueue.push(parseFloat(token), character);
          token = "";
        }
      } else {
        token += character;
      }
    }
    if (token !== "") {
      operationQueue.push(parseFloat(token));
    }
    return operationQueue;
  }

  calculate(tokens) {
    const operatorPrecedence = [
      {
        "×": (a, b) => (a * 100 * b * 100) / 10000,
        "÷": (a, b) => (((a * 100) / b) * 100) / 10000,
      },
      {
        "+": (a, b) => (a * 100 + b * 100) / 100,
        "-": (a, b) => (a * 100 - b * 100) / 100,
      },
    ];
    let operator;
    for (const operators of operatorPrecedence) {
      const newTokens = [];
      for (const token of tokens) {
        if (token in operators) {
          operator = operators[token];
        } else if (operator) {
          newTokens[newTokens.length - 1] = operator(
            newTokens[newTokens.length - 1],
            token
          );
          operator = null;
        } else {
          newTokens.push(token);
        }
      }
      tokens = newTokens;
    }
    if (tokens.length > 1) {
      return tokens;
    } else {
      return tokens[0];
    }
  }
}

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

signSwitchBtn.addEventListener("click", () => {
  calculator.switchSign();
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
