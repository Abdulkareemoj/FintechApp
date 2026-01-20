import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  CreditCard,
  Globe,
  LogOut,
  Palette,
  Shield,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/layout/DashboardLayout";

export const Route = createFileRoute("/(dashboard)/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-6 px-6 py-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
          >
            <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your account preferences and security
            </p>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs className="space-y-6" defaultValue="profile">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger className="gap-2" value="profile">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger className="gap-2" value="security">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger className="gap-2" value="notifications">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger className="gap-2" value="preferences">
                  <Palette className="h-4 w-4" />
                  Preferences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="border-border/50 bg-card-gradient shadow-card">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal details and profile picture
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="text-2xl">JD</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button size="sm" variant="outline">
                          Change Photo
                        </Button>
                        <p className="text-muted-foreground text-xs">
                          JPG, PNG or GIF. Max 2MB.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          className="bg-muted/50"
                          defaultValue="John"
                          id="firstName"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          className="bg-muted/50"
                          defaultValue="Doe"
                          id="lastName"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          className="bg-muted/30"
                          defaultValue="john.doe@finpay.com"
                          disabled
                          id="email"
                          type="email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          className="bg-muted/50"
                          defaultValue="+1 (555) 123-4567"
                          id="phone"
                          type="tel"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-primary-gradient">
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <div className="space-y-6">
                  <Card className="border-border/50 bg-card-gradient shadow-card">
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <Input
                          className="bg-muted/50"
                          id="currentPassword"
                          type="password"
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            className="bg-muted/50"
                            id="newPassword"
                            type="password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">
                            Confirm Password
                          </Label>
                          <Input
                            className="bg-muted/50"
                            id="confirmPassword"
                            type="password"
                          />
                        </div>
                      </div>
                      <Button>Update Password</Button>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 bg-card-gradient shadow-card">
                    <CardHeader>
                      <CardTitle>Two-Factor Authentication</CardTitle>
                      <CardDescription>
                        Add an extra layer of security to your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">Authenticator App</p>
                          <p className="text-muted-foreground text-sm">
                            Use an app like Google Authenticator
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">SMS Authentication</p>
                          <p className="text-muted-foreground text-sm">
                            Receive codes via text message
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-destructive/50 bg-card-gradient shadow-card">
                    <CardHeader>
                      <CardTitle className="text-destructive">
                        Danger Zone
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">Delete Account</p>
                          <p className="text-muted-foreground text-sm">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <Button size="sm" variant="destructive">
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="border-border/50 bg-card-gradient shadow-card">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how you want to receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      {
                        title: "Email Notifications",
                        description: "Receive updates about your transactions",
                        defaultChecked: true,
                      },
                      {
                        title: "Push Notifications",
                        description: "Get instant alerts on your device",
                        defaultChecked: true,
                      },
                      {
                        title: "SMS Alerts",
                        description:
                          "Receive text messages for important activities",
                        defaultChecked: false,
                      },
                      {
                        title: "Large Transaction Alerts",
                        description: "Get notified for transactions over $500",
                        defaultChecked: true,
                      },
                      {
                        title: "Login Alerts",
                        description:
                          "Get notified when someone logs into your account",
                        defaultChecked: true,
                      },
                      {
                        title: "Marketing Emails",
                        description:
                          "Receive news, updates, and promotional offers",
                        defaultChecked: false,
                      },
                    ].map((item) => (
                      <div
                        className="flex items-center justify-between"
                        key={item.title}
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-muted-foreground text-sm">
                            {item.description}
                          </p>
                        </div>
                        <Switch defaultChecked={item.defaultChecked} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card className="border-border/50 bg-card-gradient shadow-card">
                  <CardHeader>
                    <CardTitle>App Preferences</CardTitle>
                    <CardDescription>
                      Customize your app experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger className="bg-muted/50">
                            <Globe className="mr-2 h-4 w-4" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select defaultValue="usd">
                          <SelectTrigger className="bg-muted/50">
                            <CreditCard className="mr-2 h-4 w-4" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="gbp">GBP (£)</SelectItem>
                            <SelectItem value="ngn">NGN (₦)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Compact View</p>
                        <p className="text-muted-foreground text-sm">
                          Show more information in less space
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Show Balance on Dashboard</p>
                        <p className="text-muted-foreground text-sm">
                          Display account balance by default
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </DashboardLayout>
  );
}
