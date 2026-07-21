

import { Link } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export function NotFound() {
	return (
		<div className="flex min-h-screen flex-1 items-center justify-center p-8">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<FileQuestion className="size-6" />
					</EmptyMedia>
					<EmptyTitle>Page Not Found</EmptyTitle>
					<EmptyDescription>
						The page you are looking for doesn't exist or has been moved.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button           onClick={() => window.history.back()}>
					Go back 
					</Button>
	<Button>
						<Link to="/">	Home</Link>
					</Button>

				</EmptyContent>
			</Empty>
		</div>
	);
}
