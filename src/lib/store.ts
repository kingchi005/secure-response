import { create } from "zustand";
import { compute, computed } from "zustand-computed-state";
import { getIncidents, getResponders, Incident, Responder } from "./db";

type AuthStore = {
	email: string;
	isAuthenticated: boolean;
	logOut(): void;
	authenticate(email: string): void;
};

export const useAuthStore = create<AuthStore>()(
	// persist(
	computed((set, get) =>
		compute<AuthStore>({
			email: "kingchi005@gmail.com",
			authenticate(email) {
				set((st) => ({ ...st, email }));
			},
			logOut() {
				set((st) => ({ ...st, email: "" }));
			},
			get isAuthenticated() {
				const email = <string>this.email;
				return !!email;
			},
		})
	)
);

type IncidentStore = {
	data: Incident[];
	findById(id: string): Incident;
	updateStatus(id: string, status: Incident["status"]): void;
	init(): Promise<void>;
};

export const useIncidentStore = create<IncidentStore>()(
	// persist(
	computed((set, get) =>
		compute<IncidentStore>({
			data: [],
			async init() {
				// const interval = setInterval(async () => {
				const data = await getIncidents();
				set((st) => ({ ...st, data }));
				// }, 500);
			},
			findById(id) {
				const data = get().data;
				return data.find((item) => item.id === id) || null;
			},
			updateStatus(id, status) {
				const data = get().data.map((incident) =>
					incident.id === id ? { ...incident, status } : incident
				);
				set((st) => ({ ...st, data }));
			},
		})
	)
);

type ResponderStore = {
	data: Responder[];
	findByEmail(email: string): Responder;
	init(): Promise<void>;
};

export const useResponderStore = create<ResponderStore>()(
	// persist(
	computed((set, get) =>
		compute<ResponderStore>({
			data: [],
			async init() {
				const data = await getResponders();
				set((st) => ({ ...st, data }));
			},
			findByEmail(email) {
				const data = get().data;
				return data.find((resp) => resp.email === email) || null;
			},
		})
	)
);
