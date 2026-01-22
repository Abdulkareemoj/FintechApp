import { createFileRoute } from "@tanstack/react-router";
import MerchantLayout from "@/layout/MerchantLayout";
import { motion } from "framer-motion";
import {
  Building2,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Palette,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/(dashboard)/merchant/settings")({
  component: MerchantSettings,
});

function MerchantSettings() {
  return (
    <MerchantLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-8 px-6 py-8">{/* Header */}      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your merchant account and payment preferences.</p>
      </motion.div>

      <Tabs defaultValue="business" className="space-y-4">
        <TabsList className="bg-muted/50 grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="business" className="gap-2">
            <Building2 className="h-4 w-4 hidden sm:inline" />
            Business
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4 hidden sm:inline" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4 hidden sm:inline" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="checkout" className="gap-2">
            <Palette className="h-4 w-4 hidden sm:inline" />
            Checkout
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4 hidden sm:inline" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Update your business details and legal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input defaultValue="Acme Corporation" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Legal Name</Label>
                    <Input defaultValue="Acme Corp Inc." className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Email</Label>
                    <Input defaultValue="billing@acmecorp.com" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input defaultValue="+1 (555) 123-4567" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Business Address</Label>
                    <Textarea defaultValue="123 Business Ave, Suite 100, San Francisco, CA 94102" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax ID / EIN</Label>
                    <Input defaultValue="XX-XXXXXXX" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select defaultValue="saas">
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saas">SaaS / Software</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="services">Professional Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="bg-violet-500 hover:bg-violet-600">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="payments">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Configure accepted payment methods.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Credit Cards", description: "Visa, Mastercard, Amex, Discover", enabled: true },
                  { name: "Digital Wallets", description: "Apple Pay, Google Pay, Samsung Pay", enabled: true },
                  { name: "Bank Transfers", description: "ACH, Wire transfers", enabled: true },
                  { name: "Cryptocurrency", description: "Bitcoin, Ethereum, USDC", enabled: false },
                ].map((method) => (
                  <div key={method.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    <Switch defaultChecked={method.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Currency Settings</CardTitle>
                <CardDescription>Set your default and accepted currencies.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD - US Dollar</SelectItem>
                        <SelectItem value="eur">EUR - Euro</SelectItem>
                        <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Settlement Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD - US Dollar</SelectItem>
                        <SelectItem value="eur">EUR - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Payment Received", description: "Get notified for every successful payment", enabled: true },
                  { name: "Payment Failed", description: "Alerts when payments fail or are declined", enabled: true },
                  { name: "Large Transactions", description: "Notifications for transactions over $1,000", enabled: true },
                  { name: "Settlement Complete", description: "When funds are deposited to your bank", enabled: true },
                  { name: "Daily Summary", description: "Daily recap of all transactions", enabled: false },
                  { name: "Weekly Reports", description: "Weekly analytics and performance reports", enabled: true },
                  { name: "Dispute Alerts", description: "Immediate alerts for chargebacks and disputes", enabled: true },
                ].map((notification) => (
                  <div key={notification.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">{notification.name}</p>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <Switch defaultChecked={notification.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="checkout">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Checkout Customization</CardTitle>
                <CardDescription>Customize the appearance of your payment pages.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Brand Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" defaultValue="#8B5CF6" className="w-14 h-10 p-1" />
                      <Input defaultValue="#8B5CF6" className="bg-muted/50 font-mono" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input placeholder="https://yoursite.com/logo.png" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Name (shown on checkout)</Label>
                    <Input defaultValue="Acme Corp" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input defaultValue="support@acmecorp.com" className="bg-muted/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Custom Success Message</Label>
                  <Textarea defaultValue="Thank you for your purchase! Your order is being processed." className="bg-muted/50" />
                </div>
                <Button className="bg-violet-500 hover:bg-violet-600">
                  <Save className="h-4 w-4 mr-2" />
                  Save Customization
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="font-medium text-emerald-400">2FA Enabled</p>
                      <p className="text-sm text-muted-foreground">Using authenticator app</p>
                    </div>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Fraud Prevention</CardTitle>
                <CardDescription>Configure fraud detection and prevention settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "3D Secure", description: "Require 3DS verification for card payments", enabled: true },
                  { name: "CVV Verification", description: "Always require CVV for transactions", enabled: true },
                  { name: "Address Verification", description: "Verify billing address matches card", enabled: true },
                  { name: "Velocity Checks", description: "Block rapid successive transactions", enabled: true },
                  { name: "Block VPN/Proxy", description: "Decline payments from VPN/proxy IPs", enabled: false },
                ].map((setting) => (
                  <div key={setting.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">{setting.name}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch defaultChecked={setting.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs></main>
      </div>
    </MerchantLayout>
  );
}
