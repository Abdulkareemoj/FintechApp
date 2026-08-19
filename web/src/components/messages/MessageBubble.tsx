import { CheckCheck, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "./types";

interface Props {
	message: Message;
}

export function MessageBubble({ message }: Props) {
	const isOutgoing = message.direction === "outgoing";

	return (
		<div
			className={cn(
				"flex w-full gap-2",
				isOutgoing ? "justify-end" : "justify-start",
			)}
		>
			{!isOutgoing && (
				<Button
					aria-label="Message options"
					className="mt-3 text-muted-foreground/60 hover:text-muted-foreground"
					type="button"
				>
					<MoreHorizontal className="h-4 w-4" />
				</button>
			)}

			<div
				className={cn(
					"flex max-w-[78%] flex-col sm:max-w-[65%]",
					isOutgoing ? "items-end" : "items-start",
				)}
			>
				<div
					className={cn(
						"rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm",
						isOutgoing
							? "border-primary/60 bg-primary text-primary-foreground"
							: "border-border/60 bg-muted text-foreground",
					)}
				>
					<p className="whitespace-pre-wrap break-words">{message.text}</p>
				</div>
				<div className="mt-1.5 flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
					<span>{message.time}</span>
					{isOutgoing && message.read && (
						<CheckCheck className="h-3.5 w-3.5 text-primary" />
					)}
				</div>
			</div>

			{isOutgoing && (
				<Button
					aria-label="Message options"
					className="mt-3 text-muted-foreground/60 hover:text-muted-foreground"
					type="button"
				>
					<MoreHorizontal className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
