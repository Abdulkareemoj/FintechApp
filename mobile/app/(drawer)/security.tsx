import React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Separator } from "@/components/ui/separator";
import { Shield, Fingerprint, Lock, Key, Smartphone, LogOut } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

export default function SecurityScreen() {
  const [biometric, setBiometric] = React.useState(true);
  const [pinOnSend, setPinOnSend] = React.useState(true);
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [notifyOnLogin, setNotifyOnLogin] = React.useState(true);

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Security</Text>
        <Text className="text-muted-foreground">Protect your account with security settings.</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1">
              <Icon as={Fingerprint} size={20} className="text-muted-foreground" />
              <View>
                <Text className="text-foreground text-sm">Biometric sign-in</Text>
                <Text className="text-muted-foreground text-xs">Use Face ID or fingerprint</Text>
              </View>
            </View>
            <Switch checked={biometric} onCheckedChange={setBiometric} />
          </View>
          <Separator />
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1">
              <Icon as={Key} size={20} className="text-muted-foreground" />
              <View>
                <Text className="text-foreground text-sm">Require PIN on send</Text>
                <Text className="text-muted-foreground text-xs">Confirm transfers with PIN</Text>
              </View>
            </View>
            <Switch checked={pinOnSend} onCheckedChange={setPinOnSend} />
          </View>
          <Separator />
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1">
              <Icon as={Shield} size={20} className="text-muted-foreground" />
              <View>
                <Text className="text-foreground text-sm">Two-factor auth</Text>
                <Text className="text-muted-foreground text-xs">Extra layer of security</Text>
              </View>
            </View>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessions & Devices</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="flex-row items-center gap-3 rounded-lg border border-border p-3">
            <Icon as={Smartphone} size={20} className="text-muted-foreground" />
            <View className="flex-1">
              <Text className="text-foreground text-sm font-medium">iPhone 15 Pro</Text>
              <Text className="text-muted-foreground text-xs">San Francisco, CA · Active now</Text>
            </View>
            <View className="h-2 w-2 rounded-full bg-emerald-500" />
          </View>
          <View className="flex-row items-center gap-3 rounded-lg border border-border p-3">
            <Icon as={Smartphone} size={20} className="text-muted-foreground" />
            <View className="flex-1">
              <Text className="text-foreground text-sm font-medium">Windows Chrome</Text>
              <Text className="text-muted-foreground text-xs">San Francisco, CA · 2 hrs ago</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1">
              <Icon as={Lock} size={20} className="text-muted-foreground" />
              <View>
                <Text className="text-foreground text-sm">Login notifications</Text>
                <Text className="text-muted-foreground text-xs">Alert on new device login</Text>
              </View>
            </View>
            <Switch checked={notifyOnLogin} onCheckedChange={setNotifyOnLogin} />
          </View>
          <Separator />
          <Button variant="outline" className="flex-row gap-2">
            <Icon as={LogOut} size={18} className="text-red-500" />
            <Text className="text-red-500">Sign out all devices</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
