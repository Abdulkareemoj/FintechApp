import { createFileRoute } from "@tanstack/react-router";
import {
	AlertTriangle,
	Bell,
	CheckCheck,
	CheckCircle2,
	CreditCard,
	DollarSign,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import {
	useMarkAllNotificationsRead,
	useMarkNotificationRead,
	useNotifications,
	useNotificationsUnreadCount,
} from "@/hooks/useNotifications";
import DashboardLayout from "@/layout/DashboardLayout";

const typeIcons: Record<string, typeof Bell> = {
	Payment: DollarSign,
	Security: AlertTriangle,
	Card: CreditCard,
	Bill: Bell,
	System: CheckCircle2,
};

const typeColors: Record<string, string> = {
	Security: "bg-red-500/10 text-red-500",
	Payment: "bg-emerald-500/10 text-emerald-500",
	Card: "bg-primary/10 text-primary",
	Bill: "bg-warning/10 text-warning",
	System: "bg-muted text-muted-foreground",
};

export const Route = createFileRoute("/(dashboard)/dashboard/notifications")({
	component: NotificationsPage,
});

function NotificationsPage() {
	const {
		data: notifications,
		isPending,
		isError,
		refetch,
	} = useNotifications();
	const { data: unreadData } = useNotificationsUnreadCount();
	const markRead = useMarkNotificationRead();
	const markAllRead = useMarkAllNotificationsRead();

	const unreadCount = unreadData?.count ?? 0;
	const hasUnread = (notifications ?? []).some((n) => !n.isRead);

	const handleMarkAll = async () => {
		try {
			await markAllRead.mutateAsync();
			toast.success("All notifications marked as read");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Update failed");
		}
	};

	const handleOpen = (notificationId: string, isRead: boolean) => {
		if (!isRead) {
			markRead.mutate(notificationId);
		}
	};

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				<main className="mx-auto space-y-6 px-6 py-8">
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col justify-between gap-4 pb-4 md:flex-row md:items-center"
						initial={{ opacity: 0, y: 10 }}
					>
						<div>
							<h1 className="font-bold text-3xl tracking-tight">
								Notifications
							</h1>
							<p className="mt-1 text-muted-foreground">
								Alerts, updates, and activity from your account
							</p>
						</div>
						{hasUnread && (
							<Button onClick={handleMarkAll} variant="outline">
								<CheckCheck className="mr-2 h-4 w-4" />
								Mark all read
							</Button>
						)}
					</motion.div>

					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.1 }}
					>
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<span>Recent</span>
									{unreadCount > 0 && (
										<Badge className="text-xs">{unreadCount} unread</Badge>
									)}
								</CardTitle>
								<CardDescription>
									Tap a notification to mark it as read
								</CardDescription>
							</CardHeader>
							<CardContent>
								{isPending ? (
									<div className="flex justify-center py-10">
										<Spinner />
									</div>
								) : isError ? (
									<Empty className="border-0">
										<EmptyHeader>
											<EmptyTitle>Couldn't load notifications</EmptyTitle>
											<EmptyDescription>
												Something went wrong while fetching notifications.
											</EmptyDescription>
										</EmptyHeader>
										<Button onClick={() => refetch()} variant="outline">
											Retry
										</Button>
									</Empty>
								) : (notifications ?? []).length === 0 ? (
									<Empty className="border-0">
										<EmptyHeader>
											<EmptyTitle>No notifications yet</EmptyTitle>
											<EmptyDescription>
												You're all caught up. New alerts will appear here.
											</EmptyDescription>
										</EmptyHeader>
									</Empty>
								) : (
									<div className="divide-y divide-border rounded-xl border border-border">
										{(notifications ?? []).map((notification) => {
											const Icon = typeIcons[notification.type] ?? Bell;
											const color =
												typeColors[notification.type] ??
												"bg-muted text-muted-foreground";
											return (
												<Button
													className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent/40 ${notification.isRead ? "" : "bg-accent/30"}`}
													key={notification.id}
													onClick={() =>
														handleOpen(notification.id, notification.isRead)
													}
													type="button"
												>
													<div className={`rounded-full p-2 ${color}`}>
														<Icon className="h-4 w-4" />
													</div>
													<div className="min-w-0 flex-1">
														<div className="flex items-center justify-between gap-2">
															<p
																className={`text-sm ${notification.isRead ? "text-foreground" : "font-semibold"}`}
															>
																{notification.title}
															</p>
															<p className="shrink-0 text-muted-foreground text-xs">
																{new Date(
																	notification.createdAt,
																).toLocaleDateString()}
															</p>
														</div>
														<p className="mt-0.5 text-muted-foreground text-sm">
															{notification.body}
														</p>
													</div>
													{!notification.isRead && (
														<span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
													)}
												</button>
											);
										})}
									</div>
								)}
							</CardContent>
						</Card>
					</motion.div>
				</main>
			</div>
		</DashboardLayout>
	);
}
