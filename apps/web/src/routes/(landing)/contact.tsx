import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { motion } from "motion/react";
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
			<main className="pt-24">
				{/* Hero */}
				<section className="py-20 lg:py-28 bg-gradient-hero">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-center max-w-3xl mx-auto"
						>
							<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
								Get in <span className="italic-accent">touch</span>
							</h1>
							<p className="text-lg text-muted-foreground">
								Have questions? We'd love to hear from you. Send us a message
								and we'll respond as soon as possible.
							</p>
						</motion.div>
					</div>
				</section>

				{/* Contact Form & Info */}
				<section className="py-20 bg-background">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
							{/* Form */}
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
							>
								<h2 className="text-2xl font-bold text-foreground mb-6">
									Send us a message
								</h2>
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid sm:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Name
											</label>
											<Input
												placeholder="Your name"
												value={formData.name}
												onChange={(e) =>
													setFormData({ ...formData, name: e.target.value })
												}
												required
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Email
											</label>
											<Input
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
										<label className="block text-sm font-medium text-foreground mb-2">
											Subject
										</label>
										<Input
											placeholder="How can we help?"
											value={formData.subject}
											onChange={(e) =>
												setFormData({ ...formData, subject: e.target.value })
											}
											required
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-foreground mb-2">
											Message
										</label>
										<Textarea
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
										variant="hero"
										size="lg"
										type="submit"
										className="w-full sm:w-auto"
									>
										Send message
									</Button>
								</form>
							</motion.div>

							{/* Contact Info */}
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
							>
								<h2 className="text-2xl font-bold text-foreground mb-6">
									Contact information
								</h2>
								<div className="grid sm:grid-cols-2 gap-6">
									{contactInfo.map((info) => (
										<div
											key={info.title}
											className="bg-secondary/30 rounded-2xl p-6"
										>
											<div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
												<info.icon className="w-6 h-6 text-primary" />
											</div>
											<h3 className="font-semibold text-foreground mb-1">
												{info.title}
											</h3>
											<p className="text-foreground font-medium mb-1">
												{info.content}
											</p>
											<p className="text-sm text-muted-foreground">
												{info.description}
											</p>
										</div>
									))}
								</div>
							</motion.div>
						</div>
					</div>
				</section>
			</main>
		</LandingLayout>
	);
}
