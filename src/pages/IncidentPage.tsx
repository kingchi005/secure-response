import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { getIncidentById } from "@/lib/db";
import { getIncidentById, Incident, updateIncidentStatus } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "tailwindcss/tailwind.css";
import { useIncidentStore } from "@/lib/store";
import Header from "@/components/Header";

export default function IncidentPage() {
	const { id } = useParams<{ id: string }>();
	// const incident = useIncidentStore((st) => st.findById)(id);
	const [incident, setIncident] = useState<Incident | null>(null);
	const updateStatus = useIncidentStore((st) => st.updateStatus);
	const [loading, setLoading] = useState(true);
	const [isAction, setIsAction] = useState(false);

	useEffect(() => {
		fetchIncident();
	}, []);

	async function fetchIncident() {
		const res = await getIncidentById(id);
		setLoading(false);
		setIncident(res);
	}

	async function handleRespond() {
		setIsAction(true);
		await updateIncidentStatus(incident.id, "in-progress");
		setIncident((prev) => ({ ...prev, status: "in-progress" }));
		await fetchIncident();
		setIsAction(false);
	}
	async function handleResolve() {
		setIsAction(true);
		await updateIncidentStatus(incident.id, "resolved");
		setIncident((prev) => ({ ...prev, status: "resolved" }));
		await fetchIncident();
		setIsAction(false);
	}

	console.log(incident);

	if (loading)
		return (
			<div className="p-8 h-screen text-xl">
				<div className="rounded-lg animate-pulse h-40  bg-neutral-400" />
				<div className="rounded-lg animate-pulse h-5 mt-6 w-[80vw]  bg-neutral-400" />
				<div className="rounded-lg animate-pulse h-3 mt-5 bg-neutral-400" />
				<div className="rounded-lg animate-pulse h-3 mt-0.5 bg-neutral-400" />
				<div className="rounded-lg animate-pulse h-3 mt-0.5 w-[60vw] bg-neutral-400" />
				<div className="rounded-lg animate-pulse h-5 mt-6 w-[40vw]  bg-neutral-400" />
			</div>
		);

	if (!incident) {
		return <div>Incident not found</div>;
	}

	return (
		<div className="min-h-screen bg-background p-4 pb-10">
			<Header isDetails />
			<div className="">
				<Card
					key={incident.id}
					className="px-4 flex flex-col gap-6 justify-center"
				>
					{incident.image && <img src={incident.image} className="" />}
					<div className="flex justify-between items-start">
						<div className="space-y-5">
							<div className="flex items-center space-x-2">
								<span className="font-semibold capitalize">
									{incident.category}
								</span>
								<span className="text-sm text-gray-500">
									{new Date(incident.timestamp).toLocaleString()}
								</span>
							</div>
							<p className="text-sm">{incident.description}</p>
							{incident.latitude && incident.longitude && (
								<p className="text-sm text-gray-500">
									Location: {incident.latitude.toFixed(4)},{" "}
									{incident.longitude.toFixed(4)}
								</p>
							)}
							{incident.hasMedia && (
								<span className="text-sm text-blue-500">
									Contains media attachments
								</span>
							)}
						</div>
						<div className="flex flex-col items-end space-y-2">
							<span
								className={`text-sm px-2 py-1 rounded-full ${
									incident.status === "pending"
										? "bg-yellow-100 text-yellow-800"
										: incident.status === "in-progress"
										? "bg-blue-100 text-blue-800"
										: "bg-green-100 text-green-800"
								}`}
							>
								{incident.status}
							</span>
							{incident.isAnonymous && (
								<span className="text-xs text-gray-500">Anonymous</span>
							)}
						</div>
					</div>
					{/* <AudioRecord incident={incident} /> */}
					{incident.audioUrl && (
						<audio controls>
							<source src={incident.audioUrl} type="audio/mpeg" />
							Your browser no support audio element.
						</audio>
					)}
					<div className="flex justify-end fixed bottom-3 px-5 right-0">
						{incident.status == "pending" && (
							<Button
								onClick={handleRespond}
								className="bg-blue-800"
								disabled={isAction}
							>
								{isAction ? <>Please wait...</> : <>Respond</>}
							</Button>
						)}
						{incident.status == "in-progress" && (
							<Button
								onClick={handleResolve}
								className="bg-green-800"
								disabled={isAction}
							>
								{isAction ? <>Please wait...</> : <>Resolve</>}
							</Button>
						)}
					</div>
				</Card>
			</div>
		</div>
	);
}
