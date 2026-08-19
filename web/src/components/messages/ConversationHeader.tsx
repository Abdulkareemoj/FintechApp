import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Chat } from "./types";

interface Props {
	chat: Chat;
	showBack?: boolean;
	onBack?: () => void;
}

const statusLabel: Record<Chat["status"], string> = {
	open: "Open",
	progress: "In Progress",
	resolved: "Resolved",
	closed: "Closed",
};

export function ConversationHeader({ chat, showBack, onBack }: Props) {
	return (
		<div className="flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3">
			<div className="flex min-w-0 items-center gap-3">
				{showBack && (
					<Button
						className="h-9 w-9 shrink-0"
						onClick={onBack}
						size="icon"
						variant="outline"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
				)}
				<div className="relative shrink-0">
					<Avatar className="h-9 w-9">
						{chat.avatar && <AvatarImage alt={chat.name} src={chat.avatar} />}
						<AvatarFallback className="bg-muted text-xs">
							{chat.initials}
						</AvatarFallback>
					</Avatar>
				</div>
				<div className="min-w-0">
					<p className="truncate text-sm font-semibold text-foreground">
						{chat.name}
					</p>
					<Badge
						className="mt-0.5 text-[10px]"
						variant={chat.status === "closed" ? "secondary" : "outline"}
					>
						{statusLabel[chat.status]}
						{chat.category ? ` · ${chat.category}` : ""}
					</Badge>
				</div>
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="outline">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem>Copy ticket id</DropdownMenuItem>
					<DropdownMenuItem>Mute notifications</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-destructive">
						Close ticket
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
