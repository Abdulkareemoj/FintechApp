// ============================================
// FILE: lib/api/statements.ts
// PURPOSE: CSV statement download helper (blob download)
// ============================================

import type { AxiosError } from "axios";
import { apiClient } from "@/lib/apiClient";

export type StatementDirection = "all" | "incoming" | "outgoing";

export interface StatementParams {
	startDate?: string;
	endDate?: string;
	direction?: StatementDirection;
}

function buildQueryString(params: StatementParams): string {
	const search = new URLSearchParams();
	if (params.startDate) search.set("startDate", params.startDate);
	if (params.endDate) search.set("endDate", params.endDate);
	if (params.direction && params.direction !== "all") {
		search.set("direction", params.direction);
	}
	const qs = search.toString();
	return qs ? `?${qs}` : "";
}

function triggerDownload(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

async function errorFromBlob(data: unknown): Promise<Error> {
	if (data instanceof Blob) {
		const text = await data.text();
		try {
			const json = JSON.parse(text) as { error?: string; detail?: string };
			return new Error(json.error ?? json.detail ?? "Download failed");
		} catch {
			return new Error("Download failed");
		}
	}
	return new Error("Download failed");
}

/**
 * Download a CSV statement for the given range/direction.
 * Throws with a human-readable message on failure.
 */
export async function downloadStatementCsv(
	params: StatementParams = {},
): Promise<void> {
	try {
		const res = await apiClient.get(
			`/api/user/statements/export${buildQueryString(params)}`,
			{ responseType: "blob" },
		);
		const blob = res.data as Blob;
		const disposition =
			(res.headers["content-disposition"] as string | undefined) ?? "";
		const match = disposition.match(/filename="?([^";]+)"?/);
		const filename = match?.[1] ?? "statement.csv";
		triggerDownload(blob, filename);
	} catch (err) {
		const axiosErr = err as AxiosError;
		if (axiosErr.response?.data) {
			throw await errorFromBlob(axiosErr.response.data);
		}
		throw err instanceof Error ? err : new Error("Download failed");
	}
}

/** Local-date yyyy-MM-dd (avoids UTC off-by-one). */
export function fmtDateLocal(date: Date): string {
	const y = date.getFullYear();
	const m = `${date.getMonth() + 1}`.padStart(2, "0");
	const d = `${date.getDate()}`.padStart(2, "0");
	return `${y}-${m}-${d}`;
}

export interface PeriodRange {
	startDate: string;
	endDate: string;
	label: string;
}

/** Calendar month `offset` months back (0 = current month, so far). */
export function monthRange(offset: number, now = new Date()): PeriodRange {
	const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
	const end =
		offset === 0
			? now
			: new Date(now.getFullYear(), now.getMonth() - offset + 1, 0);
	return {
		startDate: fmtDateLocal(start),
		endDate: fmtDateLocal(end),
		label: start.toLocaleDateString("en-US", {
			month: "long",
			year: "numeric",
		}),
	};
}

/** January 1 → today. */
export function ytdRange(now = new Date()): PeriodRange {
	return {
		startDate: fmtDateLocal(new Date(now.getFullYear(), 0, 1)),
		endDate: fmtDateLocal(now),
		label: `${now.getFullYear()} year to date`,
	};
}
