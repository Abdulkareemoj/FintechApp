import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "../ui/switch";

export function ModeSwitch() {
	const { theme, setTheme } = useTheme();

	const isDarkMode = theme === "dark";

	const handleThemeChange = (checked: boolean) => {
		setTheme(checked ? "dark" : "light");
	};

	return (
		<div className="flex items-center justify-between space-x-2 py-2">
			<p className="text-sm">Theme Mode</p>
			<div className="flex items-center justify-center space-x-2">
			<SunIcon className="h-4 w-4 text-muted-foreground" />
			<Switch
				checked={isDarkMode}
				onCheckedChange={handleThemeChange}
				aria-label="Toggle theme"
			/>
			<MoonIcon className="h-4 w-4 text-muted-foreground" />
		</div></div>
	);
}
