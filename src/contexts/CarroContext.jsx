import { createContext, useEffect, useReducer, useState } from "react";
import PopupConfirmar from "../components/PopupConfirmar";
import Torta from "../model/Torta.mjs";

const initialState = {
	items: [],
	total: 0,
};

function loadCarrito() {
	if (typeof window === "undefined") return initialState;

	try {
		const carroJson = localStorage.getItem("carrito");
		if (!carroJson) return initialState;

		const itemsGuardados = JSON.parse(carroJson);
		if (!Array.isArray(itemsGuardados)) return initialState;

		const items = itemsGuardados.map((item) => ({
			...item,
			quantity: Number(item.quantity ?? 1),
			precio: Number(item.precio ?? 0),
		}));

		const total = items.reduce((sum, item) => sum + item.precio * item.quantity, 0);
		return { items, total };
	} catch {
		console.warn("error al cargar carro, formato no valido");
		return initialState;
	}
}

function carroReducer(state, action) {
	switch (action.type) {
		case "AGREGAR": {
			const item = action.payload;
			if (!item || typeof item.precio !== "number") return state;

			const idNormalizado = Number(item.id);
			const itemExistente = state.items.find((producto) => Number(producto.id) === idNormalizado);
			const items = itemExistente
				? state.items.map((producto) =>
					Number(producto.id) === idNormalizado
						? { ...producto, id: idNormalizado, quantity: Number(producto.quantity ?? 1) + 1 }
						: producto
				)
				: [...state.items, { ...item, id: idNormalizado, quantity: 1 }];

			const total = items.reduce((sum, producto) => sum + Number(producto.precio) * Number(producto.quantity ?? 1), 0);
			return { items, total };
		}
		case "INCREMENTAR": {
			const id = Number(action.payload);
			const items = state.items.map((producto) =>
				Number(producto.id) === id
					? { ...producto, quantity: Number(producto.quantity ?? 1) + 1 }
					: producto
			);
			const total = items.reduce((sum, producto) => sum + Number(producto.precio) * Number(producto.quantity ?? 1), 0);
			return { items, total };
		}
		case "DISMINUIR": {
			const id = Number(action.payload);
			const items = state.items.flatMap((producto) => {
				if (Number(producto.id) !== id) return [producto];
				const nextQuantity = Number(producto.quantity ?? 1) - 1;
				return nextQuantity <= 0 ? [] : [{ ...producto, quantity: nextQuantity }];
			});
			const total = items.reduce((sum, producto) => sum + Number(producto.precio) * Number(producto.quantity ?? 1), 0);
			return { items, total };
		}
		case "ELIMINAR": {
			const id = Number(action.payload);
			const items = state.items.filter((producto) => Number(producto.id) !== id);
			const total = items.reduce((sum, producto) => sum + Number(producto.precio) * Number(producto.quantity ?? 1), 0);
			return { items, total };
		}
		case "VACIAR":
			return initialState;
		default:
			return state;
	}
}

export const CarroContext = createContext({
	carro: initialState,
	agregarItem: () => { },
	quitarItem: () => { },
	incrementarItem: () => { },
	disminuirItem: () => { },
	vaciarCarrito: () => { }
});

export function CarroProvider({ children }) {
	const [carro, dispatch] = useReducer(carroReducer, undefined, loadCarrito);
	const [confirmState, setConfirmState] = useState(null);

	useEffect(() => {
		localStorage.setItem("carrito", JSON.stringify(carro.items));
	}, [carro.items]);

	function confirmarAccion({ title, mensaje, onConfirm }) {
		setConfirmState({ title, mensaje, onConfirm });
	}

	function agregarItem(item) {
		if (carro.items.some((x) => Number(x.id) === Number(item.id)))
			dispatch({ type: "INCREMENTAR", payload: item.id });
		else
			dispatch({ type: "AGREGAR", payload: item });
	}

	function incrementarItem(id) {
		dispatch({ type: "INCREMENTAR", payload: Number(id) });
	}

	function disminuirItem(id) {
		const producto = carro.items.find((item) => Number(item.id) === Number(id));
		if (!producto) return;

		if (Number(producto.quantity ?? 1) <= 1) {
			const torta = Torta.porId(Number(id));
			confirmarAccion({
				title: "Eliminar producto",
				mensaje: torta ? `¿Eliminar '${torta.nombre}' del carro?` : "¿Eliminar este producto del carro?",
				onConfirm: () => dispatch({ type: "ELIMINAR", payload: Number(id) }),
			});
			return;
		}

		dispatch({ type: "DISMINUIR", payload: Number(id) });
	}

	function quitarItem(id) {
		const torta = Torta.porId(Number(id));
		confirmarAccion({
			title: "Eliminar producto",
			mensaje: torta ? `¿Eliminar '${torta.nombre}' del carro?` : "¿Eliminar este producto del carro?",
			onConfirm: () => dispatch({ type: "ELIMINAR", payload: Number(id) }),
		});
	}

	function vaciarCarrito() {
		confirmarAccion({
			title: "Vaciar carrito",
			mensaje: "¿Seguro que quieres vaciar el carro de compras?",
			onConfirm: () => dispatch({ type: "VACIAR" }),
		});
	}

	return (
		<CarroContext.Provider value={{ carro, agregarItem, quitarItem, incrementarItem, disminuirItem, vaciarCarrito }}>
			{children}
			{confirmState && (
				<PopupConfirmar
					open={true}
					title={confirmState.title}
					mensaje={confirmState.mensaje}
					onConfirm={() => {
						confirmState.onConfirm?.();
						setConfirmState(null);
					}}
					onCancel={() => setConfirmState(null)}
					onClose={() => setConfirmState(null)}
				/>
			)}
		</CarroContext.Provider>
	);
}
