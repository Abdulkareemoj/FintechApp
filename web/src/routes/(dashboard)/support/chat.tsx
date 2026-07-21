import { createFileRoute } from "@tanstack/react-router";
import {
	Check,
	Paperclip,
	Phone,
	Search,
	Send,
	Users,
	Video,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import SupportLayout from "@/layout/SupportLayout";

export const Route = createFileRoute("/(dashboard)/support/chat")({
	component: SupportChat,
});

interface ChatMessage {
	id: string;
	sender: "user" | "agent";
	name: string;
	content: string;
	timestamp: string;
	read: boolean;
}

interface Chat {
	id: string;
	userName: string;
	email: string;
	lastMessage: string;
	unread: number;
	status: "online" | "away" | "offline";
	messages: ChatMessage[];
}

const mockChats: Chat[] = [
	{
		id: "CHAT-001",
		userName: "John Doe",
		email: "john@email.com",
		lastMessage: "I still can't see the transaction in my history",
		unread: 2,
		status: "online",
		messages: [
			{
				id: "m1",
				sender: "user",
				name: "John Doe",
				content: "Hi, I need help with a recent transaction",
				timestamp: "10:32 AM",
				read: true,
			},
			{
				id: "m2",
				sender: "agent",
				name: "You",
				content: "Sure John, I'd be happy to help. Which transaction is this about?",
				timestamp: "10:33 AM",
				read: true,
			},
			{
				id: "m3",
				sender: "user",
				name: "John Doe",
				content: "The wire transfer to account ending in 4521 for $3,000",
				timestamp: "10:34 AM",
				read: true,
			},
			{
				id: "m4",
				sender: "agent",
				name: "You",
				content: "Let me check that for you. One moment please.",
				timestamp: "10:35 AM",
				read: true,
			},
			{
				id: "m5",
				sender: "user",
				name: "John Doe",
				content: "I still can't see the transaction in my history",
				timestamp: "10:37 AM",
				read: false,
			},
		],
	},
	{
		id: "CHAT-002",
		userName: "Sarah Smith",
		email: "sarah@email.com",
		lastMessage: "Thank you for your help!",
		unread: 0,
		status: "offline",
		messages: [
			{
				id: "m6",
				sender: "user",
				name: "Sarah Smith",
				content: "How do I increase my daily transfer limit?",
				timestamp: "9:15 AM",
				read: true,
			},
			{
				id: "m7",
				sender: "agent",
				name: "You",
				content: "You can request a limit increase through Settings > Limits. I can also process it from here if you'd like.",
				timestamp: "9:16 AM",
				read: true,
			},
			{
				id: "m8",
				sender: "user",
				name: "Sarah Smith",
				content: "Please process it from your end",
				timestamp: "9:17 AM",
				read: true,
			},
			{
				id: "m9",
				sender: "agent",
				name: "You",
				content: "Done! Your daily limit has been increased to $10,000. Please allow 1 hour for the change to take effect.",
				timestamp: "9:18 AM",
				read: true,
			},
			{
				id: "m10",
				sender: "user",
				name: "Sarah Smith",
				content: "Thank you for your help!",
				timestamp: "9:19 AM",
				read: true,
			},
		],
	},
	{
		id: "CHAT-003",
		userName: "Mike Johnson",
		email: "mike@email.com",
		lastMessage: "My card was declined at the grocery store",
		unread: 1,
		status: "away",
		messages: [
			{
				id: "m11",
				sender: "user",
				name: "Mike Johnson",
				content: "My card was declined at the grocery store",
				timestamp: "11:00 AM",
				read: false,
			},
		],
	},
];

function SupportChat() {
	const [search, setSearch] = useState("");
	const [activeChat, setActiveChat] = useState<Chat | null>(mockChats[0]);
	const [messageInput, setMessageInput] = useState("");

	const filtered = mockChats.filter(
		(c) =>
			search === "" ||
			c.userName.toLowerCase().includes(search.toLowerCase()) ||
			c.email.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<SupportLayout>
			<div className="min-h-screen bg-background">
				<main className="mx-auto space-y-8 px-6 py-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="h-[calc(100vh-12rem)]"
					>
						<div className="mb-6">
							<h1 className="font-bold text-3xl text-foreground tracking-tight">
								Support Chat
							</h1>
							<p className="mt-1 text-muted-foreground">
								Real-time conversations with users needing assistance.
							</p>
						</div>

						<div className="flex h-full gap-6">
							{/* Chat List */}
							<Card className="w-80 shrink-0">
								<CardHeader className="pb-3">
									<div className="relative">
										<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
										<Input
											className="h-9 pl-9"
											placeholder="Search conversations..."
											value={search}
											onChange={(e) => setSearch(e.target.value)}
										/>
									</div>
								</CardHeader>
								<CardContent className="p-0">
									<div className="divide-y">
										{filtered.map((chat) => (
											<button
												key={chat.id}
												type="button"
												onClick={() => setActiveChat(chat)}
												className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
													activeChat?.id === chat.id ? "bg-muted" : ""
												}`}
											>
												<div className="relative">
													<Avatar className="h-9 w-9">
														<AvatarFallback className="text-xs">
															{chat.userName
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</AvatarFallback>
													</Avatar>
													<span
														className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background ${
															chat.status === "online"
																? "bg-emerald-500"
																: chat.status === "away"
																	? "bg-amber-500"
																	: "bg-zinc-400"
														}`}
													/>
												</div>
												<div className="min-w-0 flex-1">
													<div className="flex items-center justify-between">
														<span className="truncate text-sm font-medium">
															{chat.userName}
														</span>
														{chat.unread > 0 && (
															<Badge className="ml-2 h-5 min-w-[20px] px-1 text-[10px]">
																{chat.unread}
															</Badge>
														)}
													</div>
													<p className="mt-0.5 truncate text-xs text-muted-foreground">
														{chat.lastMessage}
													</p>
												</div>
											</button>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Chat Window */}
							<Card className="flex flex-1 flex-col">
								{activeChat ? (
									<>
										<CardHeader className="border-b pb-3">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<Avatar className="h-9 w-9">
														<AvatarFallback className="text-xs">
															{activeChat.userName
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</AvatarFallback>
													</Avatar>
													<div>
														<CardTitle className="text-base">
															{activeChat.userName}
														</CardTitle>
														<CardDescription className="text-xs">
															<span
																className={`inline-block h-2 w-2 rounded-full ${
																	activeChat.status === "online"
																		? "bg-emerald-500"
																		: activeChat.status === "away"
																			? "bg-amber-500"
																			: "bg-zinc-400"
																}`}
															/>{" "}
															{activeChat.status}
														</CardDescription>
													</div>
												</div>
												<div className="flex gap-1">
													<Button variant="ghost" size="icon">
														<Phone className="h-4 w-4" />
													</Button>
													<Button variant="ghost" size="icon">
														<Video className="h-4 w-4" />
													</Button>
												</div>
											</div>
										</CardHeader>

										<CardContent className="flex-1 space-y-3 overflow-y-auto p-4">
											{activeChat.messages.map((msg) => (
												<div
													key={msg.id}
													className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}
												>
													<div
														className={`max-w-[75%] rounded-lg px-3 py-2 ${
															msg.sender === "agent"
																? "bg-primary text-primary-foreground"
																: "bg-muted"
														}`}
													>
														<p className="text-sm">{msg.content}</p>
														<div
															className={`mt-1 flex items-center gap-1 text-[10px] ${
																msg.sender === "agent"
																	? "text-primary-foreground/70"
																	: "text-muted-foreground"
															}`}
														>
															<span>{msg.timestamp}</span>
															{msg.sender === "agent" && (
																<Check
																	className={`h-3 w-3 ${
																		msg.read ? "" : "opacity-50"
																	}`}
																/>
															)}
														</div>
													</div>
												</div>
											))}
										</CardContent>

										<div className="border-t p-4">
											<div className="flex gap-2">
												<Button variant="outline" size="icon" className="shrink-0">
													<Paperclip className="h-4 w-4" />
												</Button>
												<Input
													placeholder="Type a message..."
													value={messageInput}
													onChange={(e) => setMessageInput(e.target.value)}
													className="flex-1"
												/>
												<Button size="icon" className="shrink-0">
													<Send className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</>
								) : (
									<CardContent className="flex flex-col items-center justify-center py-16">
										<Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
										<p className="text-sm text-muted-foreground">
											Select a conversation to start chatting
										</p>
									</CardContent>
								)}
							</Card>
						</div>
					</motion.div>
				</main>
			</div>
		</SupportLayout>
	);
}
