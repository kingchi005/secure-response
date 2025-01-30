import { createClient } from "@libsql/client";

// Define strict types for our database
export type IncidentStatus = "pending" | "in-progress" | "resolved";

export interface Incident {
	id: string;
	category: string;
	description: string;
	timestamp: string;
	status: IncidentStatus;
	hasMedia: boolean;
	isAnonymous: boolean;
	latitude: number | null;
	longitude: number | null;
	audioUrl: string | null;
}

// Create a client with a remote database URL
const client = createClient({
	url: "libsql://project-kingchi005.turso.io", // Replace with your Turso database URL
	authToken:
		"eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzgyMzU3NjQsImlkIjoiOWM1YzhlNGYtMTAwMC00YTJhLThjNDMtMTBhMTI4ZDdmODE3In0.svSev-Wow4YB4lx_YZX9O0BmPPxtGbOMrHw-ynLtTRcusSuSJm4pQJR-h_r1q7YZzxY_0wO7r3N4DXDR2vNkDA", // Replace with your auth token
});

export const initDB = async () => {
	try {
		await client.execute(`
      CREATE TABLE IF NOT EXISTS incidents (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        status TEXT CHECK(status IN ('pending', 'in-progress', 'resolved')) NOT NULL,
        hasMedia BOOLEAN NOT NULL,
        isAnonymous BOOLEAN NOT NULL,
        latitude REAL,
        longitude REAL,
        audioUrl TEXT
      )
    `);
		console.log("Database initialized successfully");
	} catch (error) {
		console.error("Failed to initialize database:", error);
		throw error;
	}
};

export const saveIncident = async (incident: Incident): Promise<void> => {
	try {
		await client.execute({
			sql: `
        INSERT INTO incidents (
          id, category, description, timestamp, status, 
          hasMedia, isAnonymous, latitude, longitude, audioUrl
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
			args: [
				incident.id,
				incident.category,
				incident.description,
				incident.timestamp,
				incident.status,
				incident.hasMedia ? 1 : 0,
				incident.isAnonymous ? 1 : 0,
				incident.latitude,
				incident.longitude,
				incident.audioUrl,
			],
		});
	} catch (error) {
		console.error("Failed to save incident:", error);
		throw error;
	}
};

export const getIncidents = async (): Promise<Incident[]> => {
	try {
		const result = await client.execute(
			"SELECT * FROM incidents ORDER BY timestamp DESC"
		);

		return result.rows.map((row) => ({
			id: String(row.id),
			category: String(row.category),
			description: String(row.description),
			timestamp: String(row.timestamp),
			status: String(row.status) as IncidentStatus,
			hasMedia: Boolean(row.hasMedia),
			isAnonymous: Boolean(row.isAnonymous),
			latitude: row.latitude ? Number(row.latitude) : null,
			longitude: row.longitude ? Number(row.longitude) : null,
			audioUrl: row.audioUrl ? String(row.audioUrl) : null,
		}));
	} catch (error) {
		console.error("Failed to fetch incidents:", error);
		throw error;
	}
};
