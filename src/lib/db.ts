import { createClient } from "@libsql/client";
import { sendMail } from "./email";

// Define strict types for our database
export type IncidentStatus = "pending" | "in-progress" | "resolved";

export interface Incident {
	id: string;
	category: string;
	description: string;
	image: string;
	timestamp: string;
	status: IncidentStatus;
	hasMedia: boolean;
	isAnonymous: boolean;
	latitude: number | null;
	longitude: number | null;
	audioUrl: string | null;
}

export interface Responder {
	id: string;
	name: string;
	email: string;
	designation: string;
	code: string;
	phoneNumber: string;
	distance: number; // New property
	role: string; // New property
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
        image TEXT,
        timestamp TEXT NOT NULL,
        status TEXT CHECK(status IN ('pending', 'in-progress', 'resolved')) NOT NULL,
        hasMedia BOOLEAN NOT NULL,
        isAnonymous BOOLEAN NOT NULL,
        latitude REAL,
        longitude REAL,
        audioUrl TEXT
      );
    `);
		await client.execute(`
      CREATE TABLE IF NOT EXISTS responders (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        designation TEXT UNIQUE NOT NULL,
        code TEXT,
        phoneNumber TEXT NOT NULL,
        distance REAL NOT NULL,
        role TEXT NOT NULL
      );
			`);
		console.log("Database initialized successfully");
	} catch (error) {
		console.error("Failed to initialize database:", error);
		throw error;
	}
};

export const migrateDB = async () => {
	try {
		await client.execute(`
            ALTER TABLE responders ADD COLUMN distance REAL NOT NULL DEFAULT 0;
        `);
		await client.execute(`
            ALTER TABLE responders ADD COLUMN role TEXT NOT NULL DEFAULT '';
        `);
		console.log("Database migration completed successfully");
	} catch (error) {
		console.error("Failed to migrate database:", error);
		throw error;
	}
};

// Call migrateDB function to perform the migration
// migrateDB();

export const saveIncident = async (incident: Incident): Promise<void> => {
	try {
		await client.execute({
			sql: `
        INSERT INTO incidents (
          id, category, description, timestamp, status, image, 
          hasMedia, isAnonymous, latitude, longitude, audioUrl
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
			args: [
				incident.id,
				incident.category,
				incident.description,
				incident.timestamp,
				incident.status,
				incident.image || "",
				incident.hasMedia ? 1 : 0,
				incident.isAnonymous ? 1 : 0,
				incident.latitude,
				incident.longitude,
				incident.audioUrl,
			],
		});

		// Send emergency email with incident details
		const emailBody = `
			Emergency Incident Report:
			
			ID: <string>${incident.id}</string>
			Category: <string>${incident.category}</string>
			Description: <string>${incident.description}</string>
			Timestamp: <string>${incident.timestamp}</string>
			Status: <string>${incident.status}</string>
			Location: <string>(${incident.latitude}, ${incident.longitude})</string>
			Anonymous: <string>${incident.isAnonymous ? "Yes" : "No"}</string>
        `;

		await sendMail(
			emailBody,
			"kingchi005@gmail.com",
			"Emergency Incident Report"
		);
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
			image: String(row.image),
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

export const deleteIncident = async (id: string): Promise<void> => {
	try {
		await client.execute({
			sql: `DELETE FROM incidents WHERE id = ?`,
			args: [id],
		});
		console.log(`Incident with ID ${id} deleted successfully`);
	} catch (error) {
		console.error("Failed to delete incident:", error);
		throw error;
	}
};

export const getResponders = async (): Promise<Responder[]> => {
	try {
		const result = await client.execute(
			"SELECT * FROM responders ORDER BY name ASC"
		);

		return result.rows.map((row) => ({
			id: String(row.id),
			name: String(row.name),
			email: String(row.email),
			designation: String(row.designation),
			code: String(row.code),
			phoneNumber: String(row.phoneNumber),
			distance: Number(row.distance), // New property
			role: String(row.role), // New property
		}));
	} catch (error) {
		console.error("Failed to fetch responders:", error);
		throw error;
	}
};

export async function createVerificationCode(code: string, email: string) {
	try {
		const result = await client.execute({
			sql: `UPDATE responders SET code = ? WHERE email = ?`,
			args: [code, email],
		});

		return result.rowsAffected > 0;
	} catch (error) {
		console.error("Failed to create verification code:", error);
		throw error;
	}
}

export const verifyCode = async (code): Promise<Responder[]> => {
	try {
		const result = await client.execute(
			"SELECT * FROM responders ORDER BY name ASC"
		);

		return result.rows.map((row) => ({
			id: String(row.id),
			name: String(row.name),
			email: String(row.email),
			designation: String(row.designation),
			code: String(row.code),
			distance: Number(row.distance), // New property
			role: String(row.role), // New property
			phoneNumber: String(row.phoneNumber),
		}));
	} catch (error) {
		console.error("Failed to fetch responders:", error);
		throw error;
	}
};
