import { useContext, useEffect, useState } from "react";
import Contenedor from "../components/Contenedor";
import CuadroInput from "../components/CuadroInput";
import Titulo from "../components/Titulo";
import { UsuarioContext } from "../contexts/AuthContext";

function construirFormulario(usuario) {
	const nombreCompleto = usuario
		? [usuario.pnombre, usuario.apaterno, usuario.amaterno].filter(Boolean).join(" ").trim()
		: "";

	return {
		nombre: nombreCompleto,
		email: usuario?.correo ?? "",
		telefono: usuario?.telefono ?? "",
		mensaje: "",
	};
}

export default function Contacto() {
	const { usuario } = useContext(UsuarioContext);
	const [form, setForm] = useState(() => construirFormulario(usuario));
	const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

	useEffect(() => {
		setForm(construirFormulario(usuario));
	}, [usuario]);

	function onChange(e) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		if (mensaje.texto)
			setMensaje({ tipo: "", texto: "" });
	}

	function onSubmit(e) {
		e.preventDefault();
		setMensaje({
			tipo: "exito",
			texto: "Mensaje enviado. Pronto nos pondremos en contacto contigo.",
		});
	}

	return (<>
		<div className="page-padding">
			<Titulo titulo="Contacto" subtitulo="¿Tienes alguna duda o sugerencia? Contáctanos." />
			<Contenedor>
				<main className="Contacto">
					<div className="contacto-container">
						<form id="form-contacto" className="form-contacto" onSubmit={onSubmit}>
							<CuadroInput
								required
								nameId="nombre"
								label="Nombre"
								placeholder="Tu nombre"
								value={form.nombre}
								onChange={onChange}
							/>
							<CuadroInput
								required
								nameId="email"
								label="Correo electrónico"
								placeholder="correo@gmail.com"
								value={form.email}
								onChange={onChange}
							/>
							<CuadroInput
								nameId="telefono"
								label="Teléfono"
								placeholder="+56912345678"
								value={form.telefono}
								onChange={onChange}
							/>
							<div className="campo">
								<label htmlFor="mensaje">Mensaje</label>
								<textarea
									id="mensaje"
									name="mensaje"
									rows="6"
									required
									value={form.mensaje}
									onChange={onChange}
									style={{ fontSize: "1rem", resize: "none" }}
								></textarea>
							</div>
							<button type="submit" className="btn">Enviar mensaje</button>
							{mensaje.texto && (
								<div className={`form-mensaje ${mensaje.tipo}`}>
									{mensaje.texto}
								</div>
							)}
						</form>
						<div className="info-contacto">
							<h2>Otras formas de contacto</h2>
							<p><strong>Dirección:</strong> Calle Armando Casas 123, Viña del Mar</p>
							<p><strong>Teléfono:</strong> +56 9 1234 5678</p>
							<p><strong>Correo:</strong> contacto@dulcecapricho.cl</p>
							<p><strong>Horario:</strong> Lunes a Sábado, 9:00 - 20:00</p>
						</div>
					</div>
				</main>
			</Contenedor>
		</div>
	</>);
}
