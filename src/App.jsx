import { Header, Footer } from "./components/HeadFoot.jsx";
import { Route, Routes } from "react-router";
import Inicio from "./pages/Inicio.jsx";
import Tortas from "./pages/Tortas.jsx";
import E404 from "./pages/E404.jsx";
import "./App.css";

export default function App() {
	return (<>
		<Header />
		<main>
			<Routes>
				<Route path="/" element={<Inicio />} />
				<Route path="/tortas" element={<Tortas />} />
				<Route path="*" element={<E404 />} />
			</Routes>
		</main>
		<Footer />
	</>);
}
