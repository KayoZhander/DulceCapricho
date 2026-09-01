document.addEventListener('DOMContentLoaded', () =>{
    const slides = document.querySelectorAll('.hero-slide');
    const btnPrev = document.getElementById('hero-btn-prev');
    const btnNext = document.getElementById('hero-btn-next');
    const dotsContainer = document.getElementById('hero-dots');

    let indiceActual = 0;
    const total = slides.length;

    slides[0].classList.add('activo');

    slides.forEach((_,i) =>{
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('activo');
        dot.addEventListener('click', () => irASlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots =dotsContainer.querySelectorAll('.dot');

    function actualizarCarrusel(){
        slider.forEach((slide, i) => {
            slide.classList.toggle('activo', i === indiceActual);
        });
        dots.forEach((dot,i) => {
            dot.classList.toggle('activo', i === indiceActual);
        });
    }

    function irASlide(i) {
        indiceActual = i;
        actualizarCarrusel();
    }

    function siguiente(){
        indiceActual = (indiceActual + 1) %total;
        actualizarCarrusel();
    }

        function anterior(){
        indiceActual = (indiceActual - 1 + total) %total;
        actualizarCarrusel();
    }

    btnNext.addEventListener('click', siguiente)
    btnPrev.addEventListener('click', anterior);

    setInterval(siguiente, 5000)
});
