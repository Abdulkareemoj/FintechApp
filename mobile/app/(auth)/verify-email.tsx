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
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";

const RESEND_CODE_INTERVAL_SECONDS = 30;

const TABULAR_NUMBERS_STYLE: TextStyle = { fontVariant: ["tabular-nums"] };

function useCountdown(seconds = 30) {
  const [countdown, setCountdown] = React.useState(seconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const restartCountdown = React.useCallback(() => {
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
    restartCountdown();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [restartCountdown]);

  return { countdown, restartCountdown };
}

export default function VerifyEmailScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");

  // Auto-submit if token is present
  React.useEffect(() => {
    if (token) {
      handleVerify();
    }
  }, [token]);

  async function handleVerify() {
    if (!token) {
      setStatus("error");
      setError("Missing verification token");
      return;
    }
    setIsSubmitting(true);
    setStatus("verifying");
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post<{ message?: string }>(
        "/auth/verify-email",
        { token }
      );

      if (!res.ok) {
        setStatus("error");
        setError(res.error);
        return;
      }

      setStatus("success");
      setSuccess(res.data.message ?? "Email verified successfully");
      // Navigate to sign-in after a delay
      setTimeout(() => {
        router.replace("/(auth)/sign-in" as any);
      }, 2000);
    } catch {
      setStatus("error");
      setError("Verification failed. Please try again.");
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
        "/auth/send-verification-email",
        { email },
        { auth: true }
      );

      if (!res.ok) {
        setError(res.error);
        return;
      }

      setSuccess(res.data.message ?? "Verification email sent.");
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
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              {status === "verifying" && (
                <Alert icon={AlertCircle} variant="default">
                  <AlertTitle>Verifying...</AlertTitle>
                  <AlertDescription>
                    Please wait while we verify your email.
                  </AlertDescription>
                </Alert>
              )}
              {!token && (
                <View className="gap-3">
                  <Text className="text-center text-muted-foreground">
                    No verification token provided. Please check your email and
                    click the verification link.
                  </Text>
                </View>
              )}
              {token && status === "idle" && (
                <Button
                  className="w-full"
                  disabled={isSubmitting}
                  onPress={handleVerify}
                >
                  {isSubmitting ? "Verifying..." : "Verify Email"}
                </Button>
              )}
            </CardContent>
          </Card>
          <View className="flex flex-row justify-center gap-2">
            <Button
              disabled={countdown > 0}
              onPress={onResend}
              size="sm"
              variant="link"
            >
              <Text className="text-center text-xs">
                Didn&apos;t receive the email? Resend{" "}
                {countdown > 0 ? (
                  <Text className="text-xs" style={TABULAR_NUMBERS_STYLE}>
                    ({countdown})
                  </Text>
                ) : null}
              </Text>
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
      </View>
    </ScrollView>
  );
}
