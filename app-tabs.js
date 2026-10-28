const gateView = document.getElementById('gateView');
const motoApp = document.getElementById('motoApp');
const interestApp = document.getElementById('interestApp');

function showApp(appName) {
  gateView.classList.toggle('active', appName === 'gate');
  motoApp.classList.toggle('active', appName === 'moto');
  interestApp.classList.toggle('active', appName === 'interest');
  window.scrollTo(0, 0);
  closePrintMenu();
  if (typeof stopScan === 'function') stopScan();
}

document.getElementById('gateMotoBtn').addEventListener('click', () => showApp('moto'));
document.getElementById('gateInterestBtn').addEventListener('click', () => showApp('interest'));
document.getElementById('gateBackMoto').addEventListener('click', () => showApp('gate'));
document.getElementById('gateBackInterest').addEventListener('click', () => showApp('gate'));


// ===== Printing =====
const printTitleEl = document.getElementById('printTitle');
const printDateEl = document.getElementById('printDate');
const printBtn = document.getElementById('printBtn');
const printMenu = document.getElementById('printMenu');
const interestPrintBtn = document.getElementById('interestPrintBtn');

function isShown(id) {
  const el = document.getElementById(id);
  return !!el && el.style.display !== 'none';
}

function motoSectionTitle() {
  if (isShown('settingsView')) return 'الإعدادات';
  if (isShown('capitalView')) return 'رأس مال ومصروفات';
  if (isShown('fixedView')) return 'مصاريف شهرية ثابتة';
  return 'الحاسبة';
}

function currentPrintTitle() {
  if (interestApp.classList.contains('active')) {
    const loan = document.getElementById('modeLoanBtn').classList.contains('active');
    return 'حاسبة الفائدة — ' + (loan ? 'فائدة قرض' : 'فائدة عادية');
  }
  if (document.body.classList.contains('print-all')) {
    return 'حاسبة أرباح الموتوسيكل — التقرير الكامل';
  }
  return 'حاسبة أرباح الموتوسيكل — ' + motoSectionTitle();
}

function applyPrintMeta() {
  printTitleEl.textContent = currentPrintTitle();
  printDateEl.textContent = new Date().toLocaleDateString('en-GB');
}

function doPrint(all) {
  document.body.classList.toggle('print-all', !!all);
  applyPrintMeta();
  window.print();
}

function closePrintMenu() {
  if (!printMenu) return;
  printMenu.hidden = true;
  printBtn.setAttribute('aria-expanded', 'false');
}

window.addEventListener('beforeprint', applyPrintMeta);
window.addEventListener('afterprint', () => document.body.classList.remove('print-all'));

printBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = printMenu.hidden;
  printMenu.hidden = !open;
  printBtn.setAttribute('aria-expanded', String(open));
});

printMenu.addEventListener('click', (e) => {
  const item = e.target.closest('button[data-print]');
  if (!item) return;
  closePrintMenu();
  doPrint(item.dataset.print === 'all');
});

interestPrintBtn.addEventListener('click', () => doPrint(false));
document.addEventListener('click', closePrintMenu);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePrintMenu();
});

showApp('gate');
