const inputIds = [
  'dailyKm', 'kmPrice',
  'fuelRate', 'fuel92Price', 'serviceFee',
  'maintenanceRatio', 'oilPerKm', 'otherAmount', 'companyRatio'
];

let customExpenses = [];
const TRASH_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12"/><path d="M9 7V4h6v3"/></svg>';
const customItemsEl = document.getElementById('customItems');
const addCustomBtn = document.getElementById('addCustomBtn');
const extrasBox = document.getElementById('extrasBox');
const extrasList = document.getElementById('extrasList');
const extrasTotal = document.getElementById('extrasTotal');

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
const pageTitle = document.getElementById('motoPageTitle');
const backArrowBtn = document.getElementById('backArrowBtn');
const gateBackMoto = document.getElementById('gateBackMoto');
const tabCalc = document.getElementById('tabCalc');
const tabCapital = document.getElementById('tabCapital');
const tabFixed = document.getElementById('tabFixed');

function showSettings() {
  if (typeof refreshExportPreview === 'function') refreshExportPreview();
  mainView.style.display = 'none';
  settingsView.style.display = 'block';
  pageTitle.textContent = 'الإعدادات';
  backArrowBtn.style.display = 'flex';
  gateBackMoto.style.display = 'none';
}

function showMain() {
  if (typeof stopScan === 'function') stopScan();
  if (typeof hideQrBox === 'function') hideQrBox();
  settingsView.style.display = 'none';
  capitalView.style.display = 'none';
  fixedView.style.display = 'none';
  mainView.style.display = 'block';
  pageTitle.textContent = 'حاسبة أرباح الموتوسيكل';
  backArrowBtn.style.display = 'none';
  gateBackMoto.style.display = '';
  calculate();
}

function showTab(tab) {
  if (typeof stopScan === 'function') stopScan();
  if (typeof hideQrBox === 'function') hideQrBox();
  tabCalc.classList.remove('active');
  tabCapital.classList.remove('active');
  tabFixed.classList.remove('active');
  mainView.style.display = 'none';
  settingsView.style.display = 'none';
  capitalView.style.display = 'none';
  fixedView.style.display = 'none';
  pageTitle.textContent = 'حاسبة أرباح الموتوسيكل';
  backArrowBtn.style.display = 'none';
  gateBackMoto.style.display = '';

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

settingsBtn.addEventListener('click', () => {
  if (settingsView.style.display === 'block') {
    showMain();
  } else if (mainView.style.display !== 'none') {
    showSettings();
  }
});
backArrowBtn.addEventListener('click', showMain);
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
  const fuelRate = parseFloat(document.getElementById('fuelRate').value) || 0;
  const fuelPrice = parseFloat(fuelPriceInput.value) || 0;
  const maintenanceRatio = parseFloat(document.getElementById('maintenanceRatio').value) || 0;
  const oilPerKm = parseFloat(document.getElementById('oilPerKm').value) || 0;
  const otherAmount = parseFloat(document.getElementById('otherAmount').value) || 0;
  const companyRatio = parseFloat(document.getElementById('companyRatio').value) || 0;

  // Total fuel consumed in liters (based on original daily km, unchanged)
  const totalLiters = (fuelRate / 100) * dailyKm;
  // Fuel cost in EGP (bensin 92 price + service fee)
  const fuelCost = totalLiters * fuelPrice;
  // Maintenance, oil & other expenses derived from fuel cost
  const maintenanceCost = fuelCost * maintenanceRatio;
  const oilCost = oilPerKm * dailyKm;
  // Other expenses are now EGP per km x distance covered (like oil)
  const otherCost = otherAmount * dailyKm;

  // Total daily income, based on profit-basis distance
  const dailyIncome = profitKm * kmPrice;
  // Company commission taken from total income
  const companyCommission = dailyIncome * companyRatio;

  // Operating expenses = fuel + maintenance + oil + other + company commission
  const dailyExpenses = fuelCost + maintenanceCost + oilCost + otherCost + companyCommission;
  // Extra items are shown in their own card but still reduce the net
  const customTotal = customExpenses.reduce((sum, it) => sum + (parseFloat(it.amount) || 0), 0);

  // Net expected income
  const dailyNetProfit = dailyIncome - dailyExpenses - customTotal;

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
  renderCustomBreakdown();
}


// Enter key navigation between fields, last field triggers calculate/back
function setupEnterNavigation() {
  const mainFields = ['dailyKm', 'kmPrice'].map((id) => document.getElementById(id));
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

  settingsFixedFields().forEach((el) => {
    el.addEventListener('keydown', (e) => onSettingsEnter(e, el));
  });
}

function settingsFixedFields() {
  return [
    'fuelRate', 'fuel92Price', 'serviceFee',
    'maintenanceRatio', 'oilPerKm', 'otherAmount', 'companyRatio'
  ].map((id) => document.getElementById(id));
}

function onSettingsEnter(e, el) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const order = settingsFixedFields().concat(Array.from(customItemsEl.querySelectorAll('input')));
  const idx = order.indexOf(el);
  if (idx < order.length - 1) {
    order[idx + 1].focus();
  } else {
    showMain();
  }
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

chrome.storage.local.get(['darkMode', 'inputs', 'customExpenses', 'otherPerKm'], (data) => {
  applyDarkMode(data.darkMode !== false); // default dark
  if (Array.isArray(data.customExpenses)) customExpenses = sanitizeCustom(data.customExpenses);
  renderCustomItems();
  if (data.inputs) {
    inputIds.forEach((id) => {
      if (data.inputs[id] !== undefined) {
        document.getElementById(id).value = data.inputs[id];
      }
    });
  }
  // One-time migration: "other expenses" used to be a fixed daily amount (e.g. 50);
  // it is now EGP per km, so reset it to the new default (0.5) once.
  if (!data.otherPerKm) {
    document.getElementById('otherAmount').value = '0.5';
    saveInputs();
    chrome.storage.local.set({ otherPerKm: true });
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

// ===== Extra daily expense items (settings) =====

function sanitizeCustom(list) {
  return list.map((it) => ({
    label: String((it && it.label) || ''),
    amount: it && it.amount !== undefined && it.amount !== null ? it.amount : ''
  }));
}

function saveCustomExpenses() {
  chrome.storage.local.set({ customExpenses });
}

function renderCustomItems() {
  customItemsEl.innerHTML = '';
  customExpenses.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'custom-item';

    const name = document.createElement('input');
    name.type = 'text';
    name.className = 'custom-name';
    name.placeholder = 'اسم البند';
    name.setAttribute('aria-label', 'اسم البند');
    name.value = item.label;

    const amount = document.createElement('input');
    amount.type = 'number';
    amount.className = 'custom-amount';
    amount.step = 'any';
    amount.min = '0';
    amount.placeholder = '0';
    amount.setAttribute('aria-label', 'المبلغ اليومي');
    amount.value = item.amount;

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'custom-del';
    del.setAttribute('aria-label', 'حذف البند');
    del.innerHTML = TRASH_SVG;

    name.addEventListener('input', () => {
      customExpenses[idx].label = name.value;
      saveCustomExpenses();
      calculate();
    });
    amount.addEventListener('input', () => {
      customExpenses[idx].amount = amount.value;
      saveCustomExpenses();
      calculate();
    });
    del.addEventListener('click', () => {
      customExpenses.splice(idx, 1);
      renderCustomItems();
      saveCustomExpenses();
      calculate();
    });
    name.addEventListener('keydown', (e) => onSettingsEnter(e, name));
    amount.addEventListener('keydown', (e) => onSettingsEnter(e, amount));

    row.appendChild(name);
    row.appendChild(amount);
    row.appendChild(del);
    customItemsEl.appendChild(row);
  });
}

function renderCustomBreakdown() {
  extrasList.innerHTML = '';
  let total = 0;
  let shown = 0;
  customExpenses.forEach((item) => {
    const amt = parseFloat(item.amount) || 0;
    total += amt;
    if (!item.label && amt === 0) return;
    const row = document.createElement('div');
    row.className = 'breakdown-row';
    const l = document.createElement('span');
    l.textContent = item.label || 'بند إضافي';
    const v = document.createElement('span');
    v.textContent = round2(amt).toLocaleString('en-US');
    row.appendChild(l);
    row.appendChild(v);
    extrasList.appendChild(row);
    shown++;
  });
  extrasTotal.textContent = round2(total).toLocaleString('en-US');
  extrasBox.hidden = shown === 0;
}

addCustomBtn.addEventListener('click', () => {
  customExpenses.push({ label: '', amount: '' });
  renderCustomItems();
  saveCustomExpenses();
  const last = customItemsEl.querySelector('.custom-item:last-child .custom-name');
  if (last) last.focus();
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

// ===== Export / Import ALL Moto data: text code + QR (same idea as the work calculator) =====
const exportPreview = document.getElementById('exportPreview');
const exportCount = document.getElementById('exportCount');
const exportBtn = document.getElementById('exportBtn');
const qrBtn = document.getElementById('qrBtn');
const qrBox = document.getElementById('qrBox');
const qrCv = document.getElementById('qrCv');
const qrMsg = document.getElementById('qrMsg');
const importBtn = document.getElementById('importBtn');
const importText = document.getElementById('importText');
const importCount = document.getElementById('importCount');
const importClearBtn = document.getElementById('importClearBtn');
const scanBtn = document.getElementById('scanBtn');
const fileBtn = document.getElementById('fileBtn');
const importFile = document.getElementById('importFile');
const scannerEl = document.getElementById('scanner');
const scVideo = document.getElementById('scVideo');
const scClose = document.getElementById('scClose');
const exportImportStatus = document.getElementById('exportImportStatus');
let statusTimer = null;

function showExportImportStatus(msg, isError) {
  exportImportStatus.textContent = msg;
  exportImportStatus.style.color = isError ? 'var(--danger)' : 'var(--success-text)';
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { exportImportStatus.textContent = ''; }, 4500);
}

// --- helpers: base64 / deflate ---
function b64e(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function b64d(t) {
  const bin = atob(t);
  const b = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
  return b;
}
function pipeStream(stream, data) {
  const w = stream.writable.getWriter();
  w.write(data).catch(() => {});
  w.close().catch(() => {});
  return new Response(stream.readable).arrayBuffer().then((x) => new Uint8Array(x));
}
function loadLib(src, isReady) {
  return new Promise((resolve, reject) => {
    if (isReady()) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('load failed'));
    document.head.appendChild(s);
  });
}
const loadQrGen = () => loadLib('qrcode.js', () => typeof window.qrcode === 'function');
const loadQrRead = () => loadLib('jsqr.js', () => typeof window.jsQR === 'function');

// --- build / encode / decode the data code ---
function buildPayload() {
  const inputsValues = {};
  inputIds.forEach((id) => {
    inputsValues[id] = document.getElementById(id).value;
  });
  return {
    inputs: inputsValues,
    otherPerKm: true,
    darkMode: document.body.classList.contains('dark'),
    capitalItems,
    expenseItems,
    fixedItems,
    customExpenses
  };
}

// MOTOCALC2: = plain base64 (old format), MOTOCALC3: = deflate-compressed (shorter, better for QR)
function encodeCode(obj) {
  const json = JSON.stringify(obj);
  const plain = 'MOTOCALC2:' + btoa(unescape(encodeURIComponent(json)));
  if (typeof CompressionStream === 'undefined') return Promise.resolve(plain);
  const raw = new TextEncoder().encode(json);
  return pipeStream(new CompressionStream('deflate'), raw).then((z) => {
    const packed = 'MOTOCALC3:' + b64e(z);
    return packed.length < plain.length ? packed : plain;
  }, () => plain);
}

function decodeCode(raw) {
  const kind = raw.slice(0, 10);
  const body = raw.slice(10);
  if (kind === 'MOTOCALC2:') {
    return Promise.resolve(JSON.parse(decodeURIComponent(escape(atob(body)))));
  }
  if (kind === 'MOTOCALC3:' && typeof DecompressionStream !== 'undefined') {
    return pipeStream(new DecompressionStream('deflate'), b64d(body))
      .then((u) => JSON.parse(new TextDecoder().decode(u)));
  }
  return Promise.reject(new Error('bad code'));
}

// Pull a code out of pasted text (e.g. a WhatsApp message with extra words around it)
function extractCode(text) {
  const t = String(text || '');
  const m = /MOTOCALC[23]:/.exec(t);
  if (!m) return null;
  const lines = t.slice(m.index).split(/\r?\n/);
  let out = '';
  let first = true;
  for (let i = 0; i < lines.length; i++) {
    let ln = lines[i].trim();
    if (first) { ln = ln.split(/\s+/)[0]; first = false; }
    else if (!/^[A-Za-z0-9+\/=]+$/.test(ln)) break;
    if (!ln) break;
    out += ln;
    if (/=$/.test(ln)) break;
  }
  return /^MOTOCALC[23]:[A-Za-z0-9+\/=]+$/.test(out) ? out : null;
}

function previewOf(c) {
  return c.length <= 28 ? c : c.slice(0, 14) + '......' + c.slice(-8);
}
function countText(c) {
  return 'عدد الحروف: ' + c.length.toLocaleString('en-US') + ' حرف';
}

let lastCode = '';
function refreshCode() {
  return encodeCode(buildPayload()).then((code) => {
    lastCode = code;
    exportPreview.value = previewOf(code);
    exportCount.textContent = countText(code);
    return code;
  });
}
function refreshExportPreview() { refreshCode(); }

// keep the preview fresh while settings are edited
let previewTimer = null;
settingsView.addEventListener('input', (e) => {
  if (e.target === importText) return;
  clearTimeout(previewTimer);
  previewTimer = setTimeout(refreshCode, 400);
});

// --- export: copy ---
exportBtn.addEventListener('click', () => {
  refreshCode().then((code) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => showExportImportStatus('تم نسخ الكود! الصقه في الجهاز التاني'))
        .catch(() => {
          importText.value = code;
          updateImportCount();
          showExportImportStatus('انسخ الكود يدويًا من الصندوق تحت');
        });
    } else {
      importText.value = code;
      updateImportCount();
      showExportImportStatus('انسخ الكود يدويًا من الصندوق تحت');
    }
  });
});

// --- export: QR ---
function hideQrBox() { qrBox.hidden = true; }

qrBtn.addEventListener('click', () => {
  if (!qrBox.hidden) { hideQrBox(); return; }
  Promise.all([refreshCode(), loadQrGen()]).then((r) => {
    const code = r[0];
    qrBox.hidden = false;
    try {
      const q = window.qrcode(0, 'L');
      q.addData(code);
      q.make();
      const n = q.getModuleCount();
      const cell = Math.max(3, Math.floor(900 / (n + 8)));
      const sz = (n + 8) * cell;
      qrCv.width = sz;
      qrCv.height = sz;
      const g = qrCv.getContext('2d');
      g.fillStyle = '#fff';
      g.fillRect(0, 0, sz, sz);
      g.fillStyle = '#000';
      for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
          if (q.isDark(row, col)) g.fillRect((col + 4) * cell, (row + 4) * cell, cell, cell);
        }
      }
      qrCv.hidden = false;
      qrMsg.textContent = 'اقرأه من جهاز تاني بزر "مسح QR"، أو صوّره وارفعه بزر "استيراد من ملف".';
    } catch (e) {
      qrCv.hidden = true;
      qrMsg.textContent = 'البيانات أكبر من إن QR واحد يشيلها. استخدم زر نسخ الكود.';
    }
  }).catch(() => {
    showExportImportStatus('تعذّر تحميل مكتبة الـ QR (محتاجة إنترنت أول مرة)', true);
  });
});

// --- import: apply a decoded payload ---
function applyPayload(payload) {
  if (!payload || !payload.inputs || !Array.isArray(payload.capitalItems) || !Array.isArray(payload.expenseItems)) {
    throw new Error('invalid shape');
  }

  // Apply calculator inputs & settings
  inputIds.forEach((id) => {
    if (payload.inputs[id] !== undefined) {
      document.getElementById(id).value = payload.inputs[id];
    }
  });
  // Old codes stored "other expenses" as a fixed daily amount: use the new per-km default instead
  if (payload.otherPerKm !== true) {
    document.getElementById('otherAmount').value = '0.5';
  }
  saveInputs();

  // Apply extra daily expense items (absent in older codes: keep current)
  if (Array.isArray(payload.customExpenses)) {
    customExpenses = sanitizeCustom(payload.customExpenses);
    renderCustomItems();
    saveCustomExpenses();
  }

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
  refreshCode();
}

function doImport(askFirst) {
  const raw = extractCode(importText.value) || importText.value.replace(/\s+/g, '');
  if (!/^MOTOCALC[23]:/.test(raw)) {
    showExportImportStatus('الكود غير صحيح أو غير مكتمل', true);
    return;
  }
  decodeCode(raw).then((payload) => {
    if (askFirst && !confirm('هيتم استبدال كل بيانات حاسبة الموتوسيكل الحالية. تكمل؟')) return;
    applyPayload(payload);
    importText.value = '';
    updateImportCount();
    showExportImportStatus('تم استيراد كل بيانات الموتوسيكل بنجاح');
  }).catch(() => {
    showExportImportStatus('تعذّر قراءة الكود، تأكد إنه منسوخ كامل', true);
  });
}

function updateImportCount() {
  const v = importText.value.trim();
  importCount.textContent = v ? countText(v) : '';
}

importBtn.addEventListener('click', () => doImport(false));
importText.addEventListener('input', updateImportCount);
importText.addEventListener('paste', (e) => {
  const cd = e.clipboardData || window.clipboardData;
  const t = cd ? cd.getData('text') : '';
  const code = extractCode(t);
  if (code) {
    e.preventDefault();
    importText.value = code;
    updateImportCount();
  }
});
importClearBtn.addEventListener('click', () => {
  importText.value = '';
  updateImportCount();
});

// --- import: from a file (text file or QR image) ---
function qrFromImage(file, done) {
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = () => {
    loadQrRead().then(() => {
      try {
        const sc = Math.min(1, 2200 / Math.max(img.naturalWidth, img.naturalHeight));
        const cv = document.createElement('canvas');
        cv.width = Math.round(img.naturalWidth * sc);
        cv.height = Math.round(img.naturalHeight * sc);
        const cx = cv.getContext('2d', { willReadFrequently: true });
        cx.drawImage(img, 0, 0, cv.width, cv.height);
        const id = cx.getImageData(0, 0, cv.width, cv.height);
        const r = window.jsQR(id.data, cv.width, cv.height, { inversionAttempts: 'attemptBoth' });
        done(r ? r.data : null);
      } catch (e) { done(null); }
      URL.revokeObjectURL(url);
    }, () => { URL.revokeObjectURL(url); done(null); });
  };
  img.onerror = () => { URL.revokeObjectURL(url); done(null); };
  img.src = url;
}

function readTextFile(file, done) {
  if (file.text) { file.text().then(done, () => done(null)); return; }
  const fr = new FileReader();
  fr.onload = () => done(String(fr.result));
  fr.onerror = () => done(null);
  fr.readAsText(file);
}

fileBtn.addEventListener('click', () => {
  importFile.value = '';
  importFile.click();
});

importFile.addEventListener('change', () => {
  const f = importFile.files && importFile.files[0];
  importFile.value = '';
  if (!f) return;
  if (f.size > 8 * 1024 * 1024) { showExportImportStatus('الملف كبير زيادة', true); return; }
  const isImg = /^image\//.test(f.type) || /\.(png|jpe?g|webp|bmp|gif)$/i.test(f.name);
  const got = (t) => {
    const code = t ? extractCode(t) : null;
    if (!code) {
      showExportImportStatus(isImg ? 'ما لقيتش QR واضح في الصورة' : 'ما لقيتش كود في الملف', true);
      return;
    }
    importText.value = code;
    updateImportCount();
    showExportImportStatus('تم تحميل الكود. اضغط استيراد');
  };
  if (isImg) qrFromImage(f, got); else readTextFile(f, got);
});

// --- import: scan QR with the camera ---
const scan = { stream: null, timer: null };

function stopScan() {
  clearInterval(scan.timer);
  scan.timer = null;
  if (scan.stream) {
    scan.stream.getTracks().forEach((t) => t.stop());
    scan.stream = null;
  }
  scVideo.srcObject = null;
  scannerEl.hidden = true;
}

function onScanned(text) {
  const code = extractCode(text);
  if (!code) {
    showExportImportStatus('الـ QR ده مش من حاسبة الموتوسيكل', true);
    return;
  }
  importText.value = code;
  updateImportCount();
  doImport(true);
}

function startScan() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showExportImportStatus('الكاميرا مش متاحة في المتصفح ده. استخدم "استيراد من ملف"', true);
    return;
  }
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false
  }).then((st) => {
    scan.stream = st;
    scannerEl.hidden = false;
    scVideo.srcObject = st;
    const pl = scVideo.play();
    if (pl && pl.catch) pl.catch(() => {});

    let det = null;
    if ('BarcodeDetector' in window) {
      try { det = new BarcodeDetector({ formats: ['qr_code'] }); } catch (e) { det = null; }
    }
    loadQrRead().catch(() => {}); // fallback decoder, loaded in the background

    const cv = document.createElement('canvas');
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    let busy = false;
    scan.timer = setInterval(() => {
      const v = scVideo;
      if (busy || v.readyState < 2 || !v.videoWidth) return;
      busy = true;
      const done = (t) => {
        busy = false;
        if (t) { stopScan(); onScanned(t); }
      };
      const viaJs = () => {
        if (typeof window.jsQR !== 'function') return null;
        cv.width = v.videoWidth;
        cv.height = v.videoHeight;
        ctx.drawImage(v, 0, 0, cv.width, cv.height);
        const id = ctx.getImageData(0, 0, cv.width, cv.height);
        const c = window.jsQR(id.data, cv.width, cv.height, { inversionAttempts: 'dontInvert' });
        return c ? c.data : null;
      };
      if (det) {
        det.detect(v).then((r) => done(r && r.length ? r[0].rawValue : null), () => { det = null; done(null); });
      } else {
        try { done(viaJs()); } catch (e) { done(null); }
      }
    }, 300);
  }, () => {
    showExportImportStatus('الكاميرا مش متاحة. اسمح بالوصول للكاميرا أو استخدم "استيراد من ملف"', true);
  });
}

scanBtn.addEventListener('click', startScan);
scClose.addEventListener('click', stopScan);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !scannerEl.hidden) stopScan();
});
