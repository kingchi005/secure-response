import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { saveIncident } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import useLocation from "@/hooks/use-location";

export const EmergencyButton = ({ isRecording }: { isRecording?: boolean }) => {
	const [isActive, setIsActive] = useState(false);
	const { location } = useLocation({ isActive });
	const [timer, setTimer] = useState(0);
	const { toast } = useToast();

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isActive) {
			interval = setInterval(() => {
				setTimer((prev) => prev + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isActive]);

	useEffect(() => {
		setIsActive(isRecording);
	}, [isRecording]);

	const handleEmergency = async () => {
		if (isActive) {
			// Stop SOS mode
			setIsActive(false);
			setTimer(0);

			// Save incident to database
			if (location) {
				await saveIncident({
					id: uuidv4(),
					category: "emergency",
					description: `Emergency SOS activated for ${formatTime(timer)}`,
					timestamp: new Date().toISOString(),
					status: "pending",
					image: "",
					hasMedia: false,
					isAnonymous: false,
					audioUrl: "",
					latitude: location.latitude,
					longitude: location.longitude,
				});
			}

			toast({
				title: "Emergency Mode Deactivated",
				description: "Location tracking stopped",
			});
		} else {
			// Start SOS mode
			setIsActive(true);
			toast({
				title: "Emergency Mode Activated",
				description: "Location tracking started",
				duration: null,
				variant: "destructive",
			});
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	return (
		<div className="space-y-4">
			<Button
				className={`w-32 h-32 rounded-full text-white text-xl font-bold transition-all duration-300 relative ${
					isActive
						? "bg-emergency animate-pulse hover:bg-emergency"
						: "bg-emergency hover:bg-emergency-hover"
				}`}
				onClick={handleEmergency}
			>
				{isActive ? (
					<div className="flex flex-col items-center">
						<AlertTriangle className="w-8 h-8 mb-2" />
						<span>{formatTime(timer)}</span>
					</div>
				) : (
					"SOS"
				)}
			</Button>
			{isActive && location && (
				<div className="text-sm text-gray-500">
					<p>Lat: {location.latitude.toFixed(4)}</p>
					<p>Long: {location.longitude.toFixed(4)}</p>
				</div>
			)}
		</div>
	);
};
