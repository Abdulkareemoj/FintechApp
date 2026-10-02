import { createFileRoute } from "@tanstack/react-router";
import {
	BarChart3,
	Calendar,
	Download,
	FileText,
	LineChart,
	PieChart,
	TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/layout/DashboardLayout";
import {
	downloadStatementCsv,
	fmtDateLocal,
	monthRange,
	type StatementDirection,
	type StatementParams,
	ytdRange,
} from "@/lib/api/statements";

export const Route = createFileRoute("/(dashboard)/dashboard/reports")({
	component: ReportsPage,
});

const lastFullMonth = monthRange(1);
const ytd = ytdRange();

type ReportCard = {
	title: string;
	icon: typeof BarChart3;
	description: string;
	color: string;
	params?: StatementParams;
};

const reportTypes: ReportCard[] = [
	{
		title: "Monthly Spending",
		icon: BarChart3,
		description: `Outgoing transactions for ${lastFullMonth.label}.`,
		color: "bg-primary/10 text-primary",
		params: { ...lastFullMonth, direction: "outgoing" },
	},
	{
		title: "Income vs. Expense",
		icon: LineChart,
		description: `All transactions for ${lastFullMonth.label}.`,
		color: "bg-success/10 text-success",
		params: lastFullMonth,
	},
	{
		title: "Savings Progress",
		icon: PieChart,
		description: "Visualize progress towards your financial goals.",
		color: "bg-warning/10 text-warning",
	},
	{
		title: "Tax Summary",
		icon: FileText,
		description: `Incoming transactions for ${ytd.label}.`,
		color: "bg-primary/10 text-primary",
		params: { ...ytd, direction: "incoming" },
	},
	{
		title: "Investment Returns",
		icon: TrendingUp,
		description: "Portfolio performance and returns analysis.",
		color: "bg-blue-500/10 text-blue-500",
	},
	{
		title: "Annual Overview",
		icon: Calendar,
		description: `All transactions for ${ytd.label}.`,
		color: "bg-pink-500/10 text-pink-500",
		params: ytd,
	},
];

const REPORT_TYPE_DIRECTIONS: Record<string, StatementDirection> = {
	spending: "outgoing",
	income: "incoming",
	summary: "all",
	tax: "incoming",
};

function ReportsPage() {
	const [pendingId, setPendingId] = useState<string | null>(null);
	const [customStart, setCustomStart] = useState("");
	const [customEnd, setCustomEnd] = useState("");
	const [customType, setCustomType] = useState("spending");

	const handleDownload = async (id: string, params: StatementParams) => {
		setPendingId(id);
		try {
			await downloadStatementCsv(params);
			toast.success("Report downloaded as CSV");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Download failed");
		} finally {
			setPendingId(null);
		}
	};

	const handleCustom = (e: FormEvent) => {
		e.preventDefault();
		if (!customStart || !customEnd) {
			toast.error("Pick both a start and an end date");
			return;
		}
		if (customStart > customEnd) {
			toast.error("Start date must be on or before end date");
			return;
		}
		void handleDownload("custom", {
			startDate: customStart,
			endDate: customEnd,
			direction: REPORT_TYPE_DIRECTIONS[customType] ?? "all",
		});
	};

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				<main className="mx-auto space-y-6 px-6 py-8">
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col justify-between gap-4 pb-4 md:flex-row md:items-center"
						initial={{ opacity: 0, y: 10 }}
					>
						<div>
							<h1 className="font-bold text-3xl tracking-tight">
								Financial Reports
							</h1>
							<p className="mt-1 text-muted-foreground">
								Generate and download detailed financial reports (CSV)
							</p>
						</div>
						<Button
							disabled={pendingId === "all"}
							onClick={() => void handleDownload("all", {})}
							variant="outline"
						>
							<Download className="mr-2 h-4 w-4" />
							{pendingId === "all" ? "Preparing…" : "Export All"}
						</Button>
					</motion.div>

					{/* Report Types Grid */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{reportTypes.map((report, index) => {
							const isPreview = !report.params;
							return (
								<motion.div
									animate={{ opacity: 1, y: 0 }}
									initial={{ opacity: 0, y: 20 }}
									key={report.title}
									transition={{ delay: 0.1 + index * 0.05 }}
								>
									<Card className="group h-full cursor-pointer border-border/50 bg-card-gradient shadow-card transition-all duration-300 hover:shadow-elevated">
										<CardHeader className="flex flex-row items-start justify-between pb-2">
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<CardTitle className="text-base">
														{report.title}
													</CardTitle>
													{isPreview ? (
														<Badge variant="outline">Preview</Badge>
													) : null}
												</div>
												<p className="text-muted-foreground text-sm">
													{report.description}
												</p>
											</div>
											<div
												className={`rounded-xl p-3 ${report.color} transition-transform group-hover:scale-110`}
											>
												<report.icon className="h-5 w-5" />
											</div>
										</CardHeader>
										<CardContent className="pt-4">
											<Button
												className="w-full"
												disabled={
													isPreview || pendingId === `report-${report.title}`
												}
												onClick={() =>
													report.params
														? void handleDownload(
																`report-${report.title}`,
																report.params,
															)
														: undefined
												}
												size="sm"
												variant="secondary"
											>
												{pendingId === `report-${report.title}`
													? "Preparing…"
													: isPreview
														? "Not available yet"
														: "Download CSV"}
											</Button>
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</div>

					{/* Custom Report Generator */}
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.4 }}
					>
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardHeader>
								<CardTitle>Custom Report Generator</CardTitle>
							</CardHeader>
							<CardContent>
								<form className="space-y-4" onSubmit={handleCustom}>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="report-start">Start Date</Label>
											<Input
												className="bg-muted/50"
												id="report-start"
												max={fmtDateLocal(new Date())}
												onChange={(e) => setCustomStart(e.target.value)}
												required
												type="date"
												value={customStart}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="report-end">End Date</Label>
											<Input
												className="bg-muted/50"
												id="report-end"
												max={fmtDateLocal(new Date())}
												onChange={(e) => setCustomEnd(e.target.value)}
												required
												type="date"
												value={customEnd}
											/>
										</div>
									</div>

									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Report Type</Label>
											<Select
												onValueChange={(value) => {
													if (value) setCustomType(value);
												}}
												value={customType}
											>
												<SelectTrigger className="bg-muted/50">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="spending">
														Spending Report
													</SelectItem>
													<SelectItem value="income">Income Report</SelectItem>
													<SelectItem value="summary">
														Summary Report
													</SelectItem>
													<SelectItem value="tax">
														Income (tax) Report
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-2">
											<Label>Format</Label>
											<p className="flex h-8 items-center rounded-lg border border-border bg-muted/30 px-3 text-muted-foreground text-sm">
												CSV spreadsheet
											</p>
										</div>
									</div>

									<Button
										className="w-full bg-primary-gradient"
										disabled={pendingId === "custom"}
										type="submit"
									>
										<FileText className="mr-2 h-4 w-4" />
										{pendingId === "custom"
											? "Preparing…"
											: "Generate Custom Report"}
									</Button>
								</form>
							</CardContent>
						</Card>
					</motion.div>
				</main>
			</div>
		</DashboardLayout>
	);
}
