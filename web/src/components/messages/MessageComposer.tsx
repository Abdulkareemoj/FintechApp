import EmojiPicker, { Theme } from "emoji-picker-react";
import { Send, Smile } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
	onSend?: (text: string) => void;
	variant?: "desktop" | "mobile";
	disabled?: boolean;
	placeholder?: string;
}

export function MessageComposer({
	onSend,
	variant = "desktop",
	disabled,
	placeholder = "Enter message...",
}: Props) {
	const [value, setValue] = useState("");

	const handleSend = () => {
		if (!value.trim()) return;
		onSend?.(value);
		setValue("");
	};

	return (
		<div className="border-t border-border bg-background">
			<div
				className={cn(
					"flex items-center gap-2 px-4 py-3",
					variant === "desktop" ? "rounded-lg" : "",
				)}
			>
				<div className="relative flex-1">
					<input
						disabled={disabled}
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSend();
							}
						}}
						placeholder={placeholder}
						value={value}
						className="h-11 w-full rounded-md border border-input bg-background pl-4 pr-12 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
					/>
					<div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 text-muted-foreground">
						<Popover>
							<PopoverTrigger asChild>
								<Button
									className="h-8 w-8"
									disabled={disabled}
									size="icon"
									variant="ghost"
								>
									<Smile className="h-4 w-4" />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="end" className="w-auto p-0">
								<EmojiPicker
									height={320}
									onEmojiClick={(emoji) => setValue((v) => v + emoji.emoji)}
									theme={Theme.AUTO}
									width={280}
								/>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				{variant === "mobile" ? (
					<Button
						className="h-11 w-11 shrink-0"
						disabled={disabled || !value.trim()}
						onClick={handleSend}
						size="icon"
						variant="outline"
					>
						<Send className="h-4 w-4" />
					</Button>
				) : (
					<Button
						className="h-11 shrink-0 px-5"
						disabled={disabled || !value.trim()}
						onClick={handleSend}
					>
						Send
					</Button>
				)}
			</div>
		</div>
	);
}
