const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarFormatoCorreo(correo) {
	if (typeof correo !== "string")
		throw new Error("'correo' debe ser de tipo string");
	return correoRegex.test(correo);
}

export function listaDe(array, clase) {
	return Array.isArray(array) && array.every(x => Object.getPrototypeOf(x) === clase.prototype);
}

export async function encriptarPassword(passwd) {
	if (typeof passwd !== "string")
		throw new Error("'passwd' debe ser de tipo string");
	const encoder = new TextEncoder();
	const data = encoder.encode(passwd);

	return await crypto.subtle.digest("SHA-512", data).then(hash => {
		const hArray = Array.from(new Uint8Array(hash));
		const hHex = hArray.map(b => b.toString(16).padStart(2, "0")).join("");
		return hHex;
	});
}
