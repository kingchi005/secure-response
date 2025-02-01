import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { sendMail } from "./email";

export const ContactUs = () => {
	const form = useRef();

	const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		sendMail("sasasasa", "Kingchi005@gmail.com", "Emergency");
	};

	return (
		<form ref={form} onSubmit={sendEmail}>
			<label>Name</label>
			<input type="text" name="user_name" />
			<label>Email</label>
			<input type="email" name="user_email" />
			<label>Message</label>
			<textarea name="message" />
			<input
				type="submit"
				className="px-6 py-3 bg-blue-600 rounded"
				value="Send"
			/>
		</form>
	);
};
