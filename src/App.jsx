import { Header, Footer } from "./components/HeadFoot.jsx";
import { Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio.jsx";
import Tortas from "./pages/Tortas.jsx";
import Login from "./pages/Login.jsx";
import E404 from "./pages/E404.jsx";
import Recuperar from "./pages/Recuperar.jsx";
import Registrar from "./pages/Registrar.jsx";
import Cuenta from "./pages/Cuenta.jsx";
import Carrito from "./pages/Carrito.jsx";
import Checkout from "./pages/Checkout.jsx";
import Contacto from "./pages/Contacto.jsx";
import Pedidos from "./pages/Pedidos.jsx";
import EditarCuenta from "./pages/EditarCuenta.jsx";
import RecuperarPassword from "./pages/RecuperarPassword.jsx";
import "./styles/base.css";

export default function App() {
	return (<>
		<Header />
		<main>
			<Routes>
				<Route index element={<Inicio />} />
				<Route path="/tortas" element={<Tortas />} />
				<Route path="/contacto" element={<Contacto />} />
				<Route path="/pedidos" element={<Pedidos />} />
				<Route path="/carro" element={<Carrito />} />
				<Route path="/checkout" element={<Checkout />} />
				<Route path="/login" element={<Login />} />
				<Route path="/registrar" element={<Registrar />} />
				<Route path="/recuperar" element={<Recuperar />} />
				<Route path="/recuperar/passwd" element={<RecuperarPassword />} />
				<Route path="/cuenta" element={<Cuenta />} />
				<Route path="/cuenta/editar" element={<EditarCuenta />} />
				<Route path="*" element={<E404 />} />
			</Routes>
		</main>
		<Footer />
	</>);
}
