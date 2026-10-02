import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/layout/DashboardLayout";
import {
	downloadStatementCsv,
	fmtDateLocal,
	monthRange,
	type PeriodRange,
	type StatementParams,
	ytdRange,
} from "@/lib/api/statements";

export const Route = createFileRoute("/(dashboard)/dashboard/statements")({
	component: StatementsPage,
});

function buildPeriods(): Array<
	{ id: string } & PeriodRange & { params: StatementParams }
> {
	const periods: Array<
		{ id: string } & PeriodRange & { params: StatementParams }
	> = [];

	// Current month first, then the previous 5
	for (let offset = 0; offset < 6; offset += 1) {
		const range = monthRange(offset);
		periods.push({
			id: `month-${offset}`,
			...range,
			params: { startDate: range.startDate, endDate: range.endDate },
		});
	}

	const ytd = ytdRange();
	periods.push({
		id: "ytd",
		...ytd,
		params: { startDate: ytd.startDate, endDate: ytd.endDate },
	});

	periods.push({
		id: "all",
		label: "All time",
		startDate: "",
		endDate: "",
		params: {},
	});

	return periods;
}

function StatementsPage() {
	const [pendingId, setPendingId] = useState<string | null>(null);
	const [customStart, setCustomStart] = useState("");
	const [customEnd, setCustomEnd] = useState("");

	const handleDownload = async (id: string, params: StatementParams) => {
		setPendingId(id);
		try {
			await downloadStatementCsv(params);
			toast.success("Statement downloaded");
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
		});
	};

	const periods = buildPeriods();

	return (
		<DashboardLayout>
			<main className="min-h-screen bg-background px-6 py-8">
				<div className="mx-auto max-w-5xl space-y-6">
					<div>
						<h1 className="font-bold text-3xl tracking-tight">Statements</h1>
						<p className="mt-1 text-muted-foreground">
							Download your account statements as CSV files.
						</p>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Available statements</CardTitle>
							<CardDescription>
								Each statement covers the full period shown
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							{periods.map((period) => (
								<div
									className="flex items-center justify-between rounded-lg border border-border p-4"
									key={period.id}
								>
									<div className="flex items-center gap-3">
										<FileText className="size-5 text-primary" />
										<div>
											<span className="font-medium">{period.label}</span>
											<p className="text-muted-foreground text-xs">
												{period.startDate && period.endDate
													? `${period.startDate} → ${period.endDate}`
													: "Full transaction history"}
											</p>
										</div>
									</div>
									<Button
										disabled={pendingId === period.id}
										onClick={() =>
											void handleDownload(period.id, period.params)
										}
										size="sm"
										variant="outline"
									>
										<Download className="mr-2 size-4" />
										{pendingId === period.id ? "Preparing…" : "Download"}
									</Button>
								</div>
							))}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Custom range</CardTitle>
							<CardDescription>
								Export any date range as a CSV statement
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form className="space-y-4" onSubmit={handleCustom}>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="stmt-start">Start Date</Label>
										<Input
											className="bg-muted/50"
											id="stmt-start"
											max={fmtDateLocal(new Date())}
											onChange={(e) => setCustomStart(e.target.value)}
											required
											type="date"
											value={customStart}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="stmt-end">End Date</Label>
										<Input
											className="bg-muted/50"
											id="stmt-end"
											max={fmtDateLocal(new Date())}
											onChange={(e) => setCustomEnd(e.target.value)}
											required
											type="date"
											value={customEnd}
										/>
									</div>
								</div>
								<Button
									className="bg-primary-gradient"
									disabled={pendingId === "custom"}
									type="submit"
								>
									<Download className="mr-2 size-4" />
									{pendingId === "custom" ? "Preparing…" : "Download CSV"}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</main>
		</DashboardLayout>
	);
}
