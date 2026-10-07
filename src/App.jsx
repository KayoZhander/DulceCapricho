import { Header, Footer } from "./components/HeadFoot.jsx";
import { Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio.jsx";
import Tortas from "./pages/Tortas.jsx";
import Login from "./pages/Login.jsx";
import E404 from "./pages/E404.jsx";
import "./styles/base.css";

export default function App() {
	return (<>
		<Header />
		<main>
			<Routes>
				<Route path="/" element={<Inicio />} />
				<Route path="/tortas" element={<Tortas />} />
				<Route path="/login" element={<Login />} />
				<Route path="*" element={<E404 />} />
			</Routes>
		</main>
		<Footer />
	</>);
}
