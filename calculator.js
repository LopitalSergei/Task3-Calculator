import {
  historyContainer,
  STORAGE_NAME,
  historyElementsInLocalStorage,
} from "./constants.js";

export class Calculator {
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
