import { IncidentReport } from "@/components/IncidentReport";
import { RespondersList } from "@/components/RespondersList";
import { AudioRecorder } from "@/components/AudioRecorder";
import Header from "@/components/Header";
import { IncidentList } from "@/components/IncidentList";

const Index = () => {
	return (
		<div className="min-h-screen bg-background p-4">
			<div className="container mx-auto space-y-8">
				<Header />
				<div className="flex flex-col items-center space-y-8">
					<div className="w-full flex flex-col items-center space-y-4">
						{/* <EmergencyButton /> */}
						<AudioRecorder />
					</div>

					<div className="w-full grid gap-8 md:grid-cols-2">
						<div className="space-y-8">
							<IncidentReport />
							<RespondersList />
						</div>
						<div>
							<IncidentList />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Index;
