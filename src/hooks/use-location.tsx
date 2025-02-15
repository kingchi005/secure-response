import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from "react";
import { Geolocation, Position } from "@capacitor/geolocation";

export default function useLocation() {
	const [location, setLocation] = useState<Position["coords"] | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		requestPermissions();
	}, []);
	useEffect(() => {
		let watchId: string;
		Geolocation.watchPosition(
			{ enableHighAccuracy: true },
			({ coords }) => {
				// console.log("Location updated:", latitude, longitude);

				setLocation(coords);
				// toast({
				// 	title: "Location Updated",
				// 	description: `Current location: ${position.coords.latitude.toFixed(
				// 		4
				// 	)}, ${position.coords.longitude.toFixed(4)}`,
				// });
			}
			// (error) => {
			// 	console.error("Location tracking error:", error);
			// 	toast({
			// 		title: "Location Error",
			// 		description:
			// 			"Unable to track location. Please enable location services.",
			// 		variant: "destructive",
			// 	});
			// }
		).then((id) => {
			watchId = id;
		});

		return () => {
			if (watchId) Geolocation.clearWatch({ id: watchId });
		};
	}, [toast]);

	async function requestPermissions() {
		Geolocation.requestPermissions()
			.then((result) => {
				if (result.location == "denied")
					toast({
						title: "Permission Denied",
						description: "Unable to access location",
						variant: "destructive",
					});
			})
			.catch((error) => {
				console.error("Permission denied:", error);
				toast({
					title: "Permission Denied",
					description:
						"Unable to access location. Please turn on your location service",
					variant: "destructive",
				});
			});
	}

	return { location };
}
