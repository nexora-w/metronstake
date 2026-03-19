import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const SPREADSHEET_ID = "1f4KndNmDhPlRTpRafx32TysqCCcgFZbS96OnwTpw7Hk";
/** Single sheet tab for the leaderboard. */
const TARGET_SHEET_GIDS = [802569950];

/** Previous leaderboard spreadsheet (historical data). */
const PREVIOUS_SPREADSHEET_ID = "1f4KndNmDhPlRTpRafx32TysqCCcgFZbS96OnwTpw7Hk";
/** Previous leaderboard tab gid (from URL #gid=802569950). */
const PREVIOUS_SHEET_GIDS = [2077816179];

export type LeaderboardEntry = {
  rank: number;
  leaderboard_type: string;
  masked_username: string;
  wagered: number;
  prize: string;
  last_updated: string;
};

/** Build credentials from individual env vars (preferred) or from JSON/file fallbacks. */
function getCredentials(): Record<string, unknown> | null {
  // 1) Single JSON env var (legacy)
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      console.error("[leaderboard] Invalid GOOGLE_SERVICE_ACCOUNT_JSON");
      return null;
    }
  }

  // 2) Individual env vars (one per JSON field)
  const type = process.env.GOOGLE_SERVICE_ACCOUNT_TYPE;
  const project_id = process.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID;
  const private_key_id = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID;
  const private_key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const client_id = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID;
  const auth_uri = process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_URI;
  const token_uri = process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN_URI;
  const auth_provider_x509_cert_url =
    process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL;
  const client_x509_cert_url =
    process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL;
  const universe_domain = process.env.GOOGLE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN;

  if (
    type &&
    project_id &&
    private_key_id &&
    private_key &&
    client_email &&
    client_id
  ) {
    return {
      type,
      project_id,
      private_key_id,
      // Env vars often store newlines as literal \n
      private_key: private_key.replace(/\\n/g, "\n"),
      client_email,
      client_id,
      auth_uri: auth_uri || "https://accounts.google.com/o/oauth2/auth",
      token_uri: token_uri || "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url:
        auth_provider_x509_cert_url ||
        "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        client_x509_cert_url ||
        "https://www.googleapis.com/robot/v1/metadata/x509/metron%40cs2dle.iam.gserviceaccount.com",
      universe_domain: universe_domain || "googleapis.com",
    };
  }

  // 3) Local dev: optional path to credentials JSON (do not commit that file)
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS || "g-service.json";
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs");
    const resolved = require("path").resolve(process.cwd(), path);
    if (fs.existsSync(resolved)) {
      return JSON.parse(fs.readFileSync(resolved, "utf8")) as Record<
        string,
        unknown
      >;
    }
  } catch (e) {
    console.error("[leaderboard] Failed to read credentials file:", e);
  }
  return null;
}

/** Number of prize slots to always display. */
const PRIZE_SLOT_COUNT = 20;

const PRIZE_BY_RANK_CURRENT: Record<number, string> = {
  1: "$3.750,00",
  2: "$1.600,00",
  3: "$750,00",
  4: "$500,00",
  5: "$250,00",
  6: "$100,00",
  7: "$85,00",
  8: "$70,00",
  9: "$60,00",
  10: "$55,00",
  11: "$50,00",
  12: "$45,00",
  13: "$40,00",
  14: "$35,00",
  15: "$30,00",
  16: "$25,00",
  17: "$20,00",
  18: "$15,00",
  19: "$10,00",
  20: "$10,00",
};

const PRIZE_BY_RANK_PREVIOUS: Record<number, string> = {
  1: "$1,500",
  2: "$750",
  3: "$250",
  4: "$125",
  5: "$100",
  6: "$80",
  7: "$60",
  8: "$50",
  9: "$40",
  10: "$30",
  11: "$15",
};

function get(key: string, headers: string[], values: string[]): string | undefined {
  const i = headers.findIndex(
    (h) => h?.toLowerCase().replace(/\s/g, "_") === key.toLowerCase()
  );
  if (i < 0) return undefined;
  return values[i]?.toString().trim();
}

function normalizeUsername(name: string): string {
  return String(name ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function dateValue(s: string): number {
  const t = Date.parse(String(s ?? ""));
  return Number.isFinite(t) ? t : 0;
}

/** Map sheet row to LeaderboardEntry. Sheet columns: affiliate_name, campaign_code, user_name, wagered, rank, start_date_utc, end_date_utc */
function rowToEntry(
  headers: string[],
  values: string[],
  fallbackLeaderboardType: string,
  prizeByRank: Record<number, string>
): LeaderboardEntry | null {
  const g = (key: string) => get(key, headers, values);
  const rankRaw = g("rank");
  const rank = parseInt(rankRaw ?? "", 10);
  if (Number.isNaN(rank) || rank < 1) return null;
  const user_name = g("user_name") ?? "";
  if (!user_name) return null;
  const wageredRaw = g("wagered");
  const wagered = parseFloat(
    String(wageredRaw ?? "0").replace(/[$,]/g, "")
  ) || 0;
  const last_updated = g("end_date_utc") ?? g("start_date_utc") ?? "";
  const leaderboard_type = g("campaign_code") ?? fallbackLeaderboardType;
  const prize = prizeByRank[rank] ?? "";

  return {
    rank,
    leaderboard_type,
    masked_username: user_name,
    wagered,
    prize,
    last_updated,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") ?? "current").toLowerCase();
    const isPrevious = type === "previous";

    const creds = getCredentials();
    if (!creds) {
      return NextResponse.json(
        { error: "Google Sheets credentials not configured" },
        { status: 503 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: creds as Record<string, unknown>,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = isPrevious ? PREVIOUS_SPREADSHEET_ID : SPREADSHEET_ID;
    const targetGids = isPrevious ? PREVIOUS_SHEET_GIDS : TARGET_SHEET_GIDS;
    const fallbackLeaderboardType = isPrevious ? "previous" : "metron";
    const prizeByRank = isPrevious ? PRIZE_BY_RANK_PREVIOUS : PRIZE_BY_RANK_CURRENT;

    // Fetch spreadsheet metadata once so we can resolve titles for all target gids
    const meta = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const entries: LeaderboardEntry[] = [];

    for (const gid of targetGids) {
      const sheet = meta.data.sheets?.find(
        (s) => (s.properties?.sheetId ?? 0) === gid
      );
      const sheetTitle =
        sheet?.properties?.title ?? meta.data.sheets?.[0]?.properties?.title ?? "Sheet1";
      const range = `'${sheetTitle}'!A:Z`;

      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = res.data.values as string[][] | undefined;
      if (!rows || rows.length < 2) {
        continue;
      }

      const headers = rows[0].map((h) => String(h ?? "").trim());
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i] ?? [];
        const entry = rowToEntry(headers, values, fallbackLeaderboardType, prizeByRank);
        if (entry) entries.push(entry);
      }
    }

    if (!entries.length) {
      return NextResponse.json([]);
    }

    // Sort all combined rows purely by rank; do not de-duplicate by rank
    const sorted = entries.slice().sort((a, b) => a.rank - b.rank);

    const result = sorted;

    // Pad output to always include all prize slots.
    // If multiple rows share the same rank (e.g. multiple tabs), keep the first one after sorting.
    const resultByRank = new Map<number, LeaderboardEntry>();
    for (const e of result) {
      if (resultByRank.has(e.rank)) continue;
      resultByRank.set(e.rank, e);
    }
    const leaderboardType = result[0]?.leaderboard_type ?? type;
    const padded: LeaderboardEntry[] = [];
    for (let r = 1; r <= PRIZE_SLOT_COUNT; r++) {
      const existing = resultByRank.get(r);
      if (existing) {
        padded.push(existing);
      } else {
        padded.push({
          rank: r,
          leaderboard_type: leaderboardType,
          masked_username: "",
          wagered: 0,
          prize: prizeByRank[r] ?? "",
          last_updated: "",
        });
      }
    }
    return NextResponse.json(padded);
  } catch (err) {
    console.error("[leaderboard] Google Sheets fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
