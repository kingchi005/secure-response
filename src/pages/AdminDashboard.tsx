import Header from "@/components/Header";
import { IncidentDashboard } from "@/components/IncidentDashboard";
import { IncidentReport } from "@/components/IncidentReport";
import { RespondersList } from "@/components/RespondersList";
import React from "react";

export default function AdminDashboard() {
	return (
		<div className="min-h-screen bg-background p-4">
			<div className="container mx-auto space-y-8">
				<Header />

				<div className="flex flex-col items-center space-y-8">
					<div className="w-full grid gap-8 md:grid-cols-2">
						<div>
							<IncidentDashboard />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
