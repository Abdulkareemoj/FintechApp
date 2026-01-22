import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Shield,
  UserCheck,
  Users,
  UserX,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminLayout from "@/layout/AdminLayout";

export const Route = createFileRoute("/(dashboard)/admin/users")({
  component: AdminUsers,
});

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "active" | "pending" | "suspended" | "banned";
  kycStatus: "verified" | "pending" | "rejected";
  joinDate: string;
  totalTransactions: number;
  balance: number;
  dailyLimit: number;
  monthlyLimit: number;
  riskLevel: "low" | "medium" | "high";
}

const mockUsers: User[] = [
  {
    id: "USR-001",
    name: "John Doe",
    email: "john.doe@email.com",
    status: "active",
    kycStatus: "verified",
    joinDate: "2024-01-15",
    totalTransactions: 156,
    balance: 12_500.0,
    dailyLimit: 5000,
    monthlyLimit: 50_000,
    riskLevel: "low",
  },
  {
    id: "USR-002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    status: "active",
    kycStatus: "verified",
    joinDate: "2024-02-20",
    totalTransactions: 89,
    balance: 8750.5,
    dailyLimit: 5000,
    monthlyLimit: 50_000,
    riskLevel: "low",
  },
  {
    id: "USR-003",
    name: "Robert Johnson",
    email: "robert.j@email.com",
    status: "pending",
    kycStatus: "pending",
    joinDate: "2024-03-10",
    totalTransactions: 12,
    balance: 1200.0,
    dailyLimit: 1000,
    monthlyLimit: 10_000,
    riskLevel: "medium",
  },
  {
    id: "USR-004",
    name: "Emily Brown",
    email: "emily.b@email.com",
    status: "suspended",
    kycStatus: "verified",
    joinDate: "2024-01-05",
    totalTransactions: 234,
    balance: 0,
    dailyLimit: 0,
    monthlyLimit: 0,
    riskLevel: "high",
  },
  {
    id: "USR-005",
    name: "Michael Wilson",
    email: "m.wilson@email.com",
    status: "active",
    kycStatus: "rejected",
    joinDate: "2024-03-25",
    totalTransactions: 5,
    balance: 500.0,
    dailyLimit: 500,
    monthlyLimit: 5000,
    riskLevel: "high",
  },
];

const stats = [
  { title: "Total Users", value: "124,892", icon: Users, change: "+2.5%" },
  {
    title: "Verified Users",
    value: "98,456",
    icon: UserCheck,
    change: "+1.8%",
  },
  { title: "Pending KYC", value: "3,421", icon: Clock, change: "-12.3%" },
  { title: "Suspended", value: "1,205", icon: UserX, change: "+0.5%" },
];

const statusColors = {
  active: "border-success/50 text-success",
  pending: "border-warning/50 text-warning",
  suspended: "border-destructive/50 text-destructive",
  banned: "border-destructive/50 text-destructive",
};

const kycColors = {
  verified: "border-success/50 text-success",
  pending: "border-warning/50 text-warning",
  rejected: "border-destructive/50 text-destructive",
};

const riskColors = {
  low: "border-success/50 text-success",
  medium: "border-warning/50 text-warning",
  high: "border-destructive/50 text-destructive",
};

function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-8 px-6 py-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: -20 }}
          >
            <h1 className="font-bold text-3xl tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Verify, suspend, and manage user accounts and limits
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
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
                    <p className="mt-2 text-success text-xs">
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Users Table */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="border-border/50 bg-card-gradient">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-amber-500" />
                      All Users
                    </CardTitle>
                    <CardDescription>
                      Manage and monitor user accounts
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative">
                      <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="w-full bg-muted/50 pl-10 sm:w-64"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users..."
                        value={searchQuery}
                      />
                    </div>
                    <Select
                      onValueChange={setStatusFilter}
                      value={statusFilter}
                    >
                      <SelectTrigger className="w-full bg-muted/50 sm:w-40">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>KYC</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead className="text-right">
                          Transactions
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user, index) => (
                        <motion.tr
                          animate={{ opacity: 1, x: 0 }}
                          className="border-border/50 hover:bg-muted/30"
                          initial={{ opacity: 0, x: -20 }}
                          key={user.id}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="bg-muted">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-muted-foreground text-xs">
                                  {user.email}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {user.id}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={statusColors[user.status]}
                              variant="outline"
                            >
                              {user.status === "active" && (
                                <CheckCircle className="mr-1 h-3 w-3" />
                              )}
                              {user.status === "pending" && (
                                <Clock className="mr-1 h-3 w-3" />
                              )}
                              {user.status === "suspended" && (
                                <XCircle className="mr-1 h-3 w-3" />
                              )}
                              {user.status === "banned" && (
                                <Ban className="mr-1 h-3 w-3" />
                              )}
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={kycColors[user.kycStatus]}
                              variant="outline"
                            >
                              {user.kycStatus === "verified" && (
                                <Shield className="mr-1 h-3 w-3" />
                              )}
                              {user.kycStatus === "pending" && (
                                <Clock className="mr-1 h-3 w-3" />
                              )}
                              {user.kycStatus === "rejected" && (
                                <AlertTriangle className="mr-1 h-3 w-3" />
                              )}
                              {user.kycStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={riskColors[user.riskLevel]}
                              variant="outline"
                            >
                              {user.riskLevel}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${user.balance.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {user.totalTransactions}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="border-border bg-card"
                              >
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsLimitDialogOpen(true);
                                  }}
                                >
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  Set Limits
                                </DropdownMenuItem>
                                {user.kycStatus === "pending" && (
                                  <DropdownMenuItem className="text-success">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Verify KYC
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                {user.status === "active" ? (
                                  <DropdownMenuItem className="text-warning">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Suspend User
                                  </DropdownMenuItem>
                                ) : user.status === "suspended" ? (
                                  <DropdownMenuItem className="text-success">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Reactivate User
                                  </DropdownMenuItem>
                                ) : null}
                                <DropdownMenuItem className="text-destructive">
                                  <Ban className="mr-2 h-4 w-4" />
                                  Ban User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Set Limits Dialog */}
          <Dialog onOpenChange={setIsLimitDialogOpen} open={isLimitDialogOpen}>
            <DialogContent className="border-border bg-card">
              <DialogHeader>
                <DialogTitle>Set User Limits</DialogTitle>
                <DialogDescription>
                  Configure transaction limits for {selectedUser?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="dailyLimit">Daily Limit ($)</Label>
                  <Input
                    className="bg-muted/50"
                    defaultValue={selectedUser?.dailyLimit}
                    id="dailyLimit"
                    type="number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="monthlyLimit">Monthly Limit ($)</Label>
                  <Input
                    className="bg-muted/50"
                    defaultValue={selectedUser?.monthlyLimit}
                    id="monthlyLimit"
                    type="number"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setIsLimitDialogOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button className="bg-amber-500 text-white hover:bg-amber-600">
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </AdminLayout>
  );
}
