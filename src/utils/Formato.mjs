export function formatearPrecio(valor) {
	return new Intl.NumberFormat("es-CL", {
		style: "currency",
		currency: "CLP",
		maximumFractionDigits: 0
	}).format(Number(valor) || 0);
}


export function formatearFecha(fecha) {
	const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha ?? "");
	return partes ? `${partes[3]}/${partes[2]}/${partes[1]}` : (fecha || "Sin fecha");
}