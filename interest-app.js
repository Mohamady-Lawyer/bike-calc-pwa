const amountInput = document.getElementById("amountInput");
const rateInput = document.getElementById("rateInput");
const durationInput = document.getElementById("durationInput");
const durationBox = document.getElementById("durationBox");
const resultLabel = document.getElementById("resultLabel");
const resultValue = document.getElementById("resultValue");
const amountLabel = document.getElementById("amountLabel");
const darkToggle = document.getElementById("darkToggle");
const modeSimpleBtn = document.getElementById("modeSimpleBtn");
const modeLoanBtn = document.getElementById("modeLoanBtn");

let mode = "simple"; // "simple" | "loan"

// Separate state for each mode so switching doesn't mix values
const state = {
  simple: { amount: 100000, rate: 12 },
  loan: { amount: 100000, rate: 12, duration: 24 },
};

function round2(n) {
  return Math.round(n * 100) / 100;
}

function getRawAmount() {
  return parseFloat(amountInput.value.replace(/,/g, "")) || 0;
}

function formatWithCommas(num) {
  if (isNaN(num)) return "";
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function formatAmountInput() {
  const cursorFromEnd = amountInput.value.length - amountInput.selectionStart;
  const raw = amountInput.value.replace(/[^\d.]/g, "");
  const formatted = formatWithCommas(parseFloat(raw) || 0);
  amountInput.value = raw === "" ? "" : formatted;
  const newPos = Math.max(0, amountInput.value.length - cursorFromEnd);
  amountInput.setSelectionRange(newPos, newPos);
}

function calculate() {
  const amount = getRawAmount();
  const rate = parseFloat(rateInput.value) || 0;

  if (mode === "simple") {
    state.simple.amount = amount;
    state.simple.rate = rate;

    const annualInterest = amount * (rate / 100);
    const monthlyInterest = round2(annualInterest / 12);
    resultValue.textContent = `${monthlyInterest.toFixed(2)} جنيه`;
    chrome.storage.local.set({ simpleState: state.simple });
  } else {
    const duration = parseInt(durationInput.value, 10) || 1;
    state.loan.amount = amount;
    state.loan.rate = rate;
    state.loan.duration = duration;

    const totalLoanInterestRate = (rate / 12) * duration; // as a fraction of principal, e.g. 0.185/12*24
    const totalInterestRateFraction = totalLoanInterestRate / 100;
    const monthlyInstallment = round2(
      (totalInterestRateFraction * amount + amount) / duration
    );
    resultValue.textContent = `${monthlyInstallment.toFixed(2)} جنيه`;
    chrome.storage.local.set({ loanState: state.loan });
  }
}

function loadModeIntoInputs(m) {
  const s = state[m];
  amountInput.value = formatWithCommas(s.amount);
  rateInput.value = s.rate;
  if (m === "loan") durationInput.value = s.duration;
}

function setMode(newMode) {
  mode = newMode;
  loadModeIntoInputs(mode);

  if (mode === "simple") {
    modeSimpleBtn.classList.add("active");
    modeLoanBtn.classList.remove("active");
    durationBox.classList.add("hidden");
    amountLabel.textContent = "المبلغ (جنيه)";
    resultLabel.textContent = "الفائدة الشهرية";
  } else {
    modeLoanBtn.classList.add("active");
    modeSimpleBtn.classList.remove("active");
    durationBox.classList.remove("hidden");
    amountLabel.textContent = "مبلغ القرض (جنيه)";
    resultLabel.textContent = "القسط الشهري";
  }
  calculate();
  chrome.storage.local.set({ mode });
}

function init() {
  chrome.storage.local.get(["simpleState", "loanState", "mode", "darkMode"], (data) => {
    if (data.simpleState) state.simple = data.simpleState;
    if (data.loanState) state.loan = data.loanState;
    const isDark = data.darkMode !== false; // default dark
    darkToggle.textContent = isDark ? "◑" : "◐";
    setMode(data.mode || "simple");
  });
}

amountInput.addEventListener("input", () => {
  formatAmountInput();
  calculate();
});
rateInput.addEventListener("input", calculate);
durationInput.addEventListener("input", calculate);

modeSimpleBtn.addEventListener("click", () => setMode("simple"));
modeLoanBtn.addEventListener("click", () => setMode("loan"));

darkToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  darkToggle.textContent = isDark ? "◑" : "◐";
  chrome.storage.local.set({ darkMode: isDark });
  if (typeof syncMotoDarkIcon === 'function') syncMotoDarkIcon(isDark);
});

function syncInterestDarkIcon(isDark) {
  darkToggle.textContent = isDark ? "◑" : "◐";
}
window.syncInterestDarkIcon = syncInterestDarkIcon;

// Enter key navigation
function getTabOrder() {
  return mode === "simple" ? [amountInput, rateInput] : [amountInput, rateInput, durationInput];
}

[amountInput, rateInput, durationInput].forEach((el) => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const order = getTabOrder();
      const idx = order.indexOf(el);
      const next = order[idx + 1];
      if (next) {
        next.focus();
        next.select();
      } else {
        el.blur();
      }
    }
  });
});

init();
