// 1. Ввести число
// 1.1 Нажать необходимое количество цифр
// 2. Выбрать операцию
// 3. Ввести число
// 4. При необходимости пункт 2 и 3
// 5. Выбрать операцию "равно"

// Убрать проблему с дробными числами res:  14.219999999999999

const calculatorEl = document.querySelector(".calculator");
const input = calculatorEl.querySelector("#userInput");
const display = calculatorEl.querySelector("#display");
// const keys = calculatorEl.querySelectorAll(".btn");

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
    //  console.log(this.inputQueue);
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
    //  console.log(this.inputQueue);
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
    //  console.log(this.inputQueue);
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
    //  console.log(this.inputQueue);
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
      // Нужно найти операцию
      // После нужно найти левое и правое число
      // Вызвать performOperation()

      let firstOperand;
      let operation;
      let secondOperand;
      let firstOperation = true;
      let operationIndex;
      let result;
      for (let i = 0; i < this.inputQueue.length; i++) {
        //   console.log("firstOperand ", firstOperand);
        //   console.log("operation ", operation);
        //   console.log("secondOperand ", secondOperand);
        //   console.log("firstOperation ", firstOperation);
        //   console.log("operationIndex ", operationIndex);
        const element = this.inputQueue[i];
        //   console.log("element ", element);
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

          //  firstOperation = true;
          operation = element.value;

          firstOperand = [{ value: result, type: "number" }];
          console.log("res: ", result);
        }
        console.log("------------------------");
      }
      historyContainer.innerHTML += `<div onclick="getHistoryItem(${this.input.value})" class ="history-item">${this.input.value} / ${result}</div>`;
      this.display.value = result;
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
    console.log("**********************");
    console.log("first ", firstOperand);
    console.log("second ", secondOperand);
    firstOperand = parseFloat(firstOperand);
    secondOperand = parseFloat(secondOperand);

    if (Number.isNaN(firstOperand) || Number.isNaN(secondOperand)) {
      return;
    }

    console.log("oper", operation);
    console.log("********************");
    switch (operation) {
      case "×":
        return firstOperand * secondOperand;
        break;
      case "÷":
        return firstOperand / secondOperand;
        break;
      case "-":
        return firstOperand - secondOperand;
        break;
      case "+":
        return firstOperand + secondOperand;
        break;
      default:
        return;
    }
  }

  getLastInput() {
    return this.inputQueue[this.inputQueue.length - 1];
  }

  //   updateInput() {
  //     this.input.value = this.getInputValues().join(" ");
  //   }

  //   getInputValues() {
  //     return this.inputQueue.map((element) => {
  //       element.value;
  //     });
  //   }

  //   updateDisplay(value) {
  //     this.display.value = value;
  //   }
}

function getHistoryItem(value) {
  console.log("click", value);
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

// for (const key of keys) {
//   const value = key.textContent;
//   const id = key.id;

//   key.addEventListener("click", () => {
//     if (id == "btn-equal") {
//     } else if (id === "btn-delete") {
//       input.value = input.value.slice(0, input.value.length - 1);
//     } else if (id === "btn-clear") {
//       input.value = "";
//     } else {
//       input.value += value;
//     }
//   });
// }
