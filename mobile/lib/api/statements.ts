// ============================================
// FILE: lib/api/statements.ts
// PURPOSE: CSV statement fetch + share helpers
// ============================================

import { Share } from "react-native";
import { api } from "./index";

export type StatementDirection = "all" | "incoming" | "outgoing";

export interface StatementParams {
  startDate?: string;
  endDate?: string;
  direction?: StatementDirection;
}

function buildQuery(params: StatementParams): string {
  const parts: string[] = [];
  if (params.startDate) parts.push(`startDate=${params.startDate}`);
  if (params.endDate) parts.push(`endDate=${params.endDate}`);
  if (params.direction && params.direction !== "all") {
    parts.push(`direction=${params.direction}`);
  }
  return parts.length ? `?${parts.join("&")}` : "";
}

export async function fetchStatementCsv(
  params: StatementParams = {},
): Promise<string> {
  const result = await api.get<unknown>(
    `/user/statements/export${buildQuery(params)}`,
    { auth: true },
  );
  if (!result.ok) {
    throw new Error(result.error);
  }
  const data = result.data;
  if (typeof data === "string") {
    return data.replace(/^﻿/, "");
  }
  const envelope = data as { data?: unknown } | null;
  if (envelope && typeof envelope.data === "string") {
    return envelope.data.replace(/^﻿/, "");
  }
  throw new Error("Unexpected response");
}

/** Fetch the CSV and open the OS share sheet. */
export async function shareStatementCsv(
  params: StatementParams = {},
  title = "Account statement",
): Promise<void> {
  const csv = await fetchStatementCsv(params);
  await Share.share({ message: csv, title });
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
