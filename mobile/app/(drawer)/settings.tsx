import React from "react";
import { ScrollView, View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [txAlertsEnabled, setTxAlertsEnabled] = React.useState(true);
  const [biometricEnabled, setBiometricEnabled] = React.useState(false);
  const [pinOnSendEnabled, setPinOnSendEnabled] = React.useState(true);
	const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
	const [loginAlertsEnabled, setLoginAlertsEnabled] = React.useState(true);

  return (
    <ScrollView className="flex-1 p-6">
      <View className="gap-4">
        <View className="gap-1">
          <Text className="font-bold text-3xl text-foreground">Settings</Text>
          <Text className="text-muted-foreground">
            Manage preferences and security settings.
          </Text>
			<Text className="font-medium text-amber-500 text-xs">Preview — changes are stored only on this device.</Text>
        </View>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text>Push notifications</Text>
              <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
            </View>
            <View className="flex-row items-center justify-between">
              <Text>Transaction alerts</Text>
              <Switch
                checked={txAlertsEnabled}
                onCheckedChange={setTxAlertsEnabled}
              />
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text>Biometric sign-in</Text>
              <Switch
                checked={biometricEnabled}
                onCheckedChange={setBiometricEnabled}
              />
            </View>
            <View className="flex-row items-center justify-between">
              <Text>Require PIN on send</Text>
              <Switch
                checked={pinOnSendEnabled}
                onCheckedChange={setPinOnSendEnabled}
              />
            </View>
			<View className="flex-row items-center justify-between">
				<Text>Two-factor authentication</Text>
				<Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
			</View>
			<View className="flex-row items-center justify-between">
				<Text>Login alerts</Text>
				<Switch checked={loginAlertsEnabled} onCheckedChange={setLoginAlertsEnabled} />
			</View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
