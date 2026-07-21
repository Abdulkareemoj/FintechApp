import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowDownLeft,
	ArrowUpRight,
	BarChart3,
	Calendar,
	PieChart,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart as RechartsPie,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/layout/DashboardLayout";

const monthlyData = [
	{ month: "Jan", income: 4000, expenses: 2400, savings: 1600 },
	{ month: "Feb", income: 3000, expenses: 1398, savings: 1602 },
	{ month: "Mar", income: 5000, expenses: 3800, savings: 1200 },
	{ month: "Apr", income: 4780, expenses: 3908, savings: 872 },
	{ month: "May", income: 5890, expenses: 4800, savings: 1090 },
	{ month: "Jun", income: 4390, expenses: 3800, savings: 590 },
	{ month: "Jul", income: 6490, expenses: 4300, savings: 2190 },
];

const categoryData = [
	{ name: "Food & Dining", value: 850, color: "hsl(160 84% 39%)" },
	{ name: "Shopping", value: 620, color: "hsl(217 33% 55%)" },
	{ name: "Transport", value: 380, color: "hsl(38 92% 50%)" },
	{ name: "Entertainment", value: 290, color: "hsl(280 65% 60%)" },
	{ name: "Utilities", value: 450, color: "hsl(200 80% 50%)" },
	{ name: "Other", value: 210, color: "hsl(0 0% 50%)" },
];

const weeklySpending = [
	{ day: "Mon", amount: 120 },
	{ day: "Tue", amount: 85 },
	{ day: "Wed", amount: 200 },
	{ day: "Thu", amount: 45 },
	{ day: "Fri", amount: 180 },
	{ day: "Sat", amount: 320 },
	{ day: "Sun", amount: 95 },
];

const budgets = [
	{ category: "Food & Dining", spent: 850, budget: 1000, icon: "🍔" },
	{ category: "Shopping", spent: 620, budget: 500, icon: "🛍️" },
	{ category: "Transport", spent: 380, budget: 400, icon: "🚗" },
	{ category: "Entertainment", spent: 290, budget: 300, icon: "🎬" },
];
export const Route = createFileRoute("/(dashboard)/dashboard/analytics")({
	component: AnalyticsPage,
});

function AnalyticsPage() {
	const totalIncome = monthlyData[monthlyData.length - 1].income;
	const totalExpenses = monthlyData[monthlyData.length - 1].expenses;
	const savingsRate = (
		((totalIncome - totalExpenses) / totalIncome) *
		100
	).toFixed(1);
	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				{/* Main Content */}
				<main className="mx-auto space-y-6 px-6 py-8">
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col justify-between gap-4 pb-4 md:flex-row md:items-center"
						initial={{ opacity: 0, y: 10 }}
					>
						<div>
							<h1 className="font-bold text-3xl tracking-tight">Analytics</h1>
							<p className="mt-1 text-muted-foreground">
								Track your spending patterns and insights
							</p>
						</div>
						<Button className="gap-2" variant="outline">
							<Calendar className="h-4 w-4" />
							This Month
						</Button>
					</motion.div>

					{/* Summary Cards */}
					<div className="grid gap-4 md:grid-cols-4">
						{[
							{
								label: "Total Income",
								value: `$${totalIncome.toLocaleString()}`,
								change: "+12%",
								positive: true,
								icon: ArrowDownLeft,
							},
							{
								label: "Total Expenses",
								value: `$${totalExpenses.toLocaleString()}`,
								change: "+5%",
								positive: false,
								icon: ArrowUpRight,
							},
							{
								label: "Net Savings",
								value: `$${(totalIncome - totalExpenses).toLocaleString()}`,
								change: "+33%",
								positive: true,
								icon: TrendingUp,
							},
							{
								label: "Savings Rate",
								value: `${savingsRate}%`,
								change: "+8%",
								positive: true,
								icon: PieChart,
							},
						].map((stat, index) => (
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								initial={{ opacity: 0, y: 20 }}
								key={stat.label}
								transition={{ delay: 0.1 + index * 0.05 }}
							>
								<Card className="border-border/50 bg-card-gradient shadow-card">
									<CardContent className="p-6">
										<div className="flex items-center justify-between">
											<p className="text-muted-foreground text-sm">
												{stat.label}
											</p>
											<stat.icon
												className={`h-4 w-4 ${stat.positive ? "text-success" : "text-destructive"}`}
											/>
										</div>
										<p className="number-display mt-2 font-bold text-2xl">
											{stat.value}
										</p>
										<p
											className={`mt-1 text-sm ${stat.positive ? "text-success" : "text-destructive"}`}
										>
											{stat.change} from last month
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>

					<div className="grid gap-6 lg:grid-cols-7">
						{/* Income vs Expenses Chart */}
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="lg:col-span-4"
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.3 }}
						>
							<Card className="border-border/50 bg-card-gradient shadow-card">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<BarChart3 className="h-5 w-5 text-primary" />
										Income vs Expenses
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="h-[300px]">
										<ResponsiveContainer height="100%" width="100%">
											<AreaChart data={monthlyData}>
												<defs>
													<linearGradient
														id="incomeGrad"
														x1="0"
														x2="0"
														y1="0"
														y2="1"
													>
														<stop
															offset="0%"
															stopColor="hsl(160 84% 39%)"
															stopOpacity={0.3}
														/>
														<stop
															offset="100%"
															stopColor="hsl(160 84% 39%)"
															stopOpacity={0}
														/>
													</linearGradient>
													<linearGradient
														id="expenseGrad"
														x1="0"
														x2="0"
														y1="0"
														y2="1"
													>
														<stop
															offset="0%"
															stopColor="hsl(0 84% 60%)"
															stopOpacity={0.3}
														/>
														<stop
															offset="100%"
															stopColor="hsl(0 84% 60%)"
															stopOpacity={0}
														/>
													</linearGradient>
												</defs>
												<CartesianGrid
													stroke="hsl(217 33% 20%)"
													strokeDasharray="3 3"
													vertical={false}
												/>
												<XAxis
													axisLine={false}
													dataKey="month"
													tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
													tickLine={false}
												/>
												<YAxis
													axisLine={false}
													tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
													tickFormatter={(v) => `$${v / 1000}k`}
													tickLine={false}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "hsl(222 47% 13%)",
														border: "1px solid hsl(217 33% 20%)",
														borderRadius: "12px",
													}}
													labelStyle={{ color: "hsl(210 40% 98%)" }}
												/>
												<Area
													dataKey="income"
													fill="url(#incomeGrad)"
													stroke="hsl(160 84% 39%)"
													strokeWidth={2}
													type="monotone"
												/>
												<Area
													dataKey="expenses"
													fill="url(#expenseGrad)"
													stroke="hsl(0 84% 60%)"
													strokeWidth={2}
													type="monotone"
												/>
											</AreaChart>
										</ResponsiveContainer>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Spending by Category */}
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="lg:col-span-3"
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.35 }}
						>
							<Card className="h-full border-border/50 bg-card-gradient shadow-card">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<PieChart className="h-5 w-5 text-primary" />
										Spending by Category
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="h-[200px]">
										<ResponsiveContainer height="100%" width="100%">
											<RechartsPie>
												<Pie
													cx="50%"
													cy="50%"
													data={categoryData}
													dataKey="value"
													innerRadius={60}
													outerRadius={80}
													paddingAngle={2}
												>
													{categoryData.map((entry, index) => (
														<Cell fill={entry.color} key={`cell-${index}`} />
													))}
												</Pie>
												<Tooltip
													contentStyle={{
														backgroundColor: "hsl(222 47% 13%)",
														border: "1px solid hsl(217 33% 20%)",
														borderRadius: "12px",
													}}
												/>
											</RechartsPie>
										</ResponsiveContainer>
									</div>
									<div className="mt-4 grid grid-cols-2 gap-2">
										{categoryData.map((cat) => (
											<div className="flex items-center gap-2" key={cat.name}>
												<div
													className="h-3 w-3 rounded-full"
													style={{ backgroundColor: cat.color }}
												/>
												<span className="truncate text-muted-foreground text-xs">
													{cat.name}
												</span>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>

					<div className="grid gap-6 lg:grid-cols-2">
						{/* Weekly Spending */}
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.4 }}
						>
							<Card className="border-border/50 bg-card-gradient shadow-card">
								<CardHeader>
									<CardTitle>Weekly Spending</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="h-[200px]">
										<ResponsiveContainer height="100%" width="100%">
											<BarChart data={weeklySpending}>
												<CartesianGrid
													stroke="hsl(217 33% 20%)"
													strokeDasharray="3 3"
													vertical={false}
												/>
												<XAxis
													axisLine={false}
													dataKey="day"
													tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
													tickLine={false}
												/>
												<YAxis
													axisLine={false}
													tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
													tickLine={false}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "hsl(222 47% 13%)",
														border: "1px solid hsl(217 33% 20%)",
														borderRadius: "12px",
													}}
												/>
												<Bar
													dataKey="amount"
													fill="hsl(160 84% 39%)"
													radius={[4, 4, 0, 0]}
												/>
											</BarChart>
										</ResponsiveContainer>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Budget Progress */}
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.45 }}
						>
							<Card className="border-border/50 bg-card-gradient shadow-card">
								<CardHeader>
									<CardTitle>Budget Progress</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{budgets.map((item) => {
										const percentage = (item.spent / item.budget) * 100;
										const isOver = percentage > 100;
										return (
											<div className="space-y-2" key={item.category}>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<span>{item.icon}</span>
														<span className="font-medium text-sm">
															{item.category}
														</span>
													</div>
													<span
														className={`font-medium text-sm ${isOver ? "text-destructive" : ""}`}
													>
														${item.spent} / ${item.budget}
													</span>
												</div>
												<Progress
													className={`h-2 ${isOver ? "[&>div]:bg-destructive" : ""}`}
													value={Math.min(percentage, 100)}
												/>
											</div>
										);
									})}
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</main>
			</div>
		</DashboardLayout>
	);
}
