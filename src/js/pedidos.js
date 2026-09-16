const STORAGE_KEY = 'dulcecapricho_pedidos';

const estados = {
    pendiente: { label: 'Pendiente', className: 'estado-pendiente' },
    confirmado: { label: 'Confirmado', className: 'estado-confirmado' },
    'en preparación': { label: 'En preparación', className: 'estado-en-preparacion' },
    enviado: { label: 'Enviado', className: 'estado-enviado' },
    entregado: { label: 'Entregado', className: 'estado-entregado' },
    cancelado: { label: 'Cancelado', className: 'estado-cancelado' }
};

const pedidosPorDefecto = [
    {
        id: 1001,
        cliente: 'María López',
        correo: 'maria@ejemplo.com',
        telefono: '+56 9 1234 5678',
        tipoEntrega: 'Retiro en Tienda',
        direccion: 'Sin dirección registrada',
        fechaEntrega: '2026-09-20',
        horaEntrega: '15:00 - 18:00',
        metodoPago: 'webpay',
        estado: 'pendiente',
        total: 22000,
        creadoEn: '2026-09-16T12:00:00.000Z',
        productos: [
            { nombre: 'Torta de chocolate', cantidad: 1, precio: 18000 },
            { nombre: 'Muffin', cantidad: 2, precio: 2000 }
        ]
    },
    {
        id: 1002,
        cliente: 'Carlos Rojas',
        correo: 'carlos@ejemplo.com',
        telefono: '+56 9 9876 5432',
        tipoEntrega: 'Despacho a Domicilio',
        direccion: 'Av. Providencia 1234, Santiago',
        fechaEntrega: '2026-09-18',
        horaEntrega: '10:00 - 12:00',
        metodoPago: 'transferencia',
        estado: 'confirmado',
        total: 32000,
        creadoEn: '2026-09-15T09:30:00.000Z',
        productos: [
            { nombre: 'Torta clásica', cantidad: 1, precio: 26000 },
            { nombre: 'Alfajores', cantidad: 3, precio: 2000 }
        ]
    }
];

const obtenerPedidos = () => {
    try {
        const guardados = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (Array.isArray(guardados) && guardados.length > 0) {
            return guardados;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidosPorDefecto));
        return pedidosPorDefecto;
    } catch {
        return pedidosPorDefecto;
    }
};

const formatearPrecio = (valor) => new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
}).format(Number(valor) || 0);

const renderPedido = (pedido) => {
    const estado = estados[pedido.estado] || estados.pendiente;
    const productos = Array.isArray(pedido.productos) ? pedido.productos : [];

    const card = document.createElement('article');
    card.className = 'pedido-card';
    card.innerHTML = `
        <div class="pedido-top">
            <h2>Pedido #${pedido.id}</h2>
            <span class="estado-badge ${estado.className}">${estado.label}</span>
        </div>

        <div class="pedido-grid">
            <div class="meta-block">
                <span class="meta-label">Cliente</span>
                <span class="meta-value">${pedido.cliente || 'Cliente sin nombre'}</span>
            </div>
            <div class="meta-block">
                <span class="meta-label">Entrega</span>
                <span class="meta-value">${pedido.tipoEntrega || 'Sin información'}</span>
            </div>
            <div class="meta-block">
                <span class="meta-label">Fecha</span>
                <span class="meta-value">${pedido.fechaEntrega || 'Sin fecha'}</span>
            </div>
            <div class="meta-block">
                <span class="meta-label">Horario</span>
                <span class="meta-value">${pedido.horaEntrega || 'Sin horario'}</span>
            </div>
        </div>

        <ul class="pedido-items">
            ${productos.map(item => `
                <li>
                    <span class="item-name">${item.nombre} x${item.cantidad || 1}</span>
                    <span class="item-total">${formatearPrecio((Number(item.precio) || 0) * (Number(item.cantidad) || 1))}</span>
                </li>
            `).join('') || '<li><span class="item-name">Sin productos registrados</span></li>'}
        </ul>

        <div class="pedido-footer">
            <div class="pedido-total">
                <strong>Total:</strong> ${formatearPrecio(pedido.total || 0)}
            </div>
            <div class="meta-value">${pedido.metodoPago === 'transferencia' ? 'Transferencia' : 'Webpay'}</div>
        </div>
    `;

    return card;
};

const renderPedidos = () => {
    const contenedor = document.querySelector('#pedidos-lista');
    const filtro = document.querySelector('#filtro-estado');
    if (!contenedor || !filtro) return;

    const pedidos = obtenerPedidos();
    const filtroActual = filtro.value;
    const pedidosFiltrados = filtroActual === 'todos'
        ? pedidos
        : pedidos.filter(pedido => (pedido.estado || 'pendiente') === filtroActual);

    contenedor.innerHTML = '';

    if (!pedidosFiltrados.length) {
        contenedor.innerHTML = '<div class="empty-state">No tienes pedidos con ese estado.</div>';
        return;
    }

    pedidosFiltrados
        .sort((a, b) => new Date(b.creadoEn || 0) - new Date(a.creadoEn || 0))
        .forEach(pedido => contenedor.appendChild(renderPedido(pedido)));
};

document.addEventListener('DOMContentLoaded', () => {
    const filtro = document.querySelector('#filtro-estado');
    if (filtro) {
        filtro.addEventListener('change', renderPedidos);
    }

    renderPedidos();
});
