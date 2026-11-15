const URL = 'https://script.google.com/macros/s/AKfycbwe5N1tHKfRwE63WnmGClzbCLbff1GdLLJV7BTl2Sx2Ulc1loNfrC6PW6o6H_VQmtg0Yw/exec';
const SHEET = 'List 1'; // název listu v tabulce

// Bezpečná funkce pro escapování HTML znaků a uvozovek
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Odeslání nového vzkazu
document.getElementById('f').onsubmit = e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  if (btn.disabled) return;
  btn.disabled = true;

  fetch(URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({
      sheet: SHEET,
      name: document.getElementById('n').value,
      text: document.getElementById('t').value
    })
  }).then(() => {
    setTimeout(() => location.reload(), 3000);
  });
};

// Stažení a zobrazení vzkazů z listu „h“
fetch(`${URL}?sheet=${SHEET}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById('seznam').innerHTML = data.map(v => `
      <p><b>${escapeHtml(v.name)}</b> <small>(${new Date(v.time).toLocaleString()})</small><br>${escapeHtml(v.text)}</p>
    `).join('');
  });