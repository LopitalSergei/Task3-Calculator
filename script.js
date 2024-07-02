let themeStyle = localStorage.getItem("themeStyle");

const STORAGE_NAME = "historyStorage";
const historyElementsInLocalStorage = JSON.parse(
  localStorage.getItem(STORAGE_NAME)
);

const calculatorEl = document.querySelector(".calculator");
const input = calculatorEl.querySelector("#userInput");
const display = calculatorEl.querySelector("#display");
const allClearBtn = calculatorEl.querySelector("[data-clear]");
const backspaceBtn = calculatorEl.querySelector("[data-backspace]");
const decimalBtn = calculatorEl.querySelector("[data-decimal]");
const equalBtn = calculatorEl.querySelector("[data-equal]");
const operationBtns = calculatorEl.querySelectorAll("[data-operator]");
const numberBtns = calculatorEl.querySelectorAll("[data-number]");

const historyContainer = document.querySelector(".history-container");

class Calculator {
  constructor(input, display) {
    this.input = input;
    this.display = display;
    this.inputQueue = [];
    this.inputDecimal = false;
  }

  clearDisplay() {
    this.inputQueue = [];
    this.input.value = "";
    this.inputDecimal = false;
  }

  backspace() {
    if (
      this.inputQueue.length !== 0 &&
      this.inputQueue[this.inputQueue.length - 1].type === "decimal"
    ) {
      this.inputDecimal = false;
    }
    this.input.value = this.input.value.slice(0, input.value.length - 1);
    this.inputQueue.pop();
  }

  insertNumber(value) {
    if (
      this.inputQueue.length === 1 &&
      this.inputQueue[this.inputQueue.length - 1].type === "operator"
    ) {
      this.inputQueue[this.inputQueue.length - 1] = {
        value: value,
        type: "number",
      };
      this.input.value =
        this.input.value.slice(0, input.value.length - 1) + value;
    } else {
      this.inputQueue.push({ value: value, type: "number" });
      this.input.value += value;
    }
  }

  insertOperator(operator) {
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
        this.input.value.slice(0, input.value.length - 1) + operator;
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
    if (this.inputQueue.length === 0) {
      return 0;
    }
    if (this.getLastInput().type === "number") {
      let firstOperand;
      let operation;
      let secondOperand;
      let firstOperation = true;
      let operationIndex;
      let result;
      for (let i = 0; i < this.inputQueue.length; i++) {
        const element = this.inputQueue[i];
        if (element.type === "operator" && firstOperation) {
          firstOperation = false;
          firstOperand = this.inputQueue.slice(0, i);
          operation = element.value;
          operationIndex = i;
        } else if (
          element.type === "operator" ||
          i === this.inputQueue.length - 1
        ) {
          if (i === this.inputQueue.length - 1) {
            secondOperand = this.inputQueue.slice(operationIndex + 1, i + 1);
          } else {
            secondOperand = this.inputQueue.slice(operationIndex + 1, i);
            operationIndex = i;
          }
          result = this.performOperation(
            this.operandToNumber(firstOperand),
            operation,
            this.operandToNumber(secondOperand)
          );

          operation = element.value;

          firstOperand = [{ value: result, type: "number" }];
        }
      }
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
    } else {
      this.display.value = NaN;
    }
  }

  operandToNumber(operand) {
    try {
      return operand.map((number) => number.value).join("");
    } catch (error) {
      console.log(error);
    }
  }

  performOperation(firstOperand, operation, secondOperand) {
    firstOperand = parseFloat(firstOperand);
    secondOperand = parseFloat(secondOperand);

    if (Number.isNaN(firstOperand) || Number.isNaN(secondOperand)) {
      return;
    }
    switch (operation) {
      case "×":
        return firstOperand * secondOperand;
        break;
      case "÷":
        return firstOperand / secondOperand;
        break;
      case "-":
        return (firstOperand * 100 - secondOperand * 100) / 100;
        break;
      case "+":
        return (firstOperand * 100 + secondOperand * 100) / 100;
        break;
      default:
        return;
    }
  }

  getLastInput() {
    return this.inputQueue[this.inputQueue.length - 1];
  }
}

function getHistoryItem(value, result) {
  calculator.input.value = value;
  calculator.display.value = result;
  calculator.inputQueue = [];

  for (let i = 0; i < value.length; i++) {
    const symbol = value.charAt(i);
    if (/^\d+$/.test(symbol)) {
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
