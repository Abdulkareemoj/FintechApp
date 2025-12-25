import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download, LineChart, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/(dashboard)/reports")({
  component: ReportsPage,
});

const reportTypes = [
  {
    title: "Monthly Spending",
    icon: BarChart3,
    description: "Detailed breakdown of expenses by category.",
  },
  {
    title: "Income vs. Expense",
    icon: LineChart,
    description: "Track your financial health over time.",
  },
  {
    title: "Savings Progress",
    icon: PieChart,
    description: "Visualize progress towards your financial goals.",
  },
];

function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl tracking-tight">Financial Reports</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {reportTypes.map((report, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{report.title}</CardTitle>
              <report.icon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {report.description}
              </p>
              <Button className="w-full" size="sm">
                View Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Report Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select date ranges, accounts, and categories to generate a custom
            financial report. (Placeholder for form)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
