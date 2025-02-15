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
import IncidentPage from "./pages/IncidentPage";
import { useToast } from "./hooks/use-toast";

const queryClient = new QueryClient();

const App = () => {
	const initIncidentStore = useIncidentStore((st) => st.init);
	const { toast } = useToast();
	useEffect(() => {
		let interval;
		initDB()
			.then(() => {
				fetchIncidents();
			})
			.catch(console.error);

		function fetchIncidents() {
			interval = setInterval(async () => {
				initIncidentStore();
			}, 1000);
		}
		return clearInterval(interval);
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
						<Route path="/admin/:id" element={<IncidentPage />} />
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
