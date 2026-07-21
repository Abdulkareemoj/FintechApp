import { router, useLocalSearchParams } from "expo-router";
import { AlertCircle } from "lucide-react-native";
import * as React from "react";
import { ScrollView, type TextInput, View } from "react-native";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const confirmInputRef = React.useRef<TextInput>(null);

  function onPasswordSubmitEditing() {
    confirmInputRef.current?.focus();
  }

  async function onSubmit() {
    if (!token) {
      setError("Reset token is missing. Please open the link from your email.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await api.post<{ message?: string }>(
        "/auth/reset-password",
        {
          token,
          newPassword: password,
          confirmPassword,
        }
      );

      if (!res.ok) {
        setError(res.error);
        return;
      }

      router.replace("/(auth)/sign-in" as any);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView
      contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
    >
      <View className="w-full max-w-sm">
        <View className="gap-6">
          <Card className="border-border/0 shadow-none sm:border-border sm:shadow-black/5 sm:shadow-sm">
            <CardHeader>
              <CardTitle className="text-center text-2xl sm:text-left">
                Reset password
              </CardTitle>
              <CardDescription className="text-center sm:text-left">
                Enter the code sent to your email and set a new password
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-6">
              {error && (
                <Alert icon={AlertCircle} variant="destructive">
                  <AlertTitle>Reset Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <View className="gap-6">
                <View className="gap-1.5">
                  <View className="flex-row items-center">
                    <Label htmlFor="password">New password</Label>
                  </View>
                  <Input
                    id="password"
                    onChangeText={setPassword}
                    onSubmitEditing={onPasswordSubmitEditing}
                    returnKeyType="next"
                    secureTextEntry
                    submitBehavior="submit"
                    value={password}
                  />
                </View>
                <View className="gap-1.5">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    autoCapitalize="none"
                    autoComplete="new-password"
                    id="confirmPassword"
                    onChangeText={setConfirmPassword}
                    onSubmitEditing={onSubmit}
                    ref={confirmInputRef}
                    returnKeyType="send"
                    secureTextEntry
                    value={confirmPassword}
                  />
                </View>
                <Button
                  className="w-full"
                  disabled={isSubmitting}
                  onPress={onSubmit}
                >
                  <Text>Reset Password</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
