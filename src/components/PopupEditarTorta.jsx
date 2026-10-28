import CuadroInput from "./CuadroInput";
import PopupDialogo from "./PopupDialogo";
import Torta from "../model/Torta.mjs";

const validacionesForm = {
	nombre: [[(v) => v.trim().length > 0, "El nombre es obligatorio."]],
	precio: [[(v) => Number(v) > 0, "El precio debe ser mayor a 0."]],
	imagen: [[(v) => v.trim().length > 0, "La imagen es obligatoria."]],
	descripcion: [[(v) => v.trim().length > 0, "La descripción es obligatoria."]],
};

export default function PopupEditarTorta({
	open,
	form,
	errors,
	isNew = false,
	setForm,
	setErrors,
	onClose,
	onSave,
	onDelete,
	onReset,
}) {
	const categorias = Torta.Categoria.listaCategorias;

	function manejarCambio(campo, valor) {
		setForm((prev) => ({ ...prev, [campo]: valor }));
		setErrors((prev) => ({ ...prev, [campo]: "" }));
	}

	return (
		<PopupDialogo
			open={open}
			title={isNew ? "Nueva torta" : "Editar producto"}
			style={{ width: "min(90vw, 46rem)" }}
			onClose={onClose}
		>
			<div style={{ display: "grid", gap: "0.9rem" }}>
				<CuadroInput
					nameId="nombre"
					label="Nombre"
					placeholder="Nombre de la torta"
					value={form.nombre ?? ""}
					onChange={(e) => manejarCambio("nombre", e.target.value)}
					validaciones={validacionesForm.nombre}
					error={errors.nombre ?? ""}
					setError={(mensaje) => setErrors((prev) => ({ ...prev, nombre: mensaje }))}
					onInput={() => setErrors((prev) => ({ ...prev, nombre: "" }))}
				/>

				<div className="form-group" style={{ margin: 0 }}>
					<label htmlFor="categoria">Categoría</label>
					<select
						id="categoria"
						name="categoria"
						value={form.categoria ?? categorias[0]}
						onChange={(e) => manejarCambio("categoria", e.target.value)}
						style={errors.categoria ? { border: "1px solid var(--danger)" } : {}}
					>
						{categorias.map((categoria) => (
							<option key={categoria} value={categoria}>{categoria}</option>
						))}
					</select>
					{errors.categoria && <small style={{ color: "var(--danger)" }}>{errors.categoria}</small>}
				</div>

				<CuadroInput
					nameId="precio"
					label="Precio"
					placeholder="15000"
					value={form.precio ?? 0}
					onChange={(e) => manejarCambio("precio", Number(e.target.value) || 0)}
					validaciones={validacionesForm.precio}
					error={errors.precio ?? ""}
					setError={(mensaje) => setErrors((prev) => ({ ...prev, precio: mensaje }))}
					onInput={() => setErrors((prev) => ({ ...prev, precio: "" }))}
				/>

				<CuadroInput
					nameId="imagen"
					label="Imagen"
					placeholder="ruta/imagen.jpg"
					value={form.imagen ?? ""}
					onChange={(e) => manejarCambio("imagen", e.target.value)}
					validaciones={validacionesForm.imagen}
					error={errors.imagen ?? ""}
					setError={(mensaje) => setErrors((prev) => ({ ...prev, imagen: mensaje }))}
					onInput={() => setErrors((prev) => ({ ...prev, imagen: "" }))}
				/>

				<CuadroInput
					nameId="descripcion"
					label="Descripción"
					placeholder="Descripción de la torta"
					value={form.descripcion ?? ""}
					onChange={(e) => manejarCambio("descripcion", e.target.value)}
					validaciones={validacionesForm.descripcion}
					error={errors.descripcion ?? ""}
					setError={(mensaje) => setErrors((prev) => ({ ...prev, descripcion: mensaje }))}
					onInput={() => setErrors((prev) => ({ ...prev, descripcion: "" }))}
				/>
			</div>

			<div className="dialog-actions" style={{ marginTop: "1rem" }}>
				{!isNew && (
					<button
						type="button"
						className="danger-btn dialog-button"
						onClick={onDelete}
					>
						Eliminar
					</button>
				)}
				<button type="button" className="btn btn-secondary dialog-button" onClick={onReset}>
					{isNew ? "Vaciar" : "Restablecer"}
				</button>
				<button type="button" className="btn btn-secondary dialog-button" onClick={onClose}>
					Cancelar
				</button>
				<button type="button" className="btn dialog-button" onClick={onSave}>
					{isNew ? "Crear" : "Guardar"}
				</button>
			</div>
		</PopupDialogo>
	);
}
