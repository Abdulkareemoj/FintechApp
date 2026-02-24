import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileCheck,
  FileText,
  MapPin,
  Search,
  Shield,
  ShieldAlert,
  TrendingUp,
  Upload,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/layout/AdminLayout";

export const Route = createFileRoute("/(dashboard)/admin/compliance")({
  component: AdminCompliance,
});

interface KYCRequest {
  id: string;
  user: { name: string; email: string; avatar?: string };
  submittedAt: string;
  documents: string[];
  status: "pending" | "approved" | "rejected" | "under_review";
  riskLevel: "low" | "medium" | "high";
  country: string;
  documentType: string;
}

interface AMLAlert {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  user: string;
  timestamp: string;
  status: "open" | "investigating" | "resolved" | "escalated";
}

const kycRequests: KYCRequest[] = [
  {
    id: "KYC-001",
    user: { name: "John Doe", email: "john@email.com" },
    submittedAt: "2024-03-15T10:30:00",
    documents: ["Passport", "Utility Bill"],
    status: "pending",
    riskLevel: "low",
    country: "United States",
    documentType: "Passport",
  },
  {
    id: "KYC-002",
    user: { name: "Jane Smith", email: "jane@email.com" },
    submittedAt: "2024-03-15T09:15:00",
    documents: ["Driver License", "Bank Statement"],
    status: "under_review",
    riskLevel: "medium",
    country: "United Kingdom",
    documentType: "Driver License",
  },
  {
    id: "KYC-003",
    user: { name: "Robert Johnson", email: "robert@email.com" },
    submittedAt: "2024-03-14T16:45:00",
    documents: ["National ID", "Tax Document"],
    status: "approved",
    riskLevel: "low",
    country: "Germany",
    documentType: "National ID",
  },
  {
    id: "KYC-004",
    user: { name: "Emily Brown", email: "emily@email.com" },
    submittedAt: "2024-03-14T14:20:00",
    documents: ["Passport"],
    status: "rejected",
    riskLevel: "high",
    country: "Nigeria",
    documentType: "Passport",
  },
];

const amlAlerts: AMLAlert[] = [
  {
    id: "AML-001",
    type: "Structuring",
    severity: "high",
    description: "Multiple transactions just under reporting threshold",
    user: "john.doe@email.com",
    timestamp: "2024-03-15T14:30:00",
    status: "investigating",
  },
  {
    id: "AML-002",
    type: "Unusual Pattern",
    severity: "critical",
    description: "Sudden large transaction from dormant account",
    user: "suspicious@email.com",
    timestamp: "2024-03-15T13:45:00",
    status: "escalated",
  },
  {
    id: "AML-003",
    type: "High-Risk Country",
    severity: "medium",
    description: "Transaction to sanctioned region",
    user: "trader@email.com",
    timestamp: "2024-03-15T12:20:00",
    status: "open",
  },
  {
    id: "AML-004",
    type: "PEP Match",
    severity: "high",
    description: "Politically Exposed Person detected",
    user: "vip.client@email.com",
    timestamp: "2024-03-15T11:00:00",
    status: "investigating",
  },
];

const complianceStats = [
  { title: "Pending KYC", value: "42", icon: Clock, change: "-12%" },
  { title: "Approved Today", value: "156", icon: CheckCircle, change: "+8%" },
  { title: "AML Alerts", value: "23", icon: ShieldAlert, change: "-5%" },
  {
    title: "Compliance Rate",
    value: "98.5%",
    icon: TrendingUp,
    change: "+0.3%",
  },
];

const statusColors = {
  pending: "border-warning/50 text-warning",
  approved: "border-success/50 text-success",
  rejected: "border-destructive/50 text-destructive",
  under_review: "border-amber-500/50 text-amber-500",
  open: "border-warning/50 text-warning",
  investigating: "border-amber-500/50 text-amber-500",
  resolved: "border-success/50 text-success",
  escalated: "border-destructive/50 text-destructive",
};

const severityColors = {
  low: "border-success/50 text-success bg-success/10",
  medium: "border-warning/50 text-warning bg-warning/10",
  high: "border-amber-500/50 text-amber-500 bg-amber-500/10",
  critical: "border-destructive/50 text-destructive bg-destructive/10",
};

function AdminCompliance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("kyc");

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-8 px-6 py-8">
          {/* Header */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: -20 }}
          >
            <h1 className="font-bold text-3xl tracking-tight">
              Compliance & Risk
            </h1>
            <p className="text-muted-foreground">
              KYC verification, AML monitoring, and risk management
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {complianceStats.map((stat, index) => (
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
                      <div className="rounded-xl bg-amber-500/10 p-3">
                        <stat.icon className="h-5 w-5 text-amber-500" />
                      </div>
                    </div>
                    <p
                      className={`mt-2 text-xs ${
                        stat.change.startsWith("+")
                          ? "text-success"
                          : "text-destructive"
                      }`}
                    >
                      {stat.change} from last week
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="border-border/50 bg-card-gradient">
              <Tabs
                className="w-full"
                onValueChange={setActiveTab}
                value={activeTab}
              >
                <CardHeader>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <TabsList className="bg-muted/50">
                      <TabsTrigger
                        className="flex items-center gap-2"
                        value="kyc"
                      >
                        <FileCheck className="h-4 w-4" />
                        KYC Verification
                      </TabsTrigger>
                      <TabsTrigger
                        className="flex items-center gap-2"
                        value="aml"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        AML Alerts
                        <Badge className="ml-1 bg-destructive/20 text-destructive">
                          4
                        </Badge>
                      </TabsTrigger>
                    </TabsList>
                    <div className="relative">
                      <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="w-full bg-muted/50 pl-10 sm:w-64"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        value={searchQuery}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <TabsContent className="mt-0" value="kyc">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border/50 hover:bg-transparent">
                            <TableHead>User</TableHead>
                            <TableHead>Documents</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Risk Level</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {kycRequests.map((request, index) => (
                            <motion.tr
                              animate={{ opacity: 1, x: 0 }}
                              className="border-border/50 hover:bg-muted/30"
                              initial={{ opacity: 0, x: -20 }}
                              key={request.id}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                            >
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={request.user.avatar} />
                                    <AvatarFallback className="bg-muted">
                                      {request.user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {request.user.name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                      {request.user.email}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {request.documents.map((doc) => (
                                    <Badge
                                      className="text-xs"
                                      key={doc}
                                      variant="outline"
                                    >
                                      {doc}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  {request.country}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={statusColors[request.status]}
                                  variant="outline"
                                >
                                  {request.status === "pending" && (
                                    <Clock className="mr-1 h-3 w-3" />
                                  )}
                                  {request.status === "approved" && (
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                  )}
                                  {request.status === "rejected" && (
                                    <XCircle className="mr-1 h-3 w-3" />
                                  )}
                                  {request.status === "under_review" && (
                                    <Eye className="mr-1 h-3 w-3" />
                                  )}
                                  {request.status.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    request.riskLevel === "low"
                                      ? "border-success/50 text-success"
                                      : request.riskLevel === "medium"
                                        ? "border-warning/50 text-warning"
                                        : "border-destructive/50 text-destructive"
                                  }
                                  variant="outline"
                                >
                                  {request.riskLevel}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {formatDate(request.submittedAt)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button size="icon" variant="ghost">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {request.status === "pending" && (
                                    <>
                                      <Button
                                        className="text-success hover:text-success"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        className="text-destructive hover:text-destructive"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent className="mt-0" value="aml">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border/50 hover:bg-transparent">
                            <TableHead>Alert ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {amlAlerts.map((alert, index) => (
                            <motion.tr
                              animate={{ opacity: 1, x: 0 }}
                              className={`border-border/50 hover:bg-muted/30 ${
                                alert.severity === "critical"
                                  ? "bg-destructive/5"
                                  : ""
                              }`}
                              initial={{ opacity: 0, x: -20 }}
                              key={alert.id}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                            >
                              <TableCell className="font-mono text-sm">
                                {alert.id}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{alert.type}</Badge>
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {alert.description}
                              </TableCell>
                              <TableCell className="text-sm">
                                {alert.user}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={severityColors[alert.severity]}
                                >
                                  {alert.severity === "critical" && (
                                    <AlertTriangle className="mr-1 h-3 w-3" />
                                  )}
                                  {alert.severity}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={statusColors[alert.status]}
                                  variant="outline"
                                >
                                  {alert.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {formatDate(alert.timestamp)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button size="icon" variant="ghost">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </motion.div>
        </main>
      </div>
    </AdminLayout>
  );
}
