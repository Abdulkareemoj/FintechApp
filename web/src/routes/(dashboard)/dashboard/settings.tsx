import { createFileRoute } from "@tanstack/react-router";
import {
	Bell,
	Copy,
	CreditCard,
	Globe,
	Palette,
	Shield,
	User,
} from "lucide-react";
import { motion } from "motion/react";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useChangePassword,
	useProfile,
	useSettings,
	useUpdateProfile,
	useUpdateSettings,
} from "@/hooks/useProfile";
import {
	useDisableTwoFactor,
	useEnableTwoFactor,
	useTwoFactorSetup,
	useTwoFactorStatus,
} from "@/hooks/useTwoFactor";
import DashboardLayout from "@/layout/DashboardLayout";
import {
	extractErrorMessage,
	type UpdateSettingsInput,
} from "@/lib/api/profile";
import { useAuthStore } from "@/lib/authStore";

export const Route = createFileRoute("/(dashboard)/dashboard/settings")({
	component: SettingsPage,
});

const NOTIFICATION_FLAGS = [
	{
		key: "emailNotifications",
		title: "Email Notifications",
		description: "Receive updates about your transactions",
	},
	{
		key: "pushNotifications",
		title: "Push Notifications",
		description: "Get instant alerts on your device",
	},
	{
		key: "smsAlerts",
		title: "SMS Alerts",
		description: "Receive text messages for important activities",
	},
	{
		key: "transactionAlerts",
		title: "Large Transaction Alerts",
		description: "Get notified for large transactions",
	},
	{
		key: "loginAlerts",
		title: "Login Alerts",
		description: "Get notified when someone logs into your account",
	},
	{
		key: "marketingEmails",
		title: "Marketing Emails",
		description: "Receive news, updates, and promotional offers",
	},
] as const;

function SettingsPage() {
	const authUser = useAuthStore((state) => state.user);
	const updateUser = useAuthStore((state) => state.updateUser);

	const profileQuery = useProfile();
	const profile = profileQuery.data;
	const settingsQuery = useSettings();
	const settings = settingsQuery.data;

	const updateProfile = useUpdateProfile();
	const updateSettings = useUpdateSettings();
	const changePassword = useChangePassword();

	const twoFactorStatus = useTwoFactorStatus();
	const twoFactorSetup = useTwoFactorSetup();
	const enableTwoFactor = useEnableTwoFactor();
	const disableTwoFactor = useDisableTwoFactor();
	const [enableCode, setEnableCode] = useState("");
	const [disableInput, setDisableInput] = useState("");
	const twoFactorEnabled = twoFactorStatus.data?.enabled ?? false;
	const setupInfo = twoFactorSetup.data;

	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		phone: "",
		address: "",
		dob: "",
	});
	const [formInitialized, setFormInitialized] = useState(false);

	useEffect(() => {
		if (profile && !formInitialized) {
			setForm({
				firstName: profile.firstName ?? "",
				lastName: profile.lastName ?? "",
				phone: profile.phone ?? "",
				address: profile.address ?? "",
				dob: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
			});
			setFormInitialized(true);
		}
	}, [profile, formInitialized]);

	const [passwords, setPasswords] = useState({
		current: "",
		next: "",
		confirm: "",
	});

	const setField = (field: keyof typeof form, value: string) =>
		setForm((prev) => ({ ...prev, [field]: value }));

	const toggleSetting = (patch: UpdateSettingsInput) => {
		updateSettings.mutate(patch, {
			onError: (err) => toast.error(extractErrorMessage(err)),
		});
	};

	const handleProfileSubmit = (e: FormEvent) => {
		e.preventDefault();
		const firstName = form.firstName.trim();
		const lastName = form.lastName.trim();
		if (firstName.length < 2 || lastName.length < 2) {
			toast.error("First and last name must be at least 2 characters");
			return;
		}
		updateProfile.mutate(
			{
				firstName,
				lastName,
				phone: form.phone.trim() || null,
				address: form.address.trim() || null,
				dateOfBirth: form.dob || null,
			},
			{
				onSuccess: () => {
					updateUser({ firstName, lastName });
					toast.success("Profile updated");
				},
				onError: (err) => toast.error(extractErrorMessage(err)),
			},
		);
	};

	const handlePasswordSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (passwords.next !== passwords.confirm) {
			toast.error("New passwords do not match");
			return;
		}
		if (passwords.next.length < 8) {
			toast.error("New password must be at least 8 characters");
			return;
		}
		changePassword.mutate(
			{
				currentPassword: passwords.current,
				newPassword: passwords.next,
				confirmPassword: passwords.confirm,
			},
			{
				onSuccess: () => {
					toast.success("Password changed successfully");
					setPasswords({ current: "", next: "", confirm: "" });
				},
				onError: (err) => toast.error(extractErrorMessage(err)),
			},
		);
	};

	const profileReady = Boolean(profile);

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				{/* Main Content */}
				<main className="mx-auto space-y-6 px-6 py-8">
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 10 }}
					>
						<h1 className="font-bold text-3xl tracking-tight">Settings</h1>
						<p className="mt-1 text-muted-foreground">
							Manage your account preferences and security
						</p>
					</motion.div>

					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.1 }}
					>
						<Tabs className="space-y-6" defaultValue="profile">
							<TabsList className="bg-muted/50 p-1">
								<TabsTrigger className="gap-2" value="profile">
									<User className="h-4 w-4" />
									Profile
								</TabsTrigger>
								<TabsTrigger className="gap-2" value="security">
									<Shield className="h-4 w-4" />
									Security
								</TabsTrigger>
								<TabsTrigger className="gap-2" value="notifications">
									<Bell className="h-4 w-4" />
									Notifications
								</TabsTrigger>
								<TabsTrigger className="gap-2" value="preferences">
									<Palette className="h-4 w-4" />
									Preferences
								</TabsTrigger>
							</TabsList>

							<TabsContent value="profile">
								<Card className="border-border/50 bg-card-gradient shadow-card">
									<CardHeader>
										<CardTitle>Profile Information</CardTitle>
										<CardDescription>
											Update your personal details
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<form className="space-y-6" onSubmit={handleProfileSubmit}>
											{/* Avatar Section */}
											<div className="flex items-center gap-6">
												<Avatar className="h-20 w-20">
													<AvatarFallback className="text-2xl">
														{(
															(profile?.firstName?.[0] ??
																authUser?.firstName?.[0] ??
																"?") +
															(profile?.lastName?.[0] ??
																authUser?.lastName?.[0] ??
																"")
														).toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div className="space-y-2">
													<Button
														disabled
														size="sm"
														type="button"
														variant="outline"
													>
														Change Photo
													</Button>
													<p className="text-muted-foreground text-xs">
														Profile photos aren&apos;t supported yet.
													</p>
												</div>
											</div>

											<Separator />

											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label htmlFor="firstName">First Name</Label>
													<Input
														className="bg-muted/50"
														disabled={!profileReady}
														id="firstName"
														maxLength={60}
														onChange={(e) =>
															setField("firstName", e.target.value)
														}
														required
														value={form.firstName}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="lastName">Last Name</Label>
													<Input
														className="bg-muted/50"
														disabled={!profileReady}
														id="lastName"
														maxLength={60}
														onChange={(e) =>
															setField("lastName", e.target.value)
														}
														required
														value={form.lastName}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="email">Email Address</Label>
													<Input
														className="bg-muted/30"
														defaultValue={
															profile?.email ?? authUser?.email ?? ""
														}
														disabled
														id="email"
														type="email"
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="phone">Phone Number</Label>
													<Input
														className="bg-muted/50"
														disabled={!profileReady}
														id="phone"
														maxLength={30}
														onChange={(e) => setField("phone", e.target.value)}
														type="tel"
														value={form.phone}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="address">Address</Label>
													<Input
														className="bg-muted/50"
														disabled={!profileReady}
														id="address"
														maxLength={200}
														onChange={(e) =>
															setField("address", e.target.value)
														}
														value={form.address}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="dob">Date of Birth</Label>
													<Input
														className="bg-muted/50"
														disabled={!profileReady}
														id="dob"
														max={new Date().toISOString().slice(0, 10)}
														onChange={(e) => setField("dob", e.target.value)}
														type="date"
														value={form.dob}
													/>
												</div>
											</div>

											<div className="flex justify-end">
												<Button
													className="bg-primary-gradient"
													disabled={!profileReady || updateProfile.isPending}
												>
													{updateProfile.isPending ? "Saving…" : "Save Changes"}
												</Button>
											</div>
										</form>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="security">
								<div className="space-y-6">
									<Card className="border-border/50 bg-card-gradient shadow-card">
										<CardHeader>
											<CardTitle>Change Password</CardTitle>
											<CardDescription>
												Update your password to keep your account secure
											</CardDescription>
										</CardHeader>
										<CardContent>
											<form
												className="space-y-4"
												onSubmit={handlePasswordSubmit}
											>
												<div className="space-y-2">
													<Label htmlFor="currentPassword">
														Current Password
													</Label>
													<Input
														autoComplete="current-password"
														className="bg-muted/50"
														id="currentPassword"
														onChange={(e) =>
															setPasswords((prev) => ({
																...prev,
																current: e.target.value,
															}))
														}
														required
														type="password"
														value={passwords.current}
													/>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label htmlFor="newPassword">New Password</Label>
														<Input
															autoComplete="new-password"
															className="bg-muted/50"
															id="newPassword"
															onChange={(e) =>
																setPasswords((prev) => ({
																	...prev,
																	next: e.target.value,
																}))
															}
															required
															type="password"
															value={passwords.next}
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="confirmPassword">
															Confirm Password
														</Label>
														<Input
															autoComplete="new-password"
															className="bg-muted/50"
															id="confirmPassword"
															onChange={(e) =>
																setPasswords((prev) => ({
																	...prev,
																	confirm: e.target.value,
																}))
															}
															required
															type="password"
															value={passwords.confirm}
														/>
													</div>
												</div>
												<p className="text-muted-foreground text-xs">
													At least 8 characters with an uppercase letter,
													lowercase letter, number, and special character (@ $ !
													% * ? &amp;).
												</p>
												<Button
													disabled={changePassword.isPending}
													type="submit"
												>
													{changePassword.isPending
														? "Updating…"
														: "Update Password"}
												</Button>
											</form>
										</CardContent>
									</Card>

									<Card className="border-border/50 bg-card-gradient shadow-card">
										<CardHeader>
											<div className="flex items-center gap-2">
												<CardTitle>Two-Factor Authentication</CardTitle>
												<Badge
													variant={twoFactorEnabled ? "default" : "secondary"}
												>
													{twoFactorEnabled ? "Enabled" : "Off"}
												</Badge>
											</div>
											<CardDescription>
												Require a 6-digit code from your authenticator app when
												signing in
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											{!twoFactorEnabled && !setupInfo && (
												<div className="flex items-center justify-between">
													<div className="space-y-1">
														<p className="font-medium">Authenticator App</p>
														<p className="text-muted-foreground text-sm">
															Use an app like Google Authenticator, Authy, or
															1Password
														</p>
													</div>
													<Button
														disabled={twoFactorSetup.isPending}
														onClick={() =>
															twoFactorSetup.mutate(undefined, {
																onError: (err) =>
																	toast.error(extractErrorMessage(err)),
															})
														}
														variant="outline"
													>
														{twoFactorSetup.isPending
															? "Generating…"
															: "Set Up"}
													</Button>
												</div>
											)}

											{!twoFactorEnabled && setupInfo && (
												<div className="space-y-4">
													<div className="space-y-2">
														<p className="font-medium">
															Add this secret to your authenticator app
														</p>
														<p className="text-muted-foreground text-sm">
															Open your authenticator app, add a new account,
															and enter the secret manually (QR codes
															aren&apos;t supported yet).
														</p>
														<div className="flex items-center gap-2">
															<code className="flex-1 overflow-x-auto rounded-md bg-muted/50 px-3 py-2 font-mono text-sm break-all">
																{setupInfo.secret}
															</code>
															<Button
																onClick={() => {
																	navigator.clipboard.writeText(
																		setupInfo.secret,
																	);
																	toast.success("Secret copied");
																}}
																size="icon"
																type="button"
																variant="outline"
															>
																<Copy className="h-4 w-4" />
															</Button>
														</div>
													</div>
													<div className="space-y-2">
														<Label htmlFor="enableTwoFactorCode">
															Enter the 6-digit code to verify
														</Label>
														<div className="flex gap-2">
															<Input
																autoComplete="one-time-code"
																className="max-w-[180px]"
																inputMode="numeric"
																maxLength={6}
																onChange={(e) =>
																	setEnableCode(
																		e.target.value
																			.replace(/\D/g, "")
																			.slice(0, 6),
																	)
																}
																placeholder="123456"
																value={enableCode}
															/>
															<Button
																disabled={
																	enableTwoFactor.isPending ||
																	enableCode.length !== 6
																}
																onClick={() =>
																	enableTwoFactor.mutate(enableCode, {
																		onSuccess: () => {
																			setEnableCode("");
																			twoFactorSetup.reset();
																			toast.success(
																				"Two-factor authentication enabled",
																			);
																		},
																		onError: (err) =>
																			toast.error(extractErrorMessage(err)),
																	})
																}
															>
																{enableTwoFactor.isPending
																	? "Verifying…"
																	: "Verify & Enable"}
															</Button>
														</div>
													</div>
													<Button
														onClick={() => {
															twoFactorSetup.reset();
															setEnableCode("");
														}}
														type="button"
														variant="ghost"
													>
														Cancel
													</Button>
												</div>
											)}

											{twoFactorEnabled && (
												<>
													<div className="flex items-center justify-between">
														<div className="space-y-1">
															<p className="font-medium">Authenticator App</p>
															<p className="text-muted-foreground text-sm">
																Codes are required every time you sign in
															</p>
														</div>
													</div>
													<Separator />
													<div className="space-y-2">
														<Label htmlFor="disableTwoFactorInput">
															Enter your current 6-digit code or password to
															turn off 2FA
														</Label>
														<div className="flex gap-2">
															<Input
																className="max-w-[260px]"
																id="disableTwoFactorInput"
																onChange={(e) =>
																	setDisableInput(e.target.value)
																}
																type="password"
																value={disableInput}
															/>
															<Button
																disabled={
																	disableTwoFactor.isPending ||
																	!disableInput.trim()
																}
																onClick={() =>
																	disableTwoFactor.mutate(
																		{
																			code: /^\d{6}$/.test(disableInput.trim())
																				? disableInput.trim()
																				: undefined,
																			password: /^\d{6}$/.test(
																				disableInput.trim(),
																			)
																				? undefined
																				: disableInput,
																		},
																		{
																			onSuccess: () => {
																				setDisableInput("");
																				toast.success(
																					"Two-factor authentication disabled",
																				);
																			},
																			onError: (err) =>
																				toast.error(extractErrorMessage(err)),
																		},
																	)
																}
																variant="destructive"
															>
																{disableTwoFactor.isPending
																	? "Disabling…"
																	: "Disable 2FA"}
															</Button>
														</div>
													</div>
												</>
											)}
										</CardContent>
									</Card>

									<Card className="border-destructive/50 bg-card-gradient shadow-card">
										<CardHeader>
											<div className="flex items-center gap-2">
												<CardTitle className="text-destructive">
													Danger Zone
												</CardTitle>
												<Badge variant="outline">Preview</Badge>
											</div>
										</CardHeader>
										<CardContent>
											<div className="flex items-center justify-between">
												<div className="space-y-1">
													<p className="font-medium">Delete Account</p>
													<p className="text-muted-foreground text-sm">
														Permanently delete your account and all data
													</p>
												</div>
												<Button disabled size="sm" variant="destructive">
													Delete Account
												</Button>
											</div>
										</CardContent>
									</Card>
								</div>
							</TabsContent>

							<TabsContent value="notifications">
								<Card className="border-border/50 bg-card-gradient shadow-card">
									<CardHeader>
										<CardTitle>Notification Preferences</CardTitle>
										<CardDescription>
											Choose how you want to receive notifications
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										{NOTIFICATION_FLAGS.map((item) => (
											<div
												className="flex items-center justify-between"
												key={item.key}
											>
												<div className="space-y-1">
													<p className="font-medium">{item.title}</p>
													<p className="text-muted-foreground text-sm">
														{item.description}
													</p>
												</div>
												<Switch
													checked={settings?.[item.key] ?? false}
													disabled={!settings || updateSettings.isPending}
													onCheckedChange={(checked) =>
														toggleSetting({ [item.key]: checked })
													}
												/>
											</div>
										))}
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="preferences">
								<Card className="border-border/50 bg-card-gradient shadow-card">
									<CardHeader>
										<CardTitle>App Preferences</CardTitle>
										<CardDescription>
											Customize your app experience
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="grid gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label>Language</Label>
												<Select
													disabled={!settings}
													onValueChange={(value) => {
														if (value) toggleSetting({ language: value });
													}}
													value={settings?.language ?? "en"}
												>
													<SelectTrigger className="bg-muted/50">
														<Globe className="mr-2 h-4 w-4" />
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="en">English</SelectItem>
														<SelectItem value="es">Spanish</SelectItem>
														<SelectItem value="fr">French</SelectItem>
														<SelectItem value="de">German</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label>Currency</Label>
												<Select
													disabled={!settings}
													onValueChange={(value) => {
														if (value) toggleSetting({ currency: value });
													}}
													value={settings?.currency ?? "USD"}
												>
													<SelectTrigger className="bg-muted/50">
														<CreditCard className="mr-2 h-4 w-4" />
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="USD">USD ($)</SelectItem>
														<SelectItem value="EUR">EUR (€)</SelectItem>
														<SelectItem value="GBP">GBP (£)</SelectItem>
														<SelectItem value="NGN">NGN (₦)</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>

										<Separator />

										<div className="flex items-center justify-between">
											<div className="space-y-1">
												<p className="font-medium">Compact View</p>
												<p className="text-muted-foreground text-sm">
													Show more information in less space
												</p>
											</div>
											<Switch
												checked={settings?.compactView ?? false}
												disabled={!settings || updateSettings.isPending}
												onCheckedChange={(checked) =>
													toggleSetting({ compactView: checked })
												}
											/>
										</div>

										<div className="flex items-center justify-between">
											<div className="space-y-1">
												<p className="font-medium">Show Balance on Dashboard</p>
												<p className="text-muted-foreground text-sm">
													Display account balance by default
												</p>
											</div>
											<Switch
												checked={settings?.showBalance ?? false}
												disabled={!settings || updateSettings.isPending}
												onCheckedChange={(checked) =>
													toggleSetting({ showBalance: checked })
												}
											/>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</motion.div>
				</main>
			</div>
		</DashboardLayout>
	);
}
