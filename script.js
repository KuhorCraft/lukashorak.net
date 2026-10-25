document.addEventListener("DOMContentLoaded", function () {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox-close");
    const images = document.querySelectorAll(".gallery-img");

    // Otevření fotky
    images.forEach(img => {
        img.addEventListener("click", function () {
            lightbox.style.display = "block";
            lightboxImg.src = this.src;
        });
    });

    // Zavření tlačítkem Křížek
    closeBtn.addEventListener("click", function () {
        lightbox.style.display = "none";
    });

    // Zavření kliknutím kamkoliv mimo fotku
    lightbox.addEventListener("click", function (e) {
        if (e.target !== lightboxImg) {
            lightbox.style.display = "none";
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeBtn = document.querySelector(".lightbox-close");
    const images = document.querySelectorAll(".gallery-img");

    // Otevření fotky a nastavení popisku
    images.forEach(img => {
        img.addEventListener("click", function () {
            lightbox.style.display = "block";
            lightboxImg.src = this.src;
            
            // Načte text z data-caption, popřípadě z alt
            const captionText = this.getAttribute("data-caption") || this.alt;
            lightboxCaption.textContent = captionText;
        });
    });

    // Zavření tlačítkem Křížek
    closeBtn.addEventListener("click", function () {
        lightbox.style.display = "none";
    });

    // Zavření kliknutím kamkoliv mimo fotku a text popisku
    lightbox.addEventListener("click", function (e) {
        if (e.target !== lightboxImg && e.target !== lightboxCaption) {
            lightbox.style.display = "none";
        }
    });
});