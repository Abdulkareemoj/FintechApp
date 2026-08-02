import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LandingLayout } from "@/layout/LandingLayout";

export const Route = createFileRoute("/(landing)/contact")({
	component: ContactPage,
});

function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		toast.success("Message sent! We'll get back to you within 24 hours.");
		setFormData({ name: "", email: "", subject: "", message: "" });
	};

	const contactInfo = [
		{
			icon: Mail,
			title: "Email",
			content: "hello@finova.com",
			description: "We respond within 24 hours",
		},
		{
			icon: Phone,
			title: "Phone",
			content: "+1 (555) 123-4567",
			description: "Mon-Fri, 9am-6pm EST",
		},
		{
			icon: MapPin,
			title: "Office",
			content: "San Francisco, CA",
			description: "123 Finance Street, Suite 400",
		},
		{
			icon: MessageSquare,
			title: "Live Chat",
			content: "Available 24/7",
			description: "Instant support for all users",
		},
	];

	return (
		<LandingLayout>
			<main>
				{/* Hero */}
				<section
					className="relative flex items-center justify-center overflow-hidden"
					style={{ height: "100vh" }}
				>
					<div
						className="absolute inset-0"
						style={{
							background:
								"radial-gradient(120% 90% at 50% 25%, #232e44 0%, #171a20 55%, #0d1016 100%)",
						}}
					/>
					<div className="relative z-10 px-4 text-center">
						<h1 className="text-[40px] font-medium text-white">Get in touch</h1>
						<p className="mx-auto mt-4 max-w-xl text-sm text-white/70">
							Have questions? We'd love to hear from you. Send us a message and
							we'll respond as soon as possible.
						</p>
					</div>
				</section>

				{/* Contact Form & Info */}
				<section className="bg-background py-24">
					<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
						<div className="grid gap-16 lg:grid-cols-2">
							{/* Form */}
							<div>
								<h2 className="text-[22px] font-medium text-foreground">
									Send us a message
								</h2>
								<form onSubmit={handleSubmit} className="mt-8 space-y-6">
									<div className="grid gap-6 sm:grid-cols-2">
										<div>
											<label
												htmlFor="contact-name"
												className="mb-2 block text-sm font-medium text-foreground"
											>
												Name
											</label>
											<Input
												id="contact-name"
												placeholder="Your name"
												value={formData.name}
												onChange={(e) =>
													setFormData({ ...formData, name: e.target.value })
												}
												required
											/>
										</div>
										<div>
											<label
												htmlFor="contact-email"
												className="mb-2 block text-sm font-medium text-foreground"
											>
												Email
											</label>
											<Input
												id="contact-email"
												type="email"
												placeholder="you@example.com"
												value={formData.email}
												onChange={(e) =>
													setFormData({ ...formData, email: e.target.value })
												}
												required
											/>
										</div>
									</div>
									<div>
										<label
											htmlFor="contact-subject"
											className="mb-2 block text-sm font-medium text-foreground"
										>
											Subject
										</label>
										<Input
											id="contact-subject"
											placeholder="How can we help?"
											value={formData.subject}
											onChange={(e) =>
												setFormData({ ...formData, subject: e.target.value })
											}
											required
										/>
									</div>
									<div>
										<label
											htmlFor="contact-message"
											className="mb-2 block text-sm font-medium text-foreground"
										>
											Message
										</label>
										<Textarea
											id="contact-message"
											placeholder="Tell us more about your question..."
											rows={5}
											value={formData.message}
											onChange={(e) =>
												setFormData({ ...formData, message: e.target.value })
											}
											required
										/>
									</div>
									<Button
										type="submit"
										className="h-10 rounded bg-primary text-sm font-medium text-white transition-colors duration-300 hover:bg-primary/90"
									>
										Send message
									</Button>
								</form>
							</div>

							{/* Contact Info */}
							<div>
								<h2 className="text-[22px] font-medium text-foreground">
									Contact information
								</h2>
								<div className="mt-8 grid gap-px bg-border sm:grid-cols-2">
									{contactInfo.map((info) => (
										<div key={info.title} className="bg-card p-8">
											<div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-muted">
												<info.icon className="size-6 text-primary" />
											</div>
											<h3 className="font-medium text-foreground">
												{info.title}
											</h3>
											<p className="mt-1 font-medium text-foreground">
												{info.content}
											</p>
											<p className="mt-1 text-sm text-muted-foreground">
												{info.description}
											</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</LandingLayout>
	);
}
