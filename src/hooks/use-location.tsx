import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from "react";

export default function useLocation() {
	const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		let watchId: number;
		if ("geolocation" in navigator) {
			watchId = navigator.geolocation.watchPosition(
				(position) => {
					setLocation(position.coords);
					// toast({
					// 	title: "Location Updated",
					// 	description: `Current location: ${position.coords.latitude.toFixed(
					// 		4
					// 	)}, ${position.coords.longitude.toFixed(4)}`,
					// });
				},
				(error) => {
					console.error("Location tracking error:", error);
					toast({
						title: "Location Error",
						description:
							"Unable to track location. Please enable location services.",
						variant: "destructive",
					});
				}
			);
		}
		return () => {
			if (watchId) navigator.geolocation.clearWatch(watchId);
		};
	}, [toast]);

	return { location };
}
