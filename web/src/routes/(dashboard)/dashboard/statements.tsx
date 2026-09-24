import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layout/DashboardLayout";

const statements = ["August 2026", "July 2026", "2026 tax summary"];

export const Route = createFileRoute("/(dashboard)/dashboard/statements")({ component: StatementsPage });

function StatementsPage() {
  return <DashboardLayout><main className="min-h-screen bg-background px-6 py-8"><div className="mx-auto max-w-5xl space-y-6"><div><div className="flex items-center gap-3"><h1 className="font-bold text-3xl tracking-tight">Statements</h1><Badge variant="outline">Preview</Badge></div><p className="mt-1 text-muted-foreground">Download your monthly account statements.</p><p className="mt-2 text-amber-600 text-sm">Statements are sample data until the statement service is connected.</p></div><Card><CardHeader><CardTitle>Available statements</CardTitle></CardHeader><CardContent className="space-y-2">{statements.map((statement) => <div className="flex items-center justify-between rounded-lg border border-border p-4" key={statement}><div className="flex items-center gap-3"><FileText className="size-5 text-primary" /><span className="font-medium">{statement}</span></div><Button disabled size="sm" variant="outline"><Download className="mr-2 size-4" />Download</Button></div>)}</CardContent></Card></div></main></DashboardLayout>;
}
