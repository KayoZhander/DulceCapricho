import PopupDialogo from "./PopupDialogo";

export default function PopupConfirmar({
	open = false,
	title = "Confirmar",
	mensaje = "¿Estás seguro?",
	confirmText = "Aceptar",
	cancelText = "Cancelar",
	onConfirm = null,
	onCancel = null,
	onClose = null,
	peligroso = false
}) {
	function cerrar() {
		onCancel?.();
		onClose?.();
	}

	return (
		<PopupDialogo open={open} onClose={cerrar} title={title}>
			<p className="dialog-message">{mensaje}</p>
			<div className="dialog-actions">
				<button
					type="button"
					className="btn btn-secondary dialog-button" onClick={cerrar}
				>{cancelText}</button>
				<button
					type="button"
					className={peligroso ? "danger-btn dialog-btn dialog-button-danger" : "btn dialog-button dialog-button-danger"}
					onClick={() => {
						onConfirm?.();
						onClose?.();
					}}
				>{confirmText}</button>
			</div>
		</PopupDialogo>
	);
}
