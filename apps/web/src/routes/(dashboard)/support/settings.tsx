import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Users,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Clock,
  Settings,
  Save,
  RefreshCw,
  Shield,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import SupportLayout from "@/layout/SupportLayout";

export const Route = createFileRoute("/(dashboard)/support/settings")({
  component: SupportSettings,
});

function SupportSettings() {
  return (
    <SupportLayout>
      <div className="min-h-screen bg-background">
        <main className="mx-auto space-y-8 px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold tracking-tight">Support Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure support team settings and preferences.
            </p>
          </motion.div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">General Settings</CardTitle>
                    <CardDescription>Basic support configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Default Response Time (hours)</Label>
                        <Input type="number" defaultValue="24" className="bg-muted/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Auto-assign Tickets</Label>
                        <Select defaultValue="round-robin">
                          <SelectTrigger className="bg-muted/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="round-robin">Round Robin</SelectItem>
                            <SelectItem value="least-busy">Least Busy</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Chat Support</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow customers to initiate live chat sessions
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>24/7 Support</Label>
                          <p className="text-sm text-muted-foreground">
                            Provide round-the-clock customer support
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Ticket Escalation</Label>
                          <p className="text-sm text-muted-foreground">
                            Auto-escalate high priority tickets
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Notification Settings</CardTitle>
                    <CardDescription>Configure how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>New Ticket Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when new tickets are created
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>High Priority Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Immediate alerts for high priority tickets
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive ticket updates via email
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label>Notification Email</Label>
                      <Input
                        type="email"
                        defaultValue="support@company.com"
                        className="bg-muted/50"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Channels */}
            <TabsContent value="channels" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Support Channels</CardTitle>
                    <CardDescription>Configure available support channels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <Label>Email Support</Label>
                            <Input
                              placeholder="support@company.com"
                              defaultValue="support@company.com"
                              className="bg-muted/50"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <Label>Live Chat</Label>
                            <div className="flex items-center gap-2">
                              <Switch defaultChecked />
                              <Badge variant="outline" className="text-xs">Active</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                            <Phone className="h-5 w-5 text-violet-400" />
                          </div>
                          <div className="flex-1">
                            <Label>Phone Support</Label>
                            <Input
                              placeholder="+1-800-SUPPORT"
                              defaultValue="+1-800-SUPPORT"
                              className="bg-muted/50"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-amber-400" />
                          </div>
                          <div className="flex-1">
                            <Label>Business Hours</Label>
                            <Input
                              placeholder="9:00 AM - 6:00 PM"
                              defaultValue="9:00 AM - 6:00 PM"
                              className="bg-muted/50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Team Settings */}
            <TabsContent value="team" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Team Management</CardTitle>
                    <CardDescription>Manage support team members and permissions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Team Members</Label>
                          <p className="text-sm text-muted-foreground">8 active support agents</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-2" />
                          Manage Team
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label>Default Ticket Response Template</Label>
                      <Textarea
                        placeholder="Thank you for contacting support. We have received your ticket and will respond within 24 hours..."
                        className="bg-muted/50 min-h-24"
                        defaultValue="Thank you for contacting support. We have received your ticket and will respond within 24 hours."
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Require Approval for Refunds</Label>
                        <p className="text-sm text-muted-foreground">
                          Manager approval required for refund processing
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-muted-foreground">
                      All changes are saved automatically
                    </span>
                  </div>
                  <Button className="bg-violet-500 hover:bg-violet-600">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </SupportLayout>
  );
}
