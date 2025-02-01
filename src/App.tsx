import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { initDB } from "./lib/db";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { useAuthStore, useIncidentStore } from "./lib/store";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => {
	const initIncidentStore = useIncidentStore((st) => st.init);
	useEffect(() => {
		initDB()
			.then(() => {
				initIncidentStore();
			})
			.catch(console.error);
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<Toaster />
				<Sonner />
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Index />} />
						<Route path="/admin" element={<Admin />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</BrowserRouter>
			</TooltipProvider>
		</QueryClientProvider>
	);
};

export default App;

function Admin() {
	const isAuthenticated = useAuthStore((st) => st.isAuthenticated);
	return isAuthenticated ? <AdminDashboard /> : <Login />;
}
