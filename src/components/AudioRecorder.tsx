import { useState, useRef } from "react";
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

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder.current = new MediaRecorder(stream);

			mediaRecorder.current.ondataavailable = (event) => {
				audioChunks.current.push(event.data);
			};

			// mediaRecorder.current.onstop = () => {
			// 	const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
			// 	const audioUrl = URL.createObjectURL(audioBlob);
			// 	// Store locally
			// 	localStorage.setItem("emergency-audio", audioUrl);
			// 	audioChunks.current = [];
			// };

			mediaRecorder.current.onstop = () => {
				const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });

				// Convert Blob to Base64
				const reader = new FileReader();
				reader.readAsDataURL(audioBlob);
				reader.onloadend = async () => {
					// const base64Audio = (reader.result as string[]).split(",")[1]; // Extract base64 part
					// console.log(reader.result);
					setAudioUrl(reader.result as string);

					await saveIncident({
						id: uuidv4(),
						category: "emergency",
						description: `Voice recording`,
						timestamp: new Date().toISOString(),
						status: "pending",
						image: "",
						hasMedia: false,
						isAnonymous: false,
						audioUrl: reader.result as string,
						latitude: location.latitude,
						longitude: location.longitude,
					});

					// Store in localStorage (optional)
					// localStorage.setItem("emergency-audio-base64", base64Audio);
				};

				// Reset audio chunks
				audioChunks.current = [];
			};

			mediaRecorder.current.start();
			setIsRecording(true);

			toast({
				title: "Recording Started",
				description: "Audio recording has begun",
			});
		} catch (error) {
			console.error("Error accessing microphone:", error);
			toast({
				title: "Recording Error",
				description: "Unable to access microphone",
				variant: "destructive",
			});
		}
	};

	// console.log(location);

	const stopRecording = async () => {
		if (mediaRecorder.current && isRecording) {
			mediaRecorder.current.stop();
			mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
			setIsRecording(false);

			toast({
				title: "Recording Stopped",
				description: "Audio has been saved locally",
			});
		}
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
		</>
	);
};
