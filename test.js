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

const pass = await encriptarPassword("julian123");

console.log(pass);
console.log(
	"12b03226a6d8be9c6e8cd5e55dc6c7920caaa39df14aab92d5e3ea9340d1c8a4d3d0b8e4314f1f6ef131ba4bf1ceb9186ab87c801af0d5c95b1befb8cedae2b9"
	=== pass
);
