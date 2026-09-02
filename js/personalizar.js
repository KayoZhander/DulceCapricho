document.addEventListener('DOMContentLoaded', ()=> {
    const form = document.getElementById('form-personalizar');
    const mensajeEstado = document.createElement('div');
    mensajeEstado.className = 'form-mensaje';
    form.appendChild(mensajeEstado);

    form.addEventListener('submit',(e)=> {
        e.preventDefault();

        const torta = document.getElementById('torta').value;
        const tamano = document.getElementById('tamano').value;
        const bizcocho = document.getElementById('bizcocho').value;
        const cobertura = document.getElementById('cobertura').value;
        const dedicatoria = document.getElementById('dedicatoria').value.trim;

        const rellenosSeleccionados = Array.from(
            document.querySelectorAll('input[name="relleno"]:checked')
        ).map(input => input.value);

        const errores = [];

        if (!torta) errores.push('Elige una torta base.');
        if (!tamano) errores.push('Elige un tamaño.');
        if (!bizcocho) errores.push('Elige un tipo de bizcocho.');
        if (!cobertura) errores.push('Elige una cobertura.');
        if (rellenosSeleccionados.length === 0) errores.push('Elige al menos un relleno.');

        if (errores.length > 0) {
            mostrarMensaje(errores.join(' '), 'error');
            return;
        }

        const resumen = `
            <strong>Personalizacion guardada!</strong><br>
            Torta: ${torta}<br>
            Tamaño: ${tamano}<br>
            Bizcocho: ${bizcocho}<br>
            Rellenos: ${rellenosSeleccionados.join(', ')}<br>
            Cobertura: ${Cobertura}<br>
            ${dedicatoria ? `Dedicatoria: "${dedicatoria}` : 'Sin dedicatoria'}

        `;

        mostrarMensaje(resumen, 'exito');
    });

    function mostrarMensaje(contenido,tipo){
        mostrarEstado.innerHTML = contenido;
        mensajeEstad.className= `form-mensaje ${tipo}`;
    }
})
