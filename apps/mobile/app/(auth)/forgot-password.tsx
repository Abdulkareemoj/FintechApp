import { router } from "expo-router";
import { AlertCircle, CheckCircle2 } from "lucide-react-native";
import * as React from "react";
import { ScrollView, View } from "react-native";
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  async function onSubmit() {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post<{ message?: string }>(
        "/api/auth/forgot-password",
        {
          email,
        }
      );

      if (!res.ok) {
        setError(res.error);
        return;
      }

      setSuccess(
        res.data.message ??
          "If an account exists, a password reset link has been sent to your email."
      );
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
                Forgot password?
              </CardTitle>
              <CardDescription className="text-center sm:text-left">
                Enter your email to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-6">
              {error && (
                <Alert icon={AlertCircle} variant="destructive">
                  <AlertTitle>Request Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert icon={CheckCircle2} variant="default">
                  <AlertTitle>Request Sent</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <View className="gap-6">
                <View className="gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    autoCapitalize="none"
                    autoComplete="email"
                    id="email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    onSubmitEditing={onSubmit}
                    placeholder="m@example.com"
                    returnKeyType="send"
                    value={email}
                  />
                </View>
                <Button
                  className="w-full"
                  disabled={isSubmitting || !!success}
                  onPress={onSubmit}
                >
                  <Text>Reset your password</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
