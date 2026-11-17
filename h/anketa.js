(function () {
  const API_URL = 'https://script.google.com/macros/s/AKfycbwe5N1tHKfRwE63WnmGClzbCLbff1GdLLJV7BTl2Sx2Ulc1loNfrC6PW6o6H_VQmtg0Yw/exec';

  const KLIC_CACHE = 'anketa-cache';
  const KLIC_HLASOVANO = 'anketa-hlasovano';
  const INTERVAL_MS = 2 * 60 * 1000; // 2 minuty

  let box = null;          // element, kam se anketa vykresluje
  let posledniData = null; // poslední známá data
  let casovac = null;

  // volá se z menu.js po vložení menu
  window.initAnketa = function () {
    box = document.getElementById('anketa-vysledky');
    if (!box) return;

    // 1) Okamžitě vykreslit to, co je v cache (bez čekání na síť)
    const cache = ctiCache();
    if (cache) {
      posledniData = cache.data;
      vykresli(posledniData);
    }

    // 2) Pokud cache chybí nebo je starší než 2 minuty, stáhnout novou verzi
    if (!cache || Date.now() - cache.ts > INTERVAL_MS) {
      nactiVysledky();
    }

    // 3) Každé 2 minuty kontrolovat, jestli se něco změnilo
    if (!casovac) {
      casovac = setInterval(() => {
        if (!document.hidden) nactiVysledky();
      }, INTERVAL_MS);
    }
  };

  function nactiVysledky() {
    fetch(API_URL + '?anketa=1', { cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(data => {
        const zmena = JSON.stringify(data) !== JSON.stringify(posledniData);
        posledniData = data;
        ulozCache(data);
        if (zmena) vykresli(data); // překreslit jen když se něco změnilo
      })
      .catch(() => {
        // Při výpadku necháme poslední známou verzi, chybu ukážeme jen když nic nemáme
        if (box && !posledniData) box.textContent = 'Anketa je nedostupná.';
      });
  }

  function vykresli(data) {
    if (!box) return;
    const celkem = data.reduce((s, v) => s + v.hlasy, 0);
    const hlasovano = localStorage.getItem(KLIC_HLASOVANO);
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
          hlasuj(v.moznost);
        };
        radek.append(a, ` (${v.hlasy} hl.)`);
      }

      const bar = document.createElement('div');
      bar.style.cssText = `background-color:#000080;height:8px;width:${procenta}%;margin-bottom:5px;`;

      box.append(radek, bar);
    });
  }

  function hlasuj(moznost) {
    if (localStorage.getItem(KLIC_HLASOVANO) || !posledniData) return;
    localStorage.setItem(KLIC_HLASOVANO, moznost);

    // Hlas se hned promítne lokálně, bez reloadu stránky
    const polozka = posledniData.find(v => v.moznost === moznost);
    if (polozka) polozka.hlasy += 1;
    ulozCache(posledniData);
    vykresli(posledniData);

    fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'hlasovat', moznost: moznost })
    }).catch(() => {
      // Odeslání selhalo: vrátit hlas zpět, aby šlo hlasovat znovu
      localStorage.removeItem(KLIC_HLASOVANO);
      if (polozka) polozka.hlasy -= 1;
      ulozCache(posledniData);
      vykresli(posledniData);
    });
  }

  function ctiCache() {
    try {
      const c = JSON.parse(localStorage.getItem(KLIC_CACHE));
      return c && Array.isArray(c.data) ? c : null;
    } catch (e) {
      return null;
    }
  }

  function ulozCache(data) {
    try {
      localStorage.setItem(KLIC_CACHE, JSON.stringify({ ts: Date.now(), data: data }));
    } catch (e) {
      // úložiště je plné nebo zakázané, anketa pak funguje jen bez cache
    }
  }
})();