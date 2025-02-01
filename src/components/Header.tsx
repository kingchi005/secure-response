import React from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store";

export default function Header({ isDetails }: { isDetails?: boolean }) {
	const isAuthenticated = useAuthStore((st) => st.isAuthenticated);
	const logOut = useAuthStore((st) => st.logOut);
	const navigate = useNavigate();
	return (
		<header className="text-center mb-8">
			{isDetails ? (
				<div className="flex items-center gap-3 border-b border-primary/40 pb-5 mb-3">
					<img
						onClick={() => navigate(-1)}
						src="/back-btn.svg"
						className="size-6"
					/>
					<h2 className="text-2xl font-bold">Incident Details</h2>
				</div>
			) : (
				<div className="flex justify-end gap-3 border-b border-primary/40 pb-5 mb-3">
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
						<>
							{location.pathname !== "/admin" && (
								<Link
									className="px-4 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-xs"
									to={"/admin"}
								>
									Dashboard
								</Link>
							)}
							<button
								className="px-4 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-xs"
								onClick={logOut}
							>
								Logout
							</button>
						</>
					)}
				</div>
			)}
			{!isDetails && (
				<div className="pb-6 border-b border-primary/40">
					<h1 className="text-3xl font-bold">Emergency Response Network</h1>
					<p className="text-gray-500 mt-2">24/7 Emergency Assistance</p>
				</div>
			)}
		</header>
	);
}
