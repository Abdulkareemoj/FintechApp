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

const reportTypes = [
  {
    title: "Monthly Spending",
    icon: BarChart3,
    description: "Detailed breakdown of expenses by category.",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Income vs. Expense",
    icon: LineChart,
    description: "Track your financial health over time.",
    color: "bg-success/10 text-success",
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
    description: "Annual tax-related income and deductions.",
    color: "bg-violet-500/10 text-violet-500",
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
    description: "Comprehensive yearly financial summary.",
    color: "bg-pink-500/10 text-pink-500",
  },
];

const recentReports = [
  { name: "July 2024 Spending Report", date: "2024-07-20", type: "PDF" },
  { name: "Q2 2024 Summary", date: "2024-07-01", type: "PDF" },
  { name: "June 2024 Spending Report", date: "2024-06-30", type: "PDF" },
  { name: "Investment Report Q2", date: "2024-06-15", type: "PDF" },
];
export const Route = createFileRoute("/(dashboard)/dashboard/reports")({
  component: ReportsPage,
});

function ReportsPage() {
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
              <h1 className="font-bold text-3xl tracking-tight">
                Financial Reports
              </h1>
              <p className="mt-1 text-muted-foreground">
                Generate and download detailed financial reports
              </p>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </motion.div>

          {/* Report Types Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((report, index) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                key={report.title}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="group h-full cursor-pointer border-border/50 bg-card-gradient shadow-card transition-all duration-300 hover:shadow-elevated">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {report.title}
                      </CardTitle>
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
                    <Button className="w-full" size="sm" variant="secondary">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
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
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input className="bg-muted/50" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input className="bg-muted/50" type="date" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Report Type</Label>
                    <Select>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spending">
                          Spending Report
                        </SelectItem>
                        <SelectItem value="income">Income Report</SelectItem>
                        <SelectItem value="summary">Summary Report</SelectItem>
                        <SelectItem value="tax">Tax Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Accounts</Label>
                    <Select>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select accounts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Accounts</SelectItem>
                        <SelectItem value="checking">
                          Checking Account
                        </SelectItem>
                        <SelectItem value="savings">Savings Account</SelectItem>
                        <SelectItem value="business">
                          Business Account
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                        <SelectItem value="excel">Excel Workbook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-primary-gradient">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Custom Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Reports */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.45 }}
            >
              <Card className="border-border/50 bg-card-gradient shadow-card">
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentReports.map((report, index) => (
                    <motion.div
                      animate={{ opacity: 1, x: 0 }}
                      className="group flex items-center justify-between rounded-xl bg-accent/30 p-4 transition-colors hover:bg-accent/50"
                      initial={{ opacity: 0, x: 10 }}
                      key={index}
                      transition={{ delay: 0.45 + index * 0.05 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-destructive/10 p-2">
                          <FileText className="h-4 w-4 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{report.name}</p>
                          <p className="text-muted-foreground text-xs">
                            Generated{" "}
                            {new Date(report.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        size="sm"
                        variant="ghost"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                  <Button className="w-full text-primary" variant="ghost">
                    View All Reports
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
