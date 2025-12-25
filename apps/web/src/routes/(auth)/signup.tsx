import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type SignUpFormValues, signUpSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
// import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(auth)/signup")({
  component: SignUp,
});

function SignUp() {
  // const router = useRouter();
  // const [image, setImage] = useState<File | null>(null);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];

  //   if (file) {
  //     setImage(file);

  //     const reader = new FileReader();

  //     reader.onloadend = () => {
  //       setImagePreview(reader.result as string);
  //     };

  //     reader.readAsDataURL(file);
  //   }
  // };

  // Initialize the form with React Hook Form and Zod resolver
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
    },
  });
  // Handle form submission
  // async function handleSignUp(values: SignUpFormValues) {
  //   try {
  //     await signUp.email(
  //       {
  //         email: values.email,
  //         password: values.password,
  //         name: `${values.firstName} ${values.lastName}`,
  //         username: values.username,
  //         image: image ? await convertImageToBase64(image) : "",
  //       },
  //       {
  //         onRequest: () => {
  //           setIsLoading(true);
  //           setServerError(null);
  //         },
  //         onResponse: () => {
  //           setIsLoading(false);
  //         },
  //         onError: (ctx: { error: { message: string } }) => {
  //           setServerError(ctx.error.message);
  //         },
  //         onSuccess: async () => {
  //           toast.success("Account created successfully!");
  //           router.navigate({ to: "/dashboard" });
  //         },
  //       }
  //     );
  //   } catch (err) {
  //     setServerError((err as Error)?.message || "Something went wrong");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <form
                  className="p-6 md:p-8"
                  // onSubmit={form.handleSubmit(handleSignUp)}
                >
                  {/* {serverError && (
                    <div className="text-center font-medium text-destructive text-sm">
                      {serverError}
                    </div>
                  )} */}
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="font-bold text-2xl">Create an account</h1>
                      <p className="text-balance text-muted-foreground">
                        Enter your details to sign up
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="username"
                                type="text"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="email"
                                type="email"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="firstName">Firstname</FormLabel>
                            <FormControl>
                              <Input type="text" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="lastName">Lastname</FormLabel>
                            <FormControl>
                              <Input type="text" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="new-password"
                                type="password"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="confirmPassword">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="new-password"
                                type="password"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      className="w-full"
                      disabled={isLoading}
                      type="submit"
                    >
                      {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                    <div className="text-center text-sm">
                      Already have an account?{" "}
                      <Link
                        className="underline underline-offset-4"
                        to={"/signin" as any}
                      >
                        Sign in
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
              <div className="relative hidden bg-muted md:block">
                <img
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                  src="/placeholder.svg"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-muted-foreground text-xs *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
            By clicking continue, you agree to our{" "}
            <Link to="/terms-of-service">Terms of Service </Link> and{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
