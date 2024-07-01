let themeStyle = localStorage.getItem("themeStyle");
const STORAGE_NAME = "historyStorage";

const clearAllStory = document.querySelector("#clear-history");
const themeSelect = document.querySelector("#theme-select");
themeSelect.onchange = onChangeTheme;

function onChangeTheme() {
  const value = themeSelect.value;
  const text = themeSelect.options[themeSelect.selectedIndex].text;

  if (value === "dark") {
    enableDarkTheme();
    themeSelect.value = value;
  } else if (value === "light") {
    enableLightTheme();
    themeSelect.value = value;
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

if (themeStyle === "dark") {
  enableDarkTheme();
  themeSelect.value = themeStyle;
}

clearAllStory.addEventListener("click", () => {
  localStorage.setItem(STORAGE_NAME, JSON.stringify([]));
  alert("История очищена!");
});
