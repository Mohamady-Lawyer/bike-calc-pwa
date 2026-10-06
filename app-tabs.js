const gateView = document.getElementById('gateView');
const motoApp = document.getElementById('motoApp');
const interestApp = document.getElementById('interestApp');

function showApp(appName) {
  gateView.classList.toggle('active', appName === 'gate');
  motoApp.classList.toggle('active', appName === 'moto');
  interestApp.classList.toggle('active', appName === 'interest');
  window.scrollTo(0, 0);
}

document.getElementById('gateMotoBtn').addEventListener('click', () => showApp('moto'));
document.getElementById('gateInterestBtn').addEventListener('click', () => showApp('interest'));
document.getElementById('gateBackMoto').addEventListener('click', () => showApp('gate'));
document.getElementById('gateBackInterest').addEventListener('click', () => showApp('gate'));

showApp('gate');
