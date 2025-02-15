import { VoiceRecorder } from "capacitor-voice-recorder";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveIncident } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { EmergencyButton } from "./EmergencyButton";
import useLocation from "@/hooks/use-location";

export const AudioRecorder = () => {
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorder = useRef<MediaRecorder | null>(null);
	const audioChunks = useRef<Blob[]>([]);
	const { location } = useLocation();
	const [audioUrl, setAudioUrl] = useState("");

	const { toast } = useToast();

	useEffect(() => {
		requestPermissions();
	}, []);

	function requestPermissions() {
		VoiceRecorder.requestAudioRecordingPermission()
			.then((result) => {
				// console.log(result.value);
				if (!result.value)
					toast({
						title: "Permission Denied",
						description: "Unable to access microphone",
						variant: "destructive",
					});
			})
			.catch((error) => {
				console.error("Permission denied:", error);
				toast({
					title: "Permission Denied",
					description: "Unable to access microphone",
					variant: "destructive",
				});
			});
	}

	const startRecording = async () => {
		if (isRecording) return;
		VoiceRecorder.startRecording()
			.then(() => {
				setIsRecording(true);
				toast({
					title: "Recording Started",
					description: "Audio recording has begun",
				});
			})
			.catch((error) => {
				console.error("Error accessing microphone:", error);
				toast({
					title: "Recording Error",
					description: "Unable to access microphone",
					variant: "destructive",
				});
			});
	};

	const stopRecording = async () => {
		if (!isRecording) return;
		VoiceRecorder.stopRecording()
			.then(async (result) => {
				setIsRecording(false);
				const audioUrl = `data:${result.value.mimeType};base64,${result.value.recordDataBase64}`;
				setAudioUrl(audioUrl);

				toast({
					title: "Recording Stopped",
					description: "Audio has been saved",
				});

				await saveIncident({
					id: uuidv4(),
					category: "emergency",
					description: `Voice recording`,
					timestamp: new Date().toISOString(),
					status: "pending",
					image: "",
					hasMedia: false,
					isAnonymous: false,
					audioUrl,
					latitude: location.latitude,
					longitude: location.longitude,
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<>
			<EmergencyButton isRecording={isRecording} />
			<div className="space-y-4">
				<Button
					onClick={isRecording ? stopRecording : startRecording}
					variant={isRecording ? "destructive" : "default"}
				>
					{isRecording ? "Stop Recording" : "Start Recording"}
				</Button>
			</div>

			{/* {audioUrl && (
				<audio controls>
					<source src={audioUrl} type="audio/mpeg" />
					Your browser no support audio element.
				</audio>
			)} */}
		</>
	);
};
