import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
// import { Input, Button } from '../components'; // Assuming these are the custom UI components
import "tailwindcss/tailwind.css";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@radix-ui/react-select";
import { Switch } from "@radix-ui/react-switch";
import { Label } from "@/components/ui/label";
import { sendMail } from "@/lib/email";
import { useAuthStore, useResponderStore } from "@/lib/store";
import { createVerificationCode } from "@/lib/db";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { InputOTPForm } from "@/components/OTPForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Header from "@/components/Header";

const FormSchema = z.object({
	pin: z.string().min(6, {
		message: "Your one-time password must be 6 characters.",
	}),
});

const Login = () => {
	const fetchResponders = useResponderStore((st) => st.init);
	const findByEmail = useResponderStore((st) => st.findByEmail);
	const login = useAuthStore((st) => st.authenticate);
	const [page, setPage] = useState<"login" | "verify">("login");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const { toast } = useToast();

	useEffect(() => {
		fetchResponders();
	}, [page]);

	const handleSendVerification = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();

		const exists = findByEmail(email);

		if (!exists)
			return toast({
				title: "Error",
				style: { color: "red" },
				description: "You are not registered as a responder on this platform",
			});

		if (await createAndSendCode(email))
			toast({
				title: "Email sent",
				style: { color: "green" },
				description: "Verificastion code has been sent to you email",
			});

		setPage("verify");
	};

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			pin: "",
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		const exists = findByEmail(email);
		if (exists.code !== data.pin)
			return toast({
				title: "Error",
				description: "Verification failed",
				style: { color: "red" },
			});

		toast({
			title: "Success",
			description: "Login Successfully",
			style: { color: "green" },
		});

		login(exists.email);
	}

	return (
		<div className="min-h-screen bg-background p-4">
			<div className="container mx-auto space-y-8">
				<Header />

				<div className="flex flex-col items-center space-y-8">
					{page === "login" && (
						<form
							onSubmit={handleSendVerification}
							className="space-y-6 w-full max-w-md"
						>
							<h2 className="text-2xl font-bold">Login</h2>

							<div className="space-y-2">
								<Label>Email</Label>
								<Input
									onChange={(ev) => setEmail(ev.currentTarget.value)}
									type="email"
									name="email"
									// multiple
									className="cursor-pointer"
								/>
							</div>

							<Button type="submit" className="w-full">
								Send verification email
							</Button>
						</form>
					)}
					{page === "verify" && (
						<>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6"
								>
									<h2 className="text-2xl font-bold">Verify Email</h2>
									<FormField
										control={form.control}
										name="pin"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Code</FormLabel>
												<FormControl>
													<InputOTP maxLength={6} {...field}>
														<InputOTPGroup>
															<InputOTPSlot index={0} />
															<InputOTPSlot index={1} />
															<InputOTPSlot index={2} />
														</InputOTPGroup>
														<InputOTPSeparator />
														<InputOTPGroup>
															<InputOTPSlot index={3} />
															<InputOTPSlot index={4} />
															<InputOTPSlot index={5} />
														</InputOTPGroup>
													</InputOTP>
												</FormControl>
												<FormDescription>
													Please enter the one-time password sent to your email.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button type="submit" className="w-full">
										Verify Login
									</Button>
								</form>
							</Form>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Login;

async function createAndSendCode(email: string) {
	try {
		const code = generateOTP();

		await createVerificationCode(code, email);

		await sendMail(
			`Your Verification code is ${code}`,
			email,
			"EMAIL VERIFICATION"
		);
		return true;
	} catch (error) {
		return false;
	}
}

function generateOTP(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}
