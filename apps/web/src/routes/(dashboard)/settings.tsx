import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/(dashboard)/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl tracking-tight">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input defaultValue="John Doe" id="name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input defaultValue="john.doe@finpay.com" disabled id="email" />
              </div>
              <Button>Save Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <Button>Update Password</Button>
              <div className="flex items-center justify-between border-t pt-4">
                <Label htmlFor="mfa">Two-Factor Authentication (2FA)</Label>
                <Switch id="mfa" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch defaultChecked id="email-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-alerts">
                  SMS Alerts for large transactions
                </Label>
                <Switch id="sms-alerts" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <Switch id="marketing-emails" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
