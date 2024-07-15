export const themeStyle = localStorage.getItem("themeStyle");

export const STORAGE_NAME = "historyStorage";
export const historyElementsInLocalStorage = JSON.parse(
  localStorage.getItem(STORAGE_NAME)
);

export const calculatorEl = document.querySelector(".calculator");
export const input = calculatorEl.querySelector("#userInput");
export const display = calculatorEl.querySelector("#display");
export const allClearBtn = calculatorEl.querySelector("[data-clear]");
export const backspaceBtn = calculatorEl.querySelector("[data-backspace]");
export const signSwitchBtn = calculatorEl.querySelector("[data-change]");
export const decimalBtn = calculatorEl.querySelector("[data-decimal]");
export const equalBtn = calculatorEl.querySelector("[data-equal]");
export const operationBtns = calculatorEl.querySelectorAll("[data-operator]");
export const numberBtns = calculatorEl.querySelectorAll("[data-number]");

export const historyContainer = document.querySelector(".history-container");

export const checkingForANumber = /^\d+$/;
