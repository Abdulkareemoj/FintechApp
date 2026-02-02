import { router, useLocalSearchParams } from "expo-router";
import { AlertCircle, CheckCircle2 } from "lucide-react-native";
import * as React from "react";
import { ScrollView, type TextStyle, View } from "react-native";
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
import { useAuthStore } from "@/lib/authStore";
import { api } from "@/lib/api";

const RESEND_CODE_INTERVAL_SECONDS = 30;

const TABULAR_NUMBERS_STYLE: TextStyle = { fontVariant: ["tabular-nums"] };

function useCountdown(seconds = 30) {
  const [countdown, setCountdown] = React.useState(seconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = React.useCallback(() => {
    setCountdown(seconds);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  React.useEffect(() => {
    startCountdown();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startCountdown]);

  return { countdown, restartCountdown: startCountdown };
}

export default function VerifyEmailScreen() {
  const { countdown, restartCountdown } = useCountdown(
    RESEND_CODE_INTERVAL_SECONDS
  );
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  async function onSubmit() {
    if (!email) {
      setError(
        "Email is missing from the request. Please try signing up again."
      );
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post<{ message?: string }>("/api/auth/verify-email", {
        email,
        code,
      });

      if (!res.ok) {
        setError(res.error);
        return;
      }

      setSuccess(res.data.message ?? "Email verified. You can now sign in.");
      router.replace("/(auth)/sign-in" as any);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onResend() {
    if (!email) {
      setError(
        "Email is missing from the request. Please try signing up again."
      );
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post<{ message?: string }>(
        "/api/auth/resend-verification",
        { email }
      );

      if (!res.ok) {
        setError(res.error);
        return;
      }

      setSuccess(res.data.message ?? "Verification code sent.");
      restartCountdown();
    } catch {
      setError("Network error");
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
          <Card className="border-border/0 pb-4 shadow-none sm:border-border sm:shadow-black/5 sm:shadow-sm">
            <CardHeader>
              <CardTitle className="text-center text-2xl sm:text-left">
                Verify your email
              </CardTitle>
              <CardDescription className="text-center sm:text-left">
                Enter the verification code sent to {email || "your email"}
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-6">
              {error && (
                <Alert icon={AlertCircle} variant="destructive">
                  <AlertTitle>Verification Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert icon={CheckCircle2} variant="default">
                  <AlertTitle>Code Sent</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <View className="gap-6">
                <View className="gap-1.5">
                  <Label htmlFor="code">Verification code</Label>
                  <Input
                    autoCapitalize="none"
                    autoComplete="sms-otp"
                    id="code"
                    keyboardType="numeric"
                    onChangeText={setCode}
                    onSubmitEditing={onSubmit}
                    returnKeyType="send"
                    textContentType="oneTimeCode"
                    value={code}
                  />
                  <Button
                    disabled={countdown > 0}
                    onPress={onResend}
                    size="sm"
                    variant="link"
                  >
                    <Text className="text-center text-xs">
                      Didn&apos;t receive the code? Resend{" "}
                      {countdown > 0 ? (
                        <Text className="text-xs" style={TABULAR_NUMBERS_STYLE}>
                          ({countdown})
                        </Text>
                      ) : null}
                    </Text>
                  </Button>
                </View>
                <View className="gap-3">
                  <Button
                    className="w-full"
                    disabled={isSubmitting}
                    onPress={onSubmit}
                  >
                    <Text>Continue</Text>
                  </Button>
                  <Button
                    className="mx-auto"
                    onPress={() => {
                      router.back();
                    }}
                    variant="link"
                  >
                    <Text>Cancel</Text>
                  </Button>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
