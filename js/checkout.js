document.addEventListener('DOMContentLoaded', () => {
    const carrito = JSON.parse(localStorage.getItem('carrito_dulce_capricho')) || [];
    const resumenItems = document.getElementById('resumen-items');
    const resumenTotal = document.getElementById('resumen-total-precio');
    const form = document.getElementById('checkout-form');
    const selectEntrega = document.getElementById('tipo-entrega');
    const seccionDireccion = document.getElementById('seccion-direccion');
    const inputDireccion = document.getElementById('direccion');
    const radiosPago = document.querySelectorAll('input[name="pago"]');
    const infoTransferencia = document.getElementById('info-transferencia');
    const inputFecha = document.getElementById('fecha-entrega');

    // Restringir fechas pasadas
    const hoy = new Date().toISOString().split('T')[0];
    if (inputFecha) inputFecha.min = hoy;

    // Toggle para campo de dirección según tipo de entrega
    selectEntrega.addEventListener('change', (e) => {
        if (e.target.value === 'despacho') {
            seccionDireccion.style.display = 'block';
            inputDireccion.setAttribute('required', 'true');
        } else {
            seccionDireccion.style.display = 'none';
            inputDireccion.removeAttribute('required');
        }
    });

    // Toggle información para transferencia bancaria
    radiosPago.forEach(radio => {
        radio.addEventListener('change', (e) => {
            infoTransferencia.style.display = e.target.value === 'transferencia' ? 'block' : 'none';
        });
    });

    // Renderizar resumen de la compra
    if (carrito.length === 0) {
        resumenItems.innerHTML = '<li>El carrito está vacío.</li>';
        resumenTotal.innerText = '$0';
    } else {
        resumenItems.innerHTML = carrito.map(item => {
            const cantidad = item.cantidad || 1;
            const subtotal = item.precio * cantidad;
            return `
                <li>
                    <span>${item.nombre} (x${cantidad})</span>
                    <strong>$${subtotal.toLocaleString('es-CL')}</strong>
                </li>
            `;
        }).join('');

        const total = carrito.reduce((acc, item) => acc + (item.precio * (item.cantidad || 1)), 0);
        resumenTotal.innerText = `$${total.toLocaleString('es-CL')}`;
    }

    // Procesar formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (carrito.length === 0) {
            alert('No tienes productos en el carrito para procesar la compra.');
            return;
        }

        const cliente = document.getElementById('nombre').value;
        const fecha = inputFecha.value;
        const hora = document.getElementById('hora-entrega').value;
        const metodo = document.querySelector('input[name="pago"]:checked').value;
        const tipoEntrega = selectEntrega.value === 'despacho' ? 'Despacho a Domicilio' : 'Retiro en Tienda';

        const mensajeMetodo = metodo === 'transferencia'
            ? 'Por favor, realiza la transferencia con los datos proporcionados para validar tu pedido.'
            : 'Pago aprobado exitosamente mediante Webpay.';

        alert(`¡Pedido Confirmado! \n\nGracias por tu compra, ${cliente}.\nModalidad: ${tipoEntrega}\nFecha programada: ${fecha} (${hora})\n\n${mensajeMetodo}`);

        localStorage.removeItem('carrito_dulce_capricho');
        window.location.href = 'index.html';
    });
});
