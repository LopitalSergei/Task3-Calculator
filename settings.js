let themeStyle = localStorage.getItem("themeStyle");

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
