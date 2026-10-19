export default function Boton({
	type = undefined,
	style = undefined,
	onClick = undefined,
	disabled = false,
	children
}) {
	return (<>
		<button
			className="btn"
			type={type}
			style={style}
			onClick={onClick}
			disabled={disabled}
		>{children}</button>
	</>);
}

export function BotonOscuro({
	type = undefined,
	style = undefined,
	onClick = undefined,
	disabled = false,
	children
}) {
	return (<>
		<button
			className="wine-btn"
			type={type}
			style={style}
			onClick={onClick}
			disabled={disabled}
		>{children}</button>
	</>);
}

export function BotonClaro({
	type = undefined,
	style = undefined,
	onClick = undefined,
	disabled = false,
	children
}) {
	return (<>
		<button
			className="light-btn"
			type={type}
			style={style}
			onClick={onClick}
			disabled={disabled}
		>{children}</button>
	</>);
}

export function BotonPeligro({
	type = undefined,
	style = undefined,
	onClick = undefined,
	disabled = false,
	children
}) {
	return (<>
		<button
			className="danger-btn"
			type={type}
			style={style}
			onClick={onClick}
			disabled={disabled}
		>{children}</button>
	</>);
}
