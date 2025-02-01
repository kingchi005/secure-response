import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResponderStore } from "@/lib/store";

type Responder = {
	id: number;
	name: string;
	role: string;
	distance: number;
	location: {
		lat: number;
		long: number;
	};
	phone: string;
};

const MOCK_RESPONDERS: Responder[] = [
	{
		id: 1,
		name: "John Doe",
		role: "EMT",
		distance: 0.5,
		location: { lat: 40.7128, long: -74.006 },
		phone: "+1234567890",
	},
	{
		id: 2,
		name: "Jane Smith",
		role: "Police Officer",
		distance: 1.2,
		location: { lat: 40.7129, long: -74.0061 },
		phone: "+1987654321",
	},
];

export const RespondersList = () => {
	// const [responders, setResponders] = useState(MOCK_RESPONDERS);
	const responders = useResponderStore((st) => st.data);
	const fetchResponders = useResponderStore((st) => st.init);
	const [userLocation, setUserLocation] =
		useState<GeolocationCoordinates | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		fetchResponders();
	}, []);
	useEffect(() => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setUserLocation(position.coords);
				},
				(error) => {
					console.error("Error getting location:", error);
					toast({
						title: "Location Error",
						description:
							"Unable to get your location. Using default distances.",
						variant: "destructive",
					});
				}
			);
		}
	}, [toast]);

	const calculateDistance = (
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number
	) => {
		const R = 6371; // Earth's radius in km
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
				Math.cos((lat2 * Math.PI) / 180) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	};

	const handleCall = (phone: string, name: string) => {
		toast({
			title: "Calling Responder",
			description: `Initiating call to ${name} (${phone})`,
		});
		window.location.href = `tel:${phone}`;
	};

	return (
		<div className="space-y-4 w-full max-w-md">
			<h2 className="text-2xl font-bold">Nearby Responders</h2>
			<div className="space-y-2">
				{responders.map((responder) => (
					<Card key={responder.id} className="p-4">
						<div className="flex justify-between items-start">
							<div className="space-y-1">
								<h3 className="font-semibold">{responder.name}</h3>
								<p className="text-sm text-gray-500">{responder.role}</p>
								<div className="flex items-center space-x-1 text-sm text-gray-500">
									<MapPin className="w-4 h-4" />
									<span>{`${responder.distance} miles`}</span>
								</div>
							</div>
							<Button
								variant="outline"
								size="sm"
								className="flex items-center space-x-1"
								onClick={() =>
									handleCall(responder.phoneNumber, responder.name)
								}
							>
								<Phone className="w-4 h-4" />
								<span>Call</span>
							</Button>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};
