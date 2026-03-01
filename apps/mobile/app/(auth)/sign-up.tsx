import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { AlertCircle } from "lucide-react-native";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, type TextInput, View } from "react-native";
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
import { type SignUpFormValues, signUpSchema } from "@/lib/schemas";
import { showToast } from "@/lib/toast";

type RegisterResponse =
  | {
      requiresEmailVerification: true;
    }
  | {
      requiresEmailVerification?: false;
      accessToken: string;
      refreshToken: string;
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: "User" | "Admin" | "Support" | "Merchant";
      };
    };

export default function SignUpScreen() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit(values: SignUpFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await api.post<RegisterResponse>("/api/auth/register", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      if (!res.ok) {
        setError(res.error);
        showToast({
          title: "Sign-up failed",
          message: res.error,
          type: "error",
        });
        return;
      }

      if (
        "requiresEmailVerification" in res.data &&
        res.data.requiresEmailVerification
      ) {
        router.replace({
          pathname: "/(auth)/verify-email" as any,
          params: { email: values.email },
        } as any);
        return;
      }

      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      showToast({
        title: "Account created",
        message: "Welcome!",
        type: "success",
      });
      router.replace("/(drawer)" as any);
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
                Create your account
              </CardTitle>
              <CardDescription className="text-center sm:text-left">
                Welcome! Please fill in the details to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-6">
              {error && (
                <Alert icon={AlertCircle} variant="destructive">
                  <AlertTitle>Sign-up Failed</AlertTitle>
                  <AlertDescription>
                    {error.includes("unique constraint")
                      ? "This email is already in use."
                      : error}
                  </AlertDescription>
                </Alert>
              )}
              <View className="gap-6">
                <Controller
                  control={form.control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <View className="gap-1.5">
                      <Label htmlFor={field.name}>First name</Label>
                      <Input
                        autoCapitalize="words"
                        autoComplete="given-name"
                        editable={!isSubmitting}
                        id={field.name}
                        onBlur={field.onBlur}
                        onChangeText={field.onChange}
                        placeholder="John"
                        returnKeyType="next"
                        submitBehavior="submit"
                        value={field.value}
                      />
                      {fieldState.error?.message && (
                        <Text className="text-destructive text-sm">
                          {fieldState.error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={form.control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <View className="gap-1.5">
                      <Label htmlFor={field.name}>Last name</Label>
                      <Input
                        autoCapitalize="words"
                        autoComplete="family-name"
                        editable={!isSubmitting}
                        id={field.name}
                        onBlur={field.onBlur}
                        onChangeText={field.onChange}
                        placeholder="Doe"
                        returnKeyType="next"
                        submitBehavior="submit"
                        value={field.value}
                      />
                      {fieldState.error?.message && (
                        <Text className="text-destructive text-sm">
                          {fieldState.error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <View className="gap-1.5">
                      <Label htmlFor={field.name}>Email</Label>
                      <Input
                        autoCapitalize="none"
                        autoComplete="email"
                        editable={!isSubmitting}
                        id={field.name}
                        keyboardType="email-address"
                        onBlur={field.onBlur}
                        onChangeText={field.onChange}
                        onSubmitEditing={onEmailSubmitEditing}
                        placeholder="m@example.com"
                        returnKeyType="next"
                        submitBehavior="submit"
                        value={field.value}
                      />
                      {fieldState.error?.message && (
                        <Text className="text-destructive text-sm">
                          {fieldState.error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <View className="gap-1.5">
                      <View className="flex-row items-center">
                        <Label htmlFor={field.name}>Password</Label>
                      </View>
                      <Input
                        editable={!isSubmitting}
                        id={field.name}
                        onBlur={field.onBlur}
                        onChangeText={field.onChange}
                        onSubmitEditing={onEmailSubmitEditing}
                        ref={passwordInputRef}
                        returnKeyType="next"
                        secureTextEntry
                        value={field.value}
                      />
                      {fieldState.error?.message && (
                        <Text className="text-destructive text-sm">
                          {fieldState.error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={form.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <View className="gap-1.5">
                      <View className="flex-row items-center">
                        <Label htmlFor={field.name}>Confirm password</Label>
                      </View>
                      <Input
                        editable={!isSubmitting}
                        id={field.name}
                        onBlur={field.onBlur}
                        onChangeText={field.onChange}
                        onSubmitEditing={form.handleSubmit(onSubmit)}
                        returnKeyType="send"
                        secureTextEntry
                        value={field.value}
                      />
                      {fieldState.error?.message && (
                        <Text className="text-destructive text-sm">
                          {fieldState.error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
                <Button
                  className="w-full"
                  disabled={isSubmitting}
                  onPress={form.handleSubmit(onSubmit)}
                >
                  <Text>
                    {isSubmitting ? "Creating Account..." : "Continue"}
                  </Text>
                </Button>
              </View>
              <View className="flex flex-row items-center justify-center gap-2 text-sm">
                <Text>Already have an account?</Text>
                <Pressable
                  onPress={() => {
                    router.push("/(auth)/sign-in");
                  }}
                >
                  <Text className="text-sm underline underline-offset-4">
                    Sign In
                  </Text>
                </Pressable>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
