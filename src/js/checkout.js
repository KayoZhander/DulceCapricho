import { CarritoDulceCapricho } from "./carroDeCompras.mjs";

document.addEventListener('DOMContentLoaded', () => {
    const carrito = CarritoDulceCapricho.items;
    const resumenItems = document.getElementById('resumen-items');
    const resumenTotal = document.getElementById('resumen-total-precio');
    const form = document.getElementById('checkout-form');
    const selectEntrega = document.getElementById('tipo-entrega');
    const seccionDireccion = document.getElementById('seccion-direccion');
    const inputDireccion = document.getElementById('direccion');
    const radiosPago = document.querySelectorAll('input[name="pago"]');
    const infoTransferencia = document.getElementById('info-transferencia');
    const inputFecha = document.getElementById('fecha-entrega');

    const hoy = new Date().toISOString().split('T')[0];
    if (inputFecha) inputFecha.min = hoy;

    selectEntrega?.addEventListener('change', (e) => {
        if (e.target.value === 'despacho') {
            seccionDireccion.style.display = 'block';
            inputDireccion.setAttribute('required', 'true');
        } else {
            seccionDireccion.style.display = 'none';
            inputDireccion.removeAttribute('required');
        }
    });

    radiosPago.forEach(radio => {
        radio.addEventListener('change', (e) => {
            infoTransferencia.style.display = e.target.value === 'transferencia' ? 'block' : 'none';
        });
    });

    if (carrito.length === 0) {
        resumenItems.innerHTML = '<li>El carrito está vacío.</li>';
        resumenTotal.innerText = '$0';
    } else {
        resumenItems.innerHTML = carrito.map(item => {
            const cantidad = Number(item.cantidad) || 1;
            const subtotal = (Number(item.precio) || 0) * cantidad;
            return `
                <li>
                    <span>${item.nombre} (x${cantidad})</span>
                    <strong>$${subtotal.toLocaleString('es-CL')}</strong>
                </li>
            `;
        }).join('');

        const total = carrito.reduce((acc, item) => acc + ((Number(item.precio) || 0) * (Number(item.cantidad) || 1)), 0);
        resumenTotal.innerText = `$${total.toLocaleString('es-CL')}`;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (carrito.length === 0) {
            alert('No tienes productos en el carrito para procesar la compra.');
            return;
        }

        const cliente = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const fecha = inputFecha.value;
        const hora = document.getElementById('hora-entrega').value;
        const metodo = document.querySelector('input[name="pago"]:checked').value;
        const tipoEntrega = selectEntrega.value === 'despacho' ? 'Despacho a Domicilio' : 'Retiro en Tienda';
        const direccion = document.getElementById('direccion')?.value.trim() || 'Sin dirección registrada';
        const productos = carrito.map(item => ({
            id: item.id,
            nombre: item.nombre,
            cantidad: Number(item.cantidad) || 1,
            precio: Number(item.precio) || 0
        }));
        const total = carrito.reduce((acc, item) => acc + ((Number(item.precio) || 0) * (Number(item.cantidad) || 1)), 0);

        const pedido = {
            id: Date.now(),
            cliente,
            correo,
            telefono,
            tipoEntrega,
            direccion,
            fechaEntrega: fecha,
            horaEntrega: hora,
            metodoPago: metodo,
            estado: 'pendiente',
            total,
            productos,
            creadoEn: new Date().toISOString()
        };

        const pedidosGuardados = JSON.parse(localStorage.getItem('dulcecapricho_pedidos') || '[]');
        pedidosGuardados.unshift(pedido);
        localStorage.setItem('dulcecapricho_pedidos', JSON.stringify(pedidosGuardados));

        const mensajeMetodo = metodo === 'transferencia'
            ? 'Por favor, realiza la transferencia con los datos proporcionados para validar tu pedido.'
            : 'Pago aprobado exitosamente mediante Webpay.';

        alert(`¡Pedido Confirmado! \n\nGracias por tu compra, ${cliente}.\nModalidad: ${tipoEntrega}\nFecha programada: ${fecha} (${hora})\n\n${mensajeMetodo}`);

        CarritoDulceCapricho.vaciar();
        window.location.href = '/pedidos.html';
    });
});
