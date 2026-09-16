const appTabMoto = document.getElementById('appTabMoto');
const appTabInterest = document.getElementById('appTabInterest');
const motoApp = document.getElementById('motoApp');
const interestApp = document.getElementById('interestApp');

function showApp(appName) {
  if (appName === 'moto') {
    appTabMoto.classList.add('active');
    appTabInterest.classList.remove('active');
    motoApp.classList.add('active');
    interestApp.classList.remove('active');
  } else {
    appTabInterest.classList.add('active');
    appTabMoto.classList.remove('active');
    interestApp.classList.add('active');
    motoApp.classList.remove('active');
  }
  chrome.storage.local.set({ activeApp: appName });
}

appTabMoto.addEventListener('click', () => showApp('moto'));
appTabInterest.addEventListener('click', () => showApp('interest'));

chrome.storage.local.get(['activeApp'], (data) => {
  showApp(data.activeApp || 'moto');
});
