const inputIds = [
  'dailyKm', 'kmPrice', 'tripKm',
  'fuelRate', 'fuel92Price', 'serviceFee',
  'maintenanceRatio', 'oilRatio', 'otherRatio', 'companyRatio'
];

const fuel92PriceInput = document.getElementById('fuel92Price');
const serviceFeeInput = document.getElementById('serviceFee');
const fuelPriceInput = document.getElementById('fuelPrice');
const darkModeBtn = document.getElementById('darkModeBtn');
const settingsBtn = document.getElementById('settingsBtn');
const backBtn = document.getElementById('backBtn');
const mainView = document.getElementById('mainView');
const settingsView = document.getElementById('settingsView');
const capitalView = document.getElementById('capitalView');
const fixedView = document.getElementById('fixedView');
const pageTitle = document.getElementById('pageTitle');
const tabCalc = document.getElementById('tabCalc');
const tabCapital = document.getElementById('tabCapital');
const tabFixed = document.getElementById('tabFixed');

function showSettings() {
  mainView.style.display = 'none';
  settingsView.style.display = 'block';
  pageTitle.textContent = 'الإعدادات';
  settingsBtn.style.display = 'none';
}

function showMain() {
  settingsView.style.display = 'none';
  capitalView.style.display = 'none';
  fixedView.style.display = 'none';
  mainView.style.display = 'block';
  pageTitle.textContent = 'حاسبة أرباح الموتوسيكل';
  settingsBtn.style.display = 'inline-block';
  calculate();
}

function showTab(tab) {
  tabCalc.classList.remove('active');
  tabCapital.classList.remove('active');
  tabFixed.classList.remove('active');
  mainView.style.display = 'none';
  settingsView.style.display = 'none';
  capitalView.style.display = 'none';
  fixedView.style.display = 'none';

  if (tab === 'calc') {
    tabCalc.classList.add('active');
    mainView.style.display = 'block';
  } else if (tab === 'capital') {
    tabCapital.classList.add('active');
    capitalView.style.display = 'block';
  } else {
    tabFixed.classList.add('active');
    fixedView.style.display = 'block';
  }
}

tabCalc.addEventListener('click', () => showTab('calc'));
tabCapital.addEventListener('click', () => showTab('capital'));
tabFixed.addEventListener('click', () => showTab('fixed'));

settingsBtn.addEventListener('click', showSettings);
backBtn.addEventListener('click', showMain);


function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function updateFuelTotal() {
  const fuel92Price = parseFloat(fuel92PriceInput.value) || 0;
  const serviceFee = parseFloat(serviceFeeInput.value) || 0;
  fuelPriceInput.value = round2(fuel92Price + serviceFee);
}

function calculate() {
  updateFuelTotal();

  const dailyKm = parseFloat(document.getElementById('dailyKm').value) || 0;
  const profitKm = round2(dailyKm * 0.9);
  document.getElementById('profitKm').value = profitKm;

  const kmPrice = parseFloat(document.getElementById('kmPrice').value) || 0;
  const tripKm = parseFloat(document.getElementById('tripKm').value) || 0;
  const fuelRate = parseFloat(document.getElementById('fuelRate').value) || 0;
  const fuelPrice = parseFloat(fuelPriceInput.value) || 0;
  const maintenanceRatio = parseFloat(document.getElementById('maintenanceRatio').value) || 0;
  const oilRatio = parseFloat(document.getElementById('oilRatio').value) || 0;
  const otherRatio = parseFloat(document.getElementById('otherRatio').value) || 0;
  const companyRatio = parseFloat(document.getElementById('companyRatio').value) || 0;

  // Number of trips, based on profit-basis distance
  const tripCount = tripKm > 0 ? profitKm / tripKm : 0;

  // Total fuel consumed in liters (based on original daily km, unchanged)
  const totalLiters = (fuelRate / 100) * dailyKm;
  // Fuel cost in EGP (bensin 92 price + service fee)
  const fuelCost = totalLiters * fuelPrice;
  // Maintenance, oil & other expenses derived from fuel cost
  const maintenanceCost = fuelCost * maintenanceRatio;
  const oilCost = fuelCost * oilRatio;
  const otherCost = fuelCost * otherRatio;

  // Total daily income, based on profit-basis distance
  const dailyIncome = profitKm * kmPrice;
  // Company commission taken from total income
  const companyCommission = dailyIncome * companyRatio;

  // Total daily expenses = fuel + maintenance + oil + other + company commission
  const dailyExpenses = fuelCost + maintenanceCost + oilCost + otherCost + companyCommission;

  // Net expected profit
  const dailyNetProfit = dailyIncome - dailyExpenses;

  document.getElementById('tripCount').textContent = round2(tripCount).toLocaleString('en-US');
  document.getElementById('dailyIncome').textContent = round2(dailyIncome).toLocaleString('en-US');
  document.getElementById('dailyExpenses').textContent = round2(dailyExpenses).toLocaleString('en-US');
  document.getElementById('dailyNetProfit').textContent = round2(dailyNetProfit).toLocaleString('en-US');

  document.getElementById('bdMonth26').textContent = round2(dailyNetProfit * 26).toLocaleString('en-US');
  document.getElementById('bdMonth30').textContent = round2(dailyNetProfit * 30).toLocaleString('en-US');

  document.getElementById('bdFuel').textContent = round2(fuelCost).toLocaleString('en-US');
  document.getElementById('bdMaintenance').textContent = round2(maintenanceCost).toLocaleString('en-US');
  document.getElementById('bdOil').textContent = round2(oilCost).toLocaleString('en-US');
  document.getElementById('bdOther').textContent = round2(otherCost).toLocaleString('en-US');
  document.getElementById('bdCompany').textContent = round2(companyCommission).toLocaleString('en-US');
}


// Enter key navigation between fields, last field triggers calculate/back
function setupEnterNavigation() {
  const mainFields = ['dailyKm', 'kmPrice', 'tripKm'].map((id) => document.getElementById(id));
  mainFields.forEach((el, idx) => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (idx < mainFields.length - 1) {
          mainFields[idx + 1].focus();
        } else {
          calculate();
        }
      }
    });
  });

  const settingsFields = [
    'fuelRate', 'fuel92Price', 'serviceFee',
    'maintenanceRatio', 'oilRatio', 'otherRatio', 'companyRatio'
  ].map((id) => document.getElementById(id));
  settingsFields.forEach((el, idx) => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (idx < settingsFields.length - 1) {
          settingsFields[idx + 1].focus();
        } else {
          showMain();
        }
      }
    });
  });
}
setupEnterNavigation();

// Dark mode
function applyDarkMode(isDark) {
  document.body.classList.toggle('dark', isDark);
  darkModeBtn.textContent = isDark ? '☀️' : '🌙';
}
function syncMotoDarkIcon(isDark) {
  darkModeBtn.textContent = isDark ? '☀️' : '🌙';
}
window.syncMotoDarkIcon = syncMotoDarkIcon;

darkModeBtn.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark');
  applyDarkMode(isDark);
  chrome.storage.local.set({ darkMode: isDark });
  if (typeof syncInterestDarkIcon === 'function') syncInterestDarkIcon(isDark);
});

chrome.storage.local.get(['darkMode', 'inputs'], (data) => {
  applyDarkMode(data.darkMode !== false); // default dark
  if (data.inputs) {
    inputIds.forEach((id) => {
      if (data.inputs[id] !== undefined) {
        document.getElementById(id).value = data.inputs[id];
      }
    });
  }
  calculate();
});

// Persist input values on change
function saveInputs() {
  const values = {};
  inputIds.forEach((id) => {
    values[id] = document.getElementById(id).value;
  });
  chrome.storage.local.set({ inputs: values });
}

inputIds.forEach((id) => {
  document.getElementById(id).addEventListener('input', () => {
    calculate();
    saveInputs();
  });
});

// ===== Capital & Expenses page =====
const capitalItemsEl = document.getElementById('capitalItems');
const expenseItemsEl = document.getElementById('expenseItems');
const capitalBtnRow = document.getElementById('capitalBtnRow');
const expenseBtnRow = document.getElementById('expenseBtnRow');
const capitalTotalEl = document.getElementById('capitalTotal');
const expenseTotalEl = document.getElementById('expenseTotal');
const deficitCard = document.getElementById('deficitCard');
const deficitValueEl = document.getElementById('deficitValue');

let capitalItems = [{ amount: '', label: '' }];
let expenseItems = [{ amount: '', label: '' }];

function renderSplitColumn(items, containerEl, btnRowEl, type) {
  containerEl.innerHTML = '';
  items.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'split-item';
    div.draggable = true;
    div.dataset.idx = idx;
    div.innerHTML = `
      <input type="number" class="split-amount" data-type="${type}" data-idx="${idx}" data-field="amount" value="${item.amount}" placeholder="0">
      <input type="text" class="split-label" data-type="${type}" data-idx="${idx}" data-field="label" value="${item.label}" placeholder="المسمى">
    `;
    containerEl.appendChild(div);
  });

  setupDragReorder(containerEl, items, btnRowEl, type);

  btnRowEl.innerHTML = '';
  const addBtn = document.createElement('button');
  addBtn.className = 'split-add-btn';
  addBtn.textContent = '+';
  addBtn.addEventListener('click', () => {
    items.push({ amount: '', label: '' });
    renderSplitColumn(items, containerEl, btnRowEl, type);
    saveAllSplitData();
    const newFirstInput = containerEl.querySelector('.split-item:last-child .split-amount');
    if (newFirstInput) newFirstInput.focus();
  });
  btnRowEl.appendChild(addBtn);

  if (items.length > 1) {
    const removeBtn = document.createElement('button');
    removeBtn.className = 'split-remove-btn';
    removeBtn.textContent = '−';
    removeBtn.addEventListener('click', () => {
      items.pop();
      renderSplitColumn(items, containerEl, btnRowEl, type);
      updateSplitTotals();
      saveAllSplitData();
    });
    btnRowEl.appendChild(removeBtn);
  }

  setupSplitEnterNavigation(containerEl, addBtn);
}

let dragSrcIdx = null;

function setupDragReorder(containerEl, items, btnRowEl, type) {
  const cards = Array.from(containerEl.querySelectorAll('.split-item'));

  cards.forEach((card) => {
    card.addEventListener('dragstart', () => {
      dragSrcIdx = parseInt(card.dataset.idx, 10);
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      card.classList.add('drag-over');
    });

    card.addEventListener('dragleave', () => {
      card.classList.remove('drag-over');
    });

    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      const targetIdx = parseInt(card.dataset.idx, 10);
      if (dragSrcIdx === null || dragSrcIdx === targetIdx) return;

      const moved = items.splice(dragSrcIdx, 1)[0];
      items.splice(targetIdx, 0, moved);
      dragSrcIdx = null;

      renderSplitColumn(items, containerEl, btnRowEl, type);
      updateSplitTotals();
      saveAllSplitData();
    });
  });
}

function setupSplitEnterNavigation(containerEl, addBtn) {
  const fields = Array.from(containerEl.querySelectorAll('input'));
  fields.forEach((el, idx) => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (idx < fields.length - 1) {
          fields[idx + 1].focus();
        } else {
          addBtn.click();
        }
      }
    });
  });
}

function updateSplitTotals() {
  const capitalSum = capitalItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const expenseSum = expenseItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  capitalTotalEl.textContent = round2(capitalSum).toLocaleString('en-US');
  expenseTotalEl.textContent = round2(expenseSum).toLocaleString('en-US');

  const deficit = capitalSum - expenseSum;
  if (deficit < 0) {
    deficitCard.style.display = 'block';
    deficitValueEl.textContent = round2(deficit).toLocaleString('en-US');
  } else {
    deficitCard.style.display = 'none';
  }
}

// ===== Fixed Monthly Expenses page (single column, same mechanism) =====
const fixedItemsEl = document.getElementById('fixedItems');
const fixedBtnRow = document.getElementById('fixedBtnRow');
const fixedTotalEl = document.getElementById('fixedTotal');

let fixedItems = [{ amount: '', label: '' }];

function updateFixedTotal() {
  const fixedSum = fixedItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  fixedTotalEl.textContent = round2(fixedSum).toLocaleString('en-US');
}

document.addEventListener('input', (e) => {
  const target = e.target;
  const type = target.getAttribute('data-type');
  const idx = target.getAttribute('data-idx');
  const field = target.getAttribute('data-field');
  if (type === null || idx === null || field === null) return;

  let items;
  if (type === 'capital') items = capitalItems;
  else if (type === 'expense') items = expenseItems;
  else if (type === 'fixed') items = fixedItems;
  else return;

  items[parseInt(idx, 10)][field] = target.value;

  if (type === 'fixed') {
    updateFixedTotal();
  } else {
    updateSplitTotals();
  }
  saveAllSplitData();
});

function saveAllSplitData() {
  chrome.storage.local.set({ capitalItems, expenseItems, fixedItems });
}

function initSplitColumns() {
  chrome.storage.local.get(['capitalItems', 'expenseItems', 'fixedItems'], (data) => {
    if (data.capitalItems && data.capitalItems.length) capitalItems = data.capitalItems;
    if (data.expenseItems && data.expenseItems.length) expenseItems = data.expenseItems;
    if (data.fixedItems && data.fixedItems.length) fixedItems = data.fixedItems;
    renderSplitColumn(capitalItems, capitalItemsEl, capitalBtnRow, 'capital');
    renderSplitColumn(expenseItems, expenseItemsEl, expenseBtnRow, 'expense');
    renderSplitColumn(fixedItems, fixedItemsEl, fixedBtnRow, 'fixed');
    updateSplitTotals();
    updateFixedTotal();
  });
}

initSplitColumns();

// ===== Export / Import ALL Moto tab data as a text code =====
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importText = document.getElementById('importText');
const exportImportStatus = document.getElementById('exportImportStatus');

function showExportImportStatus(msg, isError) {
  exportImportStatus.textContent = msg;
  exportImportStatus.style.color = isError ? 'var(--danger)' : 'var(--success-text)';
  setTimeout(() => { exportImportStatus.textContent = ''; }, 3500);
}

exportBtn.addEventListener('click', () => {
  const inputsValues = {};
  inputIds.forEach((id) => {
    inputsValues[id] = document.getElementById(id).value;
  });

  const payload = {
    inputs: inputsValues,
    darkMode: document.body.classList.contains('dark'),
    capitalItems,
    expenseItems,
    fixedItems
  };
  const code = 'MOTOCALC2:' + btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code)
      .then(() => showExportImportStatus('تم نسخ الكود! الصقه في الجهاز التاني'))
      .catch(() => {
        importText.value = code;
        showExportImportStatus('انسخ الكود يدويًا من الصندوق تحت');
      });
  } else {
    importText.value = code;
    showExportImportStatus('انسخ الكود يدويًا من الصندوق تحت');
  }
});

importBtn.addEventListener('click', () => {
  const raw = importText.value.trim();
  if (!raw.startsWith('MOTOCALC2:')) {
    showExportImportStatus('الكود غير صحيح أو غير مكتمل', true);
    return;
  }
  try {
    const json = decodeURIComponent(escape(atob(raw.slice('MOTOCALC2:'.length))));
    const payload = JSON.parse(json);
    if (!payload.inputs || !Array.isArray(payload.capitalItems) || !Array.isArray(payload.expenseItems)) {
      throw new Error('invalid shape');
    }

    // Apply calculator inputs & settings
    inputIds.forEach((id) => {
      if (payload.inputs[id] !== undefined) {
        document.getElementById(id).value = payload.inputs[id];
      }
    });
    saveInputs();

    // Apply dark mode
    applyDarkMode(!!payload.darkMode);
    chrome.storage.local.set({ darkMode: !!payload.darkMode });
    if (typeof syncInterestDarkIcon === 'function') syncInterestDarkIcon(!!payload.darkMode);

    // Apply capital / expenses / fixed
    capitalItems = payload.capitalItems;
    expenseItems = payload.expenseItems;
    fixedItems = Array.isArray(payload.fixedItems) && payload.fixedItems.length ? payload.fixedItems : [{ amount: '', label: '' }];
    renderSplitColumn(capitalItems, capitalItemsEl, capitalBtnRow, 'capital');
    renderSplitColumn(expenseItems, expenseItemsEl, expenseBtnRow, 'expense');
    renderSplitColumn(fixedItems, fixedItemsEl, fixedBtnRow, 'fixed');
    updateSplitTotals();
    updateFixedTotal();
    saveAllSplitData();

    calculate();
    importText.value = '';
    showExportImportStatus('تم استيراد كل بيانات الموتوسيكل بنجاح');
  } catch (e) {
    showExportImportStatus('تعذّر قراءة الكود، تأكد إنه منسوخ كامل', true);
  }
});
