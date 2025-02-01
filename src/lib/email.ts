import emailjs from "@emailjs/browser";

export async function sendMail(
	message: string,
	user_email: string,
	subject: string
) {
	const res = await (
		await fetch("https://api.emailjs.com/api/v1.0/email/send", {
			headers: { "content-type": "application/json" },
			method: "post",
			body: JSON.stringify({
				service_id: "service_t9l7rbp",
				template_id: "template_1lrdvdf",
				user_id: "V_dfd9YVgecslJMA7",
				template_params: {
					username: "James",
					user_email,
					message,
					subject,
					// "g-recaptcha-response": "03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...",
				},
			}),
		})
	).text();

	console.log(res);

	return;
	return emailjs
		.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
			name: "James",
			notes: "Check this out!",
		})
		.then(
			(response) => {
				console.log("SUCCESS!", response.status, response.text);
			},
			(error) => {
				console.log("FAILED...", error);
			}
		);
	return await emailjs.send(
		"service_t9l7rbp",
		"template_1lrdvdf",
		{
			from_name: "SECURE-RESPONSE",
			message,
			user_email,
		},
		{}
	);
}
