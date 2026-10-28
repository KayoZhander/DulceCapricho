import { useEffect, useRef } from "react";

export default function PopupDialogo({
	open = false,
	onClose = null,
	title = null,
	style = undefined,
	children,
	className = "",
}) {
	const dialogRef = useRef(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open && !dialog.open) {
			dialog.showModal();
			return;
		}

		if (!open && dialog.open) {
			dialog.close();
		}
	}, [open]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		function cerrarAlClickFuera(e) {
			try {
				if (e.target === dialog) onClose?.(e);
			} catch {
				if (e.target === dialog) onClose?.();
			}
		};

		function cerrarConEscape(e) {
			try {
				onClose?.(e);
			} catch {
				onClose?.();
			}
		}

		dialog.addEventListener("click", cerrarAlClickFuera);
		dialog.addEventListener("cancel", cerrarConEscape);

		return () => {
			dialog.removeEventListener("click", cerrarAlClickFuera);
			dialog.removeEventListener("cancel", cerrarConEscape);
		};
	}, [onClose]);

	return (
		<dialog ref={dialogRef} className={`dialog ${className}`.trim()}>
			<div className="dialog-panel" style={style}>
				{title && (
					<div className="dialog-header">
						<h3>{title}</h3>
					</div>
				)}
				{children}
			</div>
		</dialog>
	);
}
