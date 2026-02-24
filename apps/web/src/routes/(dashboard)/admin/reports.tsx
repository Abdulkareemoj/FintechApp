import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowLeftRight,
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  FileText,
  Filter,
  LineChart,
  PieChart,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminLayout from "@/layout/AdminLayout";

export const Route = createFileRoute("/(dashboard)/admin/reports")({
  component: AdminReports,
});

const revenueData = [
  { month: "Jan", revenue: 125_000, fees: 45_000, volume: 2_500_000 },
  { month: "Feb", revenue: 142_000, fees: 52_000, volume: 2_800_000 },
  { month: "Mar", revenue: 158_000, fees: 58_000, volume: 3_100_000 },
  { month: "Apr", revenue: 175_000, fees: 65_000, volume: 3_500_000 },
  { month: "May", revenue: 192_000, fees: 72_000, volume: 3_800_000 },
  { month: "Jun", revenue: 210_000, fees: 78_000, volume: 4_200_000 },
];

const transactionTypeData = [
  { name: "Transfers", value: 45, color: "hsl(160, 84%, 39%)" },
  { name: "Payments", value: 25, color: "hsl(38, 92%, 50%)" },
  { name: "Deposits", value: 18, color: "hsl(200, 80%, 50%)" },
  { name: "Withdrawals", value: 12, color: "hsl(280, 70%, 50%)" },
];

const userGrowthData = [
  { month: "Jan", newUsers: 2450, activeUsers: 85_000 },
  { month: "Feb", newUsers: 2890, activeUsers: 87_500 },
  { month: "Mar", newUsers: 3120, activeUsers: 92_000 },
  { month: "Apr", newUsers: 3560, activeUsers: 98_500 },
  { month: "May", newUsers: 4100, activeUsers: 105_000 },
  { month: "Jun", newUsers: 4580, activeUsers: 112_000 },
];

const reportTemplates = [
  {
    title: "Monthly Revenue Report",
    description: "Comprehensive overview of platform revenue, fees, and volume",
    icon: DollarSign,
    type: "Financial",
    lastGenerated: "2024-03-01",
  },
  {
    title: "User Growth Analysis",
    description: "User acquisition, retention, and churn metrics",
    icon: Users,
    type: "Analytics",
    lastGenerated: "2024-03-15",
  },
  {
    title: "Transaction Volume Report",
    description: "Detailed breakdown of transaction patterns and volumes",
    icon: ArrowLeftRight,
    type: "Operations",
    lastGenerated: "2024-03-14",
  },
  {
    title: "Compliance Summary",
    description: "KYC/AML status, risk assessments, and compliance metrics",
    icon: FileText,
    type: "Compliance",
    lastGenerated: "2024-03-10",
  },
  {
    title: "Fee Analysis Report",
    description: "Platform fee collection and revenue breakdown by category",
    icon: BarChart3,
    type: "Financial",
    lastGenerated: "2024-03-12",
  },
  {
    title: "Risk Assessment Report",
    description: "User risk distribution and flagged activity summary",
    icon: TrendingUp,
    type: "Risk",
    lastGenerated: "2024-03-08",
  },
];

const summaryStats = [
  {
    title: "Total Revenue",
    value: "$1.2M",
    change: "+15.3%",
    period: "This Month",
  },
  {
    title: "Platform Fees",
    value: "$370K",
    change: "+12.8%",
    period: "This Month",
  },
  {
    title: "Transaction Volume",
    value: "$45.2M",
    change: "+18.5%",
    period: "This Month",
  },
  {
    title: "Active Users",
    value: "112K",
    change: "+8.2%",
    period: "This Month",
  },
];

function AdminReports() {
  const [dateRange, setDateRange] = useState("30d");

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-8 px-6 py-8">
          {" "}
          {/* Header */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, y: -20 }}
          >
            <div>
              <h1 className="font-bold text-3xl tracking-tight">
                Reports & Analytics
              </h1>
              <p className="text-muted-foreground">
                Operational reports, volume analysis, and financial insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select onValueChange={setDateRange} value={dateRange}>
                <SelectTrigger className="w-40 bg-muted/50">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </motion.div>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summaryStats.map((stat, index) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                key={stat.title}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card-gradient">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">
                          {stat.title}
                        </p>
                        <p className="mt-1 font-bold text-2xl">{stat.value}</p>
                      </div>
                      <Badge
                        className="border-success/50 text-success"
                        variant="outline"
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="mt-2 text-muted-foreground text-xs">
                      {stat.period}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Revenue Chart */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="border-border/50 bg-card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-amber-500" />
                    Revenue & Fees Trend
                  </CardTitle>
                  <CardDescription>
                    Monthly revenue and platform fees
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer height="100%" width="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient
                            id="revenueGradient"
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="hsl(160, 84%, 39%)"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(160, 84%, 39%)"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="feesGradient"
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="hsl(38, 92%, 50%)"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(38, 92%, 50%)"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          stroke="hsl(217, 33%, 20%)"
                          strokeDasharray="3 3"
                        />
                        <XAxis
                          dataKey="month"
                          fontSize={12}
                          stroke="hsl(215, 20%, 55%)"
                        />
                        <YAxis
                          fontSize={12}
                          stroke="hsl(215, 20%, 55%)"
                          tickFormatter={(value) =>
                            `$${(value / 1000).toFixed(0)}K`
                          }
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(222, 47%, 13%)",
                            border: "1px solid hsl(217, 33%, 20%)",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [
                            `$${value.toLocaleString()}`,
                            "",
                          ]}
                        />
                        <Area
                          dataKey="revenue"
                          fill="url(#revenueGradient)"
                          name="Revenue"
                          stroke="hsl(160, 84%, 39%)"
                          strokeWidth={2}
                          type="monotone"
                        />
                        <Area
                          dataKey="fees"
                          fill="url(#feesGradient)"
                          name="Fees"
                          stroke="hsl(38, 92%, 50%)"
                          strokeWidth={2}
                          type="monotone"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Transaction Types Pie Chart */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Card className="border-border/50 bg-card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-amber-500" />
                    Transaction Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown by transaction type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer height="100%" width="100%">
                      <RechartsPie>
                        <Pie
                          cx="50%"
                          cy="50%"
                          data={transactionTypeData}
                          dataKey="value"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                        >
                          {transactionTypeData.map((entry, index) => (
                            <Cell fill={entry.color} key={`cell-${index}`} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(222, 47%, 13%)",
                            border: "1px solid hsl(217, 33%, 20%)",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [`${value}%`, ""]}
                        />
                        <Legend
                          formatter={(value) => (
                            <span style={{ color: "hsl(215, 20%, 65%)" }}>
                              {value}
                            </span>
                          )}
                          height={36}
                          verticalAlign="bottom"
                        />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* User Growth Chart */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Card className="border-border/50 bg-card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-amber-500" />
                    User Growth
                  </CardTitle>
                  <CardDescription>
                    New registrations and active users over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer height="100%" width="100%">
                      <BarChart data={userGrowthData}>
                        <CartesianGrid
                          stroke="hsl(217, 33%, 20%)"
                          strokeDasharray="3 3"
                        />
                        <XAxis
                          dataKey="month"
                          fontSize={12}
                          stroke="hsl(215, 20%, 55%)"
                        />
                        <YAxis fontSize={12} stroke="hsl(215, 20%, 55%)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(222, 47%, 13%)",
                            border: "1px solid hsl(217, 33%, 20%)",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar
                          dataKey="newUsers"
                          fill="hsl(160, 84%, 39%)"
                          name="New Users"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          {/* Report Templates */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <Card className="border-border/50 bg-card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-500" />
                  Report Templates
                </CardTitle>
                <CardDescription>
                  Generate and download standardized reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {reportTemplates.map((report, index) => (
                    <motion.div
                      animate={{ opacity: 1, scale: 1 }}
                      className="group cursor-pointer rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                      initial={{ opacity: 0, scale: 0.95 }}
                      key={report.title}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-amber-500/10 p-2 transition-colors group-hover:bg-amber-500/20">
                          <report.icon className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="truncate font-medium text-sm">
                              {report.title}
                            </h4>
                            <Badge
                              className="shrink-0 text-xs"
                              variant="outline"
                            >
                              {report.type}
                            </Badge>
                          </div>
                          <p className="mt-1 line-clamp-2 text-muted-foreground text-xs">
                            {report.description}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-muted-foreground text-xs">
                              Last: {report.lastGenerated}
                            </span>
                            <Button
                              className="h-7 px-2"
                              size="sm"
                              variant="ghost"
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </AdminLayout>
  );
}
