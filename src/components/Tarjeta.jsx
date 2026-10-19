export default function Tarjeta({ className, style, children }) {
	return (<>
		<div className={"card " + className} style={style}>
			{children}
		</div>
	</>);
}
