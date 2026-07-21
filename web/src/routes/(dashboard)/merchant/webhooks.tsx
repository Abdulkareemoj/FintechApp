import { createFileRoute } from "@tanstack/react-router";
import {
	AlertTriangle,
	CheckCircle2,
	Clock,
	Code2,
	Edit2,
	ExternalLink,
	Plus,
	RefreshCw,
	Trash2,
	Webhook,
	XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import MerchantLayout from "@/layout/MerchantLayout";

const webhooks = [
	{
		id: "1",
		url: "https://api.mystore.com/webhooks/payments",
		events: ["payment.completed", "payment.failed", "refund.created"],
		status: "active",
		successRate: 99.8,
		lastTriggered: "2024-01-20 14:32",
		recentDeliveries: [
			{
				id: "d1",
				event: "payment.completed",
				status: "success",
				time: "14:32",
			},
			{
				id: "d2",
				event: "payment.completed",
				status: "success",
				time: "14:28",
			},
			{ id: "d3", event: "refund.created", status: "failed", time: "14:15" },
		],
	},
	{
		id: "2",
		url: "https://hooks.slack.com/services/T00/B00/XXX",
		events: ["payment.completed"],
		status: "active",
		successRate: 100,
		lastTriggered: "2024-01-20 13:45",
		recentDeliveries: [
			{
				id: "d4",
				event: "payment.completed",
				status: "success",
				time: "13:45",
			},
			{
				id: "d5",
				event: "payment.completed",
				status: "success",
				time: "13:30",
			},
		],
	},
	{
		id: "3",
		url: "https://analytics.mycompany.io/events",
		events: ["payment.completed", "payment.failed", "settlement.completed"],
		status: "inactive",
		successRate: 95.2,
		lastTriggered: "2024-01-18 10:22",
		recentDeliveries: [],
	},
];

const availableEvents = [
	{
		category: "Payments",
		events: [
			"payment.created",
			"payment.completed",
			"payment.failed",
			"payment.refunded",
		],
	},
	{
		category: "Refunds",
		events: ["refund.created", "refund.completed", "refund.failed"],
	},
	{
		category: "Settlements",
		events: ["settlement.created", "settlement.completed"],
	},
	{
		category: "Disputes",
		events: ["dispute.created", "dispute.won", "dispute.lost"],
	},
];

export const Route = createFileRoute("/(dashboard)/merchant/webhooks")({
	component: MerchantWebhooks,
});

function MerchantWebhooks() {
	const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

	const toggleEvent = (event: string) => {
		setSelectedEvents((prev) =>
			prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
		);
	};

	return (
		<MerchantLayout>
			<div className="min-h-screen bg-background">
				{/* Main Content */}
				<main className="mx-auto space-y-8 px-6 py-8">
					{/* Header */}{" "}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
						<p className="text-muted-foreground mt-1">
							Configure webhooks to receive real-time event notifications.
						</p>
					</motion.div>
					{/* Stats */}
					<div className="grid gap-4 md:grid-cols-4">
						{[
							{
								label: "Active Webhooks",
								value: "2",
								icon: Webhook,
								color: "violet",
							},
							{
								label: "Events Today",
								value: "1,234",
								icon: Code2,
								color: "emerald",
							},
							{
								label: "Success Rate",
								value: "99.2%",
								icon: CheckCircle2,
								color: "emerald",
							},
							{
								label: "Failed Deliveries",
								value: "3",
								icon: AlertTriangle,
								color: "amber",
							},
						].map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 + index * 0.05 }}
							>
								<Card className="bg-card/50 backdrop-blur-sm border-border/50">
									<CardContent className="p-4 flex items-center gap-4">
										<div
											className={`h-12 w-12 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}
										>
											<stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
										</div>
										<div>
											<p className="text-2xl font-bold">{stat.value}</p>
											<p className="text-sm text-muted-foreground">
												{stat.label}
											</p>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
					{/* Webhooks List */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<Card className="bg-card/50 backdrop-blur-sm border-border/50">
							<CardHeader className="flex flex-row items-center justify-between">
								<div>
									<CardTitle className="text-lg font-semibold">
										Webhook Endpoints
									</CardTitle>
									<CardDescription>
										Manage your webhook endpoints and subscribed events.
									</CardDescription>
								</div>
								<Dialog>
									<DialogTrigger asChild>
										<Button className="bg-primary hover:bg-primary/90">
											<Plus className="h-4 w-4 mr-2" />
											Add Endpoint
										</Button>
									</DialogTrigger>
									<DialogContent className="bg-card border-border max-w-lg">
										<DialogHeader>
											<DialogTitle>Add Webhook Endpoint</DialogTitle>
											<DialogDescription>
												Configure a new endpoint to receive event notifications.
											</DialogDescription>
										</DialogHeader>
										<div className="space-y-4 py-4">
											<div className="space-y-2">
												<Label>Endpoint URL</Label>
												<Input
													placeholder="https://your-domain.com/webhooks"
													className="bg-muted/50"
												/>
											</div>
											<div className="space-y-2">
												<Label>Description (optional)</Label>
												<Input
													placeholder="e.g., Production payment notifications"
													className="bg-muted/50"
												/>
											</div>
											<div className="space-y-3">
												<Label>Events to Subscribe</Label>
												<Accordion type="multiple" className="w-full">
													{availableEvents.map((category) => (
														<AccordionItem
															key={category.category}
															value={category.category}
															className="border-border/50"
														>
															<AccordionTrigger className="hover:no-underline">
																{category.category}
															</AccordionTrigger>
															<AccordionContent>
																<div className="space-y-2 pt-2">
																	{category.events.map((event) => (
																		<div
																			key={event}
																			className="flex items-center space-x-2"
																		>
																			<Checkbox
																				id={event}
																				checked={selectedEvents.includes(event)}
																				onCheckedChange={() =>
																					toggleEvent(event)
																				}
																			/>
																			<label
																				htmlFor={event}
																				className="text-sm font-mono cursor-pointer"
																			>
																				{event}
																			</label>
																		</div>
																	))}
																</div>
															</AccordionContent>
														</AccordionItem>
													))}
												</Accordion>
											</div>
										</div>
										<DialogFooter>
											<Button variant="outline">Cancel</Button>
											<Button className="bg-primary hover:bg-primary/90">
												Add Endpoint
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</CardHeader>
							<CardContent className="space-y-4">
								{webhooks.map((webhook) => (
									<div
										key={webhook.id}
										className="p-4 rounded-lg border border-border/50 bg-muted/20"
									>
										<div className="flex items-start justify-between mb-4">
											<div className="flex items-center gap-3">
												<div
													className={`h-10 w-10 rounded-lg flex items-center justify-center ${webhook.status === "active" ? "bg-emerald-500/10" : "bg-muted"}`}
												>
													<Webhook
														className={`h-5 w-5 ${webhook.status === "active" ? "text-emerald-400" : "text-muted-foreground"}`}
													/>
												</div>
												<div>
													<div className="flex items-center gap-2">
														<code className="font-mono text-sm">
															{webhook.url}
														</code>
														<ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
													</div>
													<div className="flex items-center gap-2 mt-1">
														<Badge
															variant="outline"
															className={
																webhook.status === "active"
																	? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
																	: "bg-muted text-muted-foreground"
															}
														>
															{webhook.status}
														</Badge>
														<span className="text-xs text-muted-foreground">
															{webhook.successRate}% success rate
														</span>
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Switch checked={webhook.status === "active"} />
												<Button variant="ghost" size="icon" className="h-8 w-8">
													<Edit2 className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>

										<div className="flex flex-wrap gap-2 mb-4">
											{webhook.events.map((event) => (
												<Badge
													key={event}
													variant="secondary"
													className="font-mono text-xs"
												>
													{event}
												</Badge>
											))}
										</div>

										{webhook.recentDeliveries.length > 0 && (
											<div className="border-t border-border/50 pt-3 mt-3">
												<p className="text-xs text-muted-foreground mb-2">
													Recent Deliveries
												</p>
												<div className="flex flex-wrap gap-2">
													{webhook.recentDeliveries.map((delivery) => (
														<div
															key={delivery.id}
															className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${delivery.status === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
														>
															{delivery.status === "success" ? (
																<CheckCircle2 className="h-3 w-3" />
															) : (
																<XCircle className="h-3 w-3" />
															)}
															<span className="font-mono">
																{delivery.event}
															</span>
															<span className="text-muted-foreground">
																{delivery.time}
															</span>
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								))}
							</CardContent>
						</Card>
					</motion.div>
				</main>
			</div>
		</MerchantLayout>
	);
}
