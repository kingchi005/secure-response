import { EmergencyButton } from "@/components/EmergencyButton";
import { IncidentReport } from "@/components/IncidentReport";
import { RespondersList } from "@/components/RespondersList";
import { AudioRecorder } from "@/components/AudioRecorder";
import { IncidentDashboard } from "@/components/IncidentDashboard";

const Index = () => {
	return (
		<div className="min-h-screen bg-background p-4">
			<div className="container mx-auto space-y-8">
				<header className="text-center mb-8">
					<h1 className="text-3xl font-bold">Emergency Response Network</h1>
					<p className="text-gray-500 mt-2">24/7 Emergency Assistance</p>
				</header>

				<div className="flex flex-col items-center space-y-8">
					<div className="w-full flex flex-col items-center space-y-4">
						<EmergencyButton />
						{/* <AudioRecorder /> */}
					</div>

					<div className="w-full grid gap-8 md:grid-cols-2">
						<div className="space-y-8">
							<IncidentReport />
							<RespondersList />
						</div>
						<div>
							<IncidentDashboard />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Index;
