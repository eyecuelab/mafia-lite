import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/*" element={
					<QueryClientProvider client={queryClient}>
						<App />
					</QueryClientProvider>
				} />
			</Routes>
		</BrowserRouter>
		<ToastContainer />
	</React.StrictMode>
);
