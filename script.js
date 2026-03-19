// =============================================
// 1. DOM ELEMENTY
// =============================================

const conversionStatus = document.getElementById("conversionStatus");

const categorySelect = document.getElementById("categorySelect");
const fromUnitSelect = document.getElementById("fromUnitSelect");
const toUnitSelect = document.getElementById("toUnitSelect");
const valueInput = document.getElementById("valueInput");

const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");

const resultValue = document.getElementById("resultValue");
const resultDetail = document.getElementById("resultDetail");

// =============================================
// 2. DÁTA PRE JEDNOTKY
// =============================================

const unitOptions = {
  length: ["meter", "kilometer", "centimeter"],
  weight: ["gram", "kilogram", "pound"],
  temperature: ["celsius", "fahrenheit", "kelvin"],
};

// =============================================
// 3. FUNKCIA NA VYPLNENIE SELECTOV
// =============================================

function populateUnitSelects() {
  const selectedCategory = categorySelect.value;
  const units = unitOptions[selectedCategory];

  fromUnitSelect.innerHTML = "";
  toUnitSelect.innerHTML = "";

  units.forEach(function (unit) {
    const fromOption = document.createElement("option");
    fromOption.value = unit;
    fromOption.textContent = unit;

    const toOption = document.createElement("option");
    toOption.value = unit;
    toOption.textContent = unit;

    fromUnitSelect.appendChild(fromOption);
    toUnitSelect.appendChild(toOption);
  });

  fromUnitSelect.selectedIndex = 0;

  if (units.length > 1) {
    toUnitSelect.selectedIndex = 1;
  } else {
    toUnitSelect.selectedIndex = 0;
  }
}

// =============================================
// 4. KONVERZNÉ FUNKCIE
// =============================================

function convertLength(value, fromUnit, toUnit) {
  let valueInMeters;

  // 1. Najprv všetko prevedieme na metre
  if (fromUnit === "meter") {
    valueInMeters = value;
  } else if (fromUnit === "kilometer") {
    valueInMeters = value * 1000;
  } else if (fromUnit === "centimeter") {
    valueInMeters = value / 100;
  }

  // 2. Z metrov prevedieme na cieľovú jednotku
  if (toUnit === "meter") {
    return valueInMeters;
  } else if (toUnit === "kilometer") {
    return valueInMeters / 1000;
  } else if (toUnit === "centimeter") {
    return valueInMeters * 100;
  }
}

function convertWeight(value, fromUnit, toUnit) {
  let valueInGrams;

  // 1. Najprv všetko prevedieme na gramy
  if (fromUnit === "gram") {
    valueInGrams = value;
  } else if (fromUnit === "kilogram") {
    valueInGrams = value * 1000;
  } else if (fromUnit === "pound") {
    valueInGrams = value * 453.592;
  }

  // 2. Z gramov prevedieme na cieľovú jednotku
  if (toUnit === "gram") {
    return valueInGrams;
  } else if (toUnit === "kilogram") {
    return valueInGrams / 1000;
  } else if (toUnit === "pound") {
    return valueInGrams / 453.592;
  }
}

function convertTemperature(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) {
    return value;
  }

  // Celsius -> Fahrenheit / Kelvin
  if (fromUnit === "celsius" && toUnit === "fahrenheit") {
    return (value * 9) / 5 + 32;
  } else if (fromUnit === "celsius" && toUnit === "kelvin") {
    return value + 273.15;
  }

  // Fahrenheit -> Celsius / Kelvin
  else if (fromUnit === "fahrenheit" && toUnit === "celsius") {
    return ((value - 32) * 5) / 9;
  } else if (fromUnit === "fahrenheit" && toUnit === "kelvin") {
    return ((value - 32) * 5) / 9 + 273.15;
  }

  // Kelvin -> Celsius / Fahrenheit
  else if (fromUnit === "kelvin" && toUnit === "celsius") {
    return value - 273.15;
  } else if (fromUnit === "kelvin" && toUnit === "fahrenheit") {
    return ((value - 273.15) * 9) / 5 + 32;
  }
}

// =============================================
// 5. HLAVNÁ FUNKCIA convertUnits()
// =============================================

function convertUnits() {
  if (!validateInput()) {
    return;
  }

  const value = Number(valueInput.value.trim());
  const selectedCategory = categorySelect.value;
  const fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;

  let convertedValue;

  // Ak sú jednotky rovnaké, výsledok ostáva rovnaký
  if (fromUnit === toUnit) {
    convertedValue = value;
  } else if (selectedCategory === "length") {
    convertedValue = convertLength(value, fromUnit, toUnit);
  } else if (selectedCategory === "weight") {
    convertedValue = convertWeight(value, fromUnit, toUnit);
  } else if (selectedCategory === "temperature") {
    convertedValue = convertTemperature(value, fromUnit, toUnit);
  }

  // Poistka, keby konverzia zlyhala
  if (convertedValue === undefined) {
    resultValue.textContent = "--";
    resultDetail.textContent = "Conversion could not be completed.";
    conversionStatus.textContent = "Conversion error";
    return;
  }

  // Zaokrúhlenie výsledku
  const formattedResult = convertedValue.toFixed(2);

  // Výpis výsledku do UI
  resultValue.textContent = formattedResult;
  resultDetail.textContent = `${value} ${fromUnit} = ${formattedResult} ${toUnit}`;
  conversionStatus.textContent = "Converted successfully";
}

// =============================================
// 6. VALIDÁCIA INPUTU
// =============================================

function validateInput() {
  const inputValue = valueInput.value.trim();

  if (inputValue === "") {
    resultValue.textContent = "--";
    resultDetail.textContent = "Enter a value to convert.";
    conversionStatus.textContent = "Waiting for input";
    return false;
  }

  const numericValue = Number(inputValue);

  if (isNaN(numericValue)) {
    resultValue.textContent = "--";
    resultDetail.textContent = "Invalid input. Numbers only.";
    conversionStatus.textContent = "Invalid input";
    return false;
  }

  return true;
}

// =============================================
// 7. SWAP BUTTON
// =============================================

function swapUnit() {
  const temp = fromUnitSelect.value;
  fromUnitSelect.value = toUnitSelect.value;
  toUnitSelect.value = temp;

  if (valueInput.value.trim() !== "") {
    convertUnits();
  } else {
    conversionStatus.textContent = "Units swapped";
  }
}

// =============================================
// 8. CLEAR BUTTON
// =============================================

function ClearAll() {
  valueInput.value = "";

  resultValue.textContent = "--";
  resultDetail.textContent =
    "Vyber typ prevodu, zadaj hodnotu a klikni na Convert.";
  conversionStatus.textContent = "Cleared";

  valueInput.focus();
}

// =============================================
// 9. COPY BUTTON
// =============================================

function copyResult() {
  const valueToCopy = resultValue.textContent;

  if (valueToCopy === "--") {
    conversionStatus.textContent = "Nothing to copy";
    return;
  }

  navigator.clipboard.writeText(valueToCopy);

  copyBtn.textContent = "Copied!";
  conversionStatus.textContent = "Result copied";

  setTimeout(function () {
    copyBtn.textContent = "Copy";
  }, 2000);
}

// =============================================
// 10. EVENT LISTENERS
// =============================================

categorySelect.addEventListener("change", handleCategoryChange);

convertBtn.addEventListener("click", function () {
  convertUnits();
});

swapBtn.addEventListener("click", function () {
  swapUnit();
});

clearBtn.addEventListener("click", function () {
  ClearAll();
});

copyBtn.addEventListener("click", function () {
  copyResult();
});

valueInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    convertUnits();
  }
});

// =============================================
// 11. ZMENA KATEGÓRIE
// =============================================

function handleCategoryChange() {
  const selectedCategory = categorySelect.value;

  populateUnitSelects();

  resultValue.textContent = "--";
  resultDetail.textContent =
    "Vyber typ prevodu, zadaj hodnotu a klikni na Convert.";

  if (selectedCategory === "length") {
    valueInput.placeholder = "Napr. 25";
  } else if (selectedCategory === "weight") {
    valueInput.placeholder = "Napr. 80";
  } else if (selectedCategory === "temperature") {
    valueInput.placeholder = "Napr. 36.6";
  }

  conversionStatus.textContent = "Category changed";
}

// =============================================
// 12. INIT FUNKCIA
// =============================================

function init() {
  populateUnitSelects();

  resultValue.textContent = "--";
  resultDetail.textContent =
    "Vyber typ prevodu, zadaj hodnotu a klikni na Convert.";

  const selectedCategory = categorySelect.value;

  if (selectedCategory === "length") {
    valueInput.placeholder = "Napr. 25";
  } else if (selectedCategory === "weight") {
    valueInput.placeholder = "Napr. 80";
  } else if (selectedCategory === "temperature") {
    valueInput.placeholder = "Napr. 36.6";
  }

  conversionStatus.textContent = "Ready";
}

init();
