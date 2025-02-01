import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/lib/store";

export default function Header() {
	const isAuthenticated = useAuthStore((st) => st.isAuthenticated);
	const logOut = useAuthStore((st) => st.logOut);
	return (
		<header className="text-center mb-8">
			<div className="flex justify-end gap-3">
				{location.pathname !== "/" && (
					<Link
						className="px-4 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-xs"
						to={"/"}
					>
						Home
					</Link>
				)}
				{!isAuthenticated && (
					<Link
						className="px-4 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-xs"
						to={"/admin"}
					>
						Login
					</Link>
				)}
				{isAuthenticated && (
					<button
						className="px-4 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-xs"
						onClick={logOut}
					>
						Logout
					</button>
				)}
			</div>
			<h1 className="text-3xl font-bold">Emergency Response Network</h1>
			<p className="text-gray-500 mt-2">24/7 Emergency Assistance</p>
		</header>
	);
}
