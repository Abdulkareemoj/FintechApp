import { createFileRoute } from "@tanstack/react-router";
import {
	CheckCircle2,
	Clock,
	Code2,
	Copy,
	Eye,
	EyeOff,
	Key,
	Plus,
	RefreshCw,
	Shield,
	Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import MerchantLayout from "@/layout/MerchantLayout";

const apiKeys = [
	{
		id: "1",
		name: "Production API Key",
		key: "pk_live_51NxxxxxxxxxxxxxxxxxxxxxQ",
		secret: "sk_live_51NxxxxxxxxxxxxxxxxxxxxxZ",
		environment: "live",
		created: "2024-01-15",
		lastUsed: "2024-01-20 14:32",
		status: "active",
	},
	{
		id: "2",
		name: "Test API Key",
		key: "pk_test_51NxxxxxxxxxxxxxxxxxxxxxA",
		secret: "sk_test_51NxxxxxxxxxxxxxxxxxxxxxB",
		environment: "test",
		created: "2024-01-10",
		lastUsed: "2024-01-20 12:15",
		status: "active",
	},
	{
		id: "3",
		name: "Mobile App Key",
		key: "pk_live_51NxxxxxxxxxxxxxxxxxxxxxM",
		secret: "sk_live_51NxxxxxxxxxxxxxxxxxxxxxN",
		environment: "live",
		created: "2024-01-05",
		lastUsed: "2024-01-19 09:45",
		status: "active",
	},
];

export const Route = createFileRoute("/(dashboard)/merchant/api-keys")({
	component: MerchantApiKeys,
});

function MerchantApiKeys() {
	const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
	const [copied, setCopied] = useState<string | null>(null);

	const toggleSecret = (id: string) => {
		setShowSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const copyToClipboard = (text: string, id: string) => {
		navigator.clipboard.writeText(text);
		setCopied(id);
		setTimeout(() => setCopied(null), 2000);
	};

	const maskKey = (key: string) => {
		return (
			key.substring(0, 12) + "••••••••••••••••" + key.substring(key.length - 4)
		);
	};

	return (
		<MerchantLayout>
			<div className="min-h-screen bg-background">
				{/* Main Content */}
				<main className="mx-auto space-y-8 px-6 py-8">
					{/* Header */}

					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
						<p className="text-muted-foreground mt-1">
							Manage your API keys for payment integration.
						</p>
					</motion.div>

					{/* Quick Stats */}
					<div className="grid gap-4 md:grid-cols-3">
						{[
							{ label: "Active Keys", value: "3", icon: Key, color: "violet" },
							{
								label: "API Calls Today",
								value: "12,432",
								icon: Code2,
								color: "emerald",
							},
							{
								label: "Rate Limit",
								value: "10k/min",
								icon: Shield,
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

					{/* API Keys List */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<Card className="bg-card/50 backdrop-blur-sm border-border/50">
							<CardHeader className="flex flex-row items-center justify-between">
								<div>
									<CardTitle className="text-lg font-semibold">
										Your API Keys
									</CardTitle>
									<CardDescription>
										Use these keys to authenticate API requests.
									</CardDescription>
								</div>
								<Dialog>
									<DialogTrigger asChild>
										<Button className="bg-primary hover:bg-primary/90">
											<Plus className="h-4 w-4 mr-2" />
											Create New Key
										</Button>
									</DialogTrigger>
									<DialogContent className="bg-card border-border">
										<DialogHeader>
											<DialogTitle>Create New API Key</DialogTitle>
											<DialogDescription>
												Generate a new API key for your application.
											</DialogDescription>
										</DialogHeader>
										<div className="space-y-4 py-4">
											<div className="space-y-2">
												<Label>Key Name</Label>
												<Input
													placeholder="e.g., Mobile App Key"
													className="bg-muted/50"
												/>
											</div>
											<div className="space-y-2">
												<Label>Environment</Label>
												<Select defaultValue="test">
													<SelectTrigger className="bg-muted/50">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="test">Test</SelectItem>
														<SelectItem value="live">Live</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="flex items-center justify-between">
												<div className="space-y-0.5">
													<Label>Restricted Access</Label>
													<p className="text-sm text-muted-foreground">
														Limit key to specific endpoints
													</p>
												</div>
												<Switch />
											</div>
										</div>
										<DialogFooter>
											<Button variant="outline">Cancel</Button>
											<Button className="bg-primary hover:bg-primary/90">
												Create Key
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</CardHeader>
							<CardContent className="space-y-4">
								{apiKeys.map((apiKey) => (
									<div
										key={apiKey.id}
										className="p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors"
									>
										<div className="flex items-start justify-between mb-4">
											<div className="flex items-center gap-3">
												<div
													className={`h-10 w-10 rounded-lg flex items-center justify-center ${apiKey.environment === "live" ? "bg-emerald-500/10" : "bg-amber-500/10"}`}
												>
													<Key
														className={`h-5 w-5 ${apiKey.environment === "live" ? "text-emerald-400" : "text-amber-400"}`}
													/>
												</div>
												<div>
													<h3 className="font-semibold">{apiKey.name}</h3>
													<div className="flex items-center gap-2 mt-1">
														<Badge
															variant="outline"
															className={
																apiKey.environment === "live"
																	? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
																	: "bg-amber-500/10 text-amber-400 border-amber-500/20"
															}
														>
															{apiKey.environment}
														</Badge>
														<span className="text-xs text-muted-foreground flex items-center gap-1">
															<Clock className="h-3 w-3" />
															Last used: {apiKey.lastUsed}
														</span>
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-muted-foreground hover:text-foreground"
												>
													<RefreshCw className="h-4 w-4" />
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

										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<Label className="w-24 text-muted-foreground">
													Public Key
												</Label>
												<code className="flex-1 px-3 py-2 rounded bg-background/50 font-mono text-sm">
													{apiKey.key}
												</code>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
													onClick={() =>
														copyToClipboard(apiKey.key, `pub-${apiKey.id}`)
													}
												>
													{copied === `pub-${apiKey.id}` ? (
														<CheckCircle2 className="h-4 w-4 text-emerald-400" />
													) : (
														<Copy className="h-4 w-4" />
													)}
												</Button>
											</div>
											<div className="flex items-center gap-2">
												<Label className="w-24 text-muted-foreground">
													Secret Key
												</Label>
												<code className="flex-1 px-3 py-2 rounded bg-background/50 font-mono text-sm">
													{showSecrets[apiKey.id]
														? apiKey.secret
														: maskKey(apiKey.secret)}
												</code>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
													onClick={() => toggleSecret(apiKey.id)}
												>
													{showSecrets[apiKey.id] ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
													onClick={() =>
														copyToClipboard(apiKey.secret, `sec-${apiKey.id}`)
													}
												>
													{copied === `sec-${apiKey.id}` ? (
														<CheckCircle2 className="h-4 w-4 text-emerald-400" />
													) : (
														<Copy className="h-4 w-4" />
													)}
												</Button>
											</div>
										</div>
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
