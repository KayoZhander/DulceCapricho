export default function Titulo({ titulo, subtitulo }) {
	return (<>
		<section className="header-titulo">
			<div>
				<h1>{titulo}</h1>
				<p style={{ color: "var(--cocoa-soft)", marginTop: "6px" }}>
					{subtitulo}
				</p>
			</div>
		</section>
		<hr style={{ marginTop: "0.6rem", marginBottom: "1.4rem", border: "1px solid var(--border)" }} />
	</>);
}
