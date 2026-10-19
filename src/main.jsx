import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UsuarioProvider } from "./contexts/AuthContext.jsx";
import { CarroProvider } from "./contexts/CarroContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<UsuarioProvider>
				<CarroProvider>
					<App />
				</CarroProvider>
			</UsuarioProvider>
		</BrowserRouter>
	</StrictMode>,
);
