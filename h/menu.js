// Spustí skripty vložené přes innerHTML (prohlížeč je jinak neprovede)
function aktivujSkripty(kontejner) {
    kontejner.querySelectorAll('script').forEach(puvodni => {
        const novy = document.createElement('script');
        for (const atribut of puvodni.attributes) {
            novy.setAttribute(atribut.name, atribut.value);
        }
        novy.textContent = puvodni.textContent;
        puvodni.replaceWith(novy);
    });
}

// Načtení menu.html
fetch('menu.html')
    .then(response => response.text())
    .then(htmlString => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // Horní část
        const horniTemplate = doc.getElementById('obsah-horni-cast');
        if (horniTemplate) {
            document.getElementById('slot-horni-cast').innerHTML = horniTemplate.innerHTML;

            const dnes = new Date();
            const den = String(dnes.getDate()).padStart(2, '0');
            const mesic = String(dnes.getMonth() + 1).padStart(2, '0');
            const rok = dnes.getFullYear();

            const elementDatum = document.getElementById('aktualni-datum');
            if (elementDatum) {
                elementDatum.textContent = `${den}. ${mesic}. ${rok}`;
            }
        }

        // Levý panel (TOPlist + anketa)
        const levyTemplate = doc.getElementById('obsah-levy-panel');
        if (levyTemplate) {
            const slot = document.getElementById('slot-levy-panel');
            slot.innerHTML = levyTemplate.innerHTML;
            aktivujSkripty(slot);
            if (window.initAnketa) window.initAnketa();
        }
    })
    .catch(chyba => {
        console.error('Chyba při načítání menu:', chyba);
    });

// UNIX čas
function aktualizujUnixCas() {
    const unixCas = Math.floor(Date.now() / 1000);
    const unixDisplej = document.getElementById('unix-cas-displej');
    if (unixDisplej) {
        unixDisplej.innerText = unixCas;
    }
}
aktualizujUnixCas();
setInterval(aktualizujUnixCas, 1000);