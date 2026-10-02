import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useSettings, useUpdateSettings } from "@/hooks/useProfile";
import {
  useDisableTwoFactor,
  useEnableTwoFactor,
  useTwoFactorSetup,
  useTwoFactorStatus,
} from "@/hooks/useTwoFactor";
import type { UpdateSettingsInput } from "@/lib/api/profile";

function ToggleRow({
  label,
  checked,
  disabled,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className={disabled ? "text-muted-foreground" : "text-foreground"}>
        {label}
      </Text>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const settingsQuery = useSettings();
  const settings = settingsQuery.data;
  const updateSettings = useUpdateSettings();

  const twoFactorStatus = useTwoFactorStatus();
  const twoFactorSetup = useTwoFactorSetup();
  const enableTwoFactor = useEnableTwoFactor();
  const disableTwoFactor = useDisableTwoFactor();
  const [enableCode, setEnableCode] = React.useState("");
  const [disableInput, setDisableInput] = React.useState("");

  const twoFactorEnabled = twoFactorStatus.data?.enabled ?? false;
  const setupInfo = twoFactorSetup.data;

  const [biometricEnabled, setBiometricEnabled] = React.useState(false);
  const [pinOnSendEnabled, setPinOnSendEnabled] = React.useState(true);

  const busy = !settings || updateSettings.isPending;

  const showError = (err: unknown) =>
    Alert.alert(
      "Failed",
      err instanceof Error ? err.message : "Try again later.",
    );

  const toggle = (patch: UpdateSettingsInput) => {
    updateSettings.mutate(patch, {
      onError: (err) =>
        Alert.alert(
          "Failed",
          err instanceof Error ? err.message : "Try again later.",
        ),
    });
  };

  if (settingsQuery.isPending) {
    return (
      <ScrollView className="flex-1 p-6">
        <View className="gap-4">
          <View className="gap-1">
            <Text className="font-bold text-3xl text-foreground">Settings</Text>
            <Text className="text-muted-foreground">
              Manage preferences and security settings.
            </Text>
          </View>
          {[0, 1].map((i) => (
            <Card key={`settings-skeleton-${i.toString()}`}>
              <CardContent className="gap-4 py-4">
                {[0, 1, 2].map((j) => (
                  <Skeleton
                    className="h-6 w-full"
                    key={`row-${i.toString()}-${j.toString()}`}
                  />
                ))}
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>
    );
  }

  if (settingsQuery.isError || !settings) {
    return (
      <ScrollView className="flex-1 p-6">
        <View className="gap-4">
          <Text className="font-bold text-3xl text-foreground">Settings</Text>
          <Card>
            <CardContent className="items-center gap-3 py-6">
              <Text className="text-muted-foreground text-sm">
                Couldn&apos;t load your settings.
              </Text>
              <Button
                onPress={() => settingsQuery.refetch()}
                size="sm"
                variant="outline"
              >
                <Text>Try again</Text>
              </Button>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 p-6">
      <View className="gap-4">
        <View className="gap-1">
          <Text className="font-bold text-3xl text-foreground">Settings</Text>
          <Text className="text-muted-foreground">
            Manage preferences and security settings.
          </Text>
        </View>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="gap-4">
            <ToggleRow
              checked={settings.pushNotifications}
              disabled={busy}
              label="Push notifications"
              onCheckedChange={(checked) =>
                toggle({ pushNotifications: checked })
              }
            />
            <ToggleRow
              checked={settings.transactionAlerts}
              disabled={busy}
              label="Transaction alerts"
              onCheckedChange={(checked) =>
                toggle({ transactionAlerts: checked })
              }
            />
            <ToggleRow
              checked={settings.emailNotifications}
              disabled={busy}
              label="Email notifications"
              onCheckedChange={(checked) =>
                toggle({ emailNotifications: checked })
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="gap-4">
            <ToggleRow
              checked={settings.loginAlerts}
              disabled={busy}
              label="Login alerts"
              onCheckedChange={(checked) => toggle({ loginAlerts: checked })}
            />
            <ToggleRow
              checked={biometricEnabled}
              label="Biometric sign-in"
              onCheckedChange={setBiometricEnabled}
            />
            <ToggleRow
              checked={pinOnSendEnabled}
              label="Require PIN on send"
              onCheckedChange={setPinOnSendEnabled}
            />
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-foreground">
                    Two-factor authentication
                  </Text>
                  <Text className="text-muted-foreground text-xs">
                    {twoFactorEnabled
                      ? "A 6-digit code is required at sign-in"
                      : "Protect your account with an authenticator app"}
                  </Text>
                </View>
                <Text
                  className={
                    twoFactorEnabled
                      ? "font-medium text-primary text-sm"
                      : "text-muted-foreground text-sm"
                  }
                >
                  {twoFactorStatus.isPending
                    ? "…"
                    : twoFactorEnabled
                      ? "Enabled"
                      : "Off"}
                </Text>
              </View>

              {!twoFactorEnabled && !setupInfo && (
                <Button
                  disabled={twoFactorSetup.isPending}
                  onPress={() =>
                    twoFactorSetup.mutate(undefined, { onError: showError })
                  }
                  size="sm"
                  variant="outline"
                >
                  <Text>
                    {twoFactorSetup.isPending
                      ? "Generating…"
                      : "Set Up Authenticator"}
                  </Text>
                </Button>
              )}

              {!twoFactorEnabled && setupInfo ? (
                <View className="gap-2">
                  <Text className="text-muted-foreground text-xs">
                    Add this secret to your authenticator app manually (QR
                    codes aren&apos;t supported yet):
                  </Text>
                  <Text className="font-mono text-sm">{setupInfo.secret}</Text>
                  <Input
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    maxLength={6}
                    onChangeText={(text) =>
                      setEnableCode(text.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="123456"
                    value={enableCode}
                  />
                  <View className="flex-row gap-2">
                    <Button
                      className="flex-1"
                      disabled={
                        enableTwoFactor.isPending || enableCode.length !== 6
                      }
                      onPress={() =>
                        enableTwoFactor.mutate(enableCode, {
                          onSuccess: () => {
                            setEnableCode("");
                            twoFactorSetup.reset();
                            Alert.alert(
                              "Enabled",
                              "Two-factor authentication is now on.",
                            );
                          },
                          onError: showError,
                        })
                      }
                    >
                      <Text>
                        {enableTwoFactor.isPending
                          ? "Verifying…"
                          : "Verify & Enable"}
                      </Text>
                    </Button>
                    <Button
                      onPress={() => {
                        twoFactorSetup.reset();
                        setEnableCode("");
                      }}
                      variant="ghost"
                    >
                      <Text>Cancel</Text>
                    </Button>
                  </View>
                </View>
              ) : null}

              {twoFactorEnabled ? (
                <View className="gap-2">
                  <Text className="text-muted-foreground text-xs">
                    Enter your current 6-digit code or password to turn off
                    two-factor authentication.
                  </Text>
                  <Input
                    onChangeText={setDisableInput}
                    placeholder="Code or password"
                    secureTextEntry
                    value={disableInput}
                  />
                  <Button
                    disabled={
                      disableTwoFactor.isPending || !disableInput.trim()
                    }
                    onPress={() => {
                      const trimmed = disableInput.trim();
                      const isCode = /^\d{6}$/.test(trimmed);
                      disableTwoFactor.mutate(
                        isCode ? { code: trimmed } : { password: trimmed },
                        {
                          onSuccess: () => {
                            setDisableInput("");
                            Alert.alert(
                              "Disabled",
                              "Two-factor authentication is now off.",
                            );
                          },
                          onError: showError,
                        },
                      );
                    }}
                    size="sm"
                    variant="destructive"
                  >
                    <Text>
                      {disableTwoFactor.isPending
                        ? "Disabling…"
                        : "Disable 2FA"}
                    </Text>
                  </Button>
                </View>
              ) : null}
            </View>
            <Text className="text-muted-foreground text-xs">
              Biometric sign-in and PIN are stored on this device.
            </Text>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
