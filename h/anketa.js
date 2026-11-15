(function () {
  const URL = 'https://script.google.com/macros/s/AKfycbwe5N1tHKfRwE63WnmGClzbCLbff1GdLLJV7BTl2Sx2Ulc1loNfrC6PW6o6H_VQmtg0Yw/exec';

  // volá se z loaderu po vložení menu
  window.initAnketa = function () {
    const box = document.getElementById('anketa-vysledky');
    if (box) nactiVysledky(box);
  };

  function nactiVysledky(box) {
    fetch(URL + '?anketa=1')
      .then(r => r.json())
      .then(data => vykresli(box, data))
      .catch(() => { box.textContent = 'Anketa je nedostupná.'; });
  }

  function vykresli(box, data) {
    const celkem = data.reduce((s, v) => s + v.hlasy, 0);
    const hlasovano = localStorage.getItem('anketa-hlasovano');
    box.textContent = '';

    data.forEach(v => {
      const procenta = celkem ? Math.round(v.hlasy / celkem * 100) : 0;

      const radek = document.createElement('div');
      radek.style.marginBottom = '2px';

      if (hlasovano) {
        radek.textContent = `${v.moznost} (${v.hlasy} hl.)`;
      } else {
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = v.moznost;
        a.onclick = e => {
          e.preventDefault();
          hlasuj(box, v.moznost);
        };
        radek.append(a, ` (${v.hlasy} hl.)`);
      }

      const bar = document.createElement('div');
      bar.style.cssText = `background-color:#000080;height:8px;width:${procenta}%;margin-bottom:5px;`;

      box.append(radek, bar);
    });
  }

  function hlasuj(box, moznost) {
  if (localStorage.getItem('anketa-hlasovano')) return;
  localStorage.setItem('anketa-hlasovano', moznost);

  box.textContent = 'Díky za hlas, načítám výsledky...';

  fetch(URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({ action: 'hlasovat', moznost: moznost })
  })
    .then(() => setTimeout(() => location.reload(), 1500))
    .catch(() => {
      localStorage.removeItem('anketa-hlasovano');
      nactiVysledky(box);
    });
}
})();