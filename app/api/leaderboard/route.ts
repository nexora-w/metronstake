import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const SPREADSHEET_ID = "1GPX7WKN9NkTfLqX847-0xt9gflTHiE84nW4ve_u8fCY";
/**
 * Sheet tabs to combine. Both tabs are read and merged into a single leaderboard.
 *  - 1502602180
 *  - 235680015
 */
const TARGET_SHEET_GIDS = [1502602180, 235680015];

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
const PRIZE_SLOT_COUNT = 11;

/** Prize by rank (e.g. $3k leaderboard). Sheet has no prize column, so we derive it. */
const PRIZE_BY_RANK: Record<number, string> = {
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

function mergeByUserCombineWagered(
  list: LeaderboardEntry[]
): LeaderboardEntry[] {
  const byUser = new Map<string, LeaderboardEntry>();

  for (const entry of list) {
    const key = normalizeUsername(entry.masked_username);
    if (!key) continue;

    const existing = byUser.get(key);
    if (!existing) {
      byUser.set(key, entry);
      continue;
    }

    const combinedWagered = existing.wagered + entry.wagered;
    const laterUpdated =
      dateValue(entry.last_updated) > dateValue(existing.last_updated)
        ? entry.last_updated
        : existing.last_updated;

    byUser.set(key, {
      ...existing,
      wagered: combinedWagered,
      last_updated: laterUpdated,
    });
  }

  return Array.from(byUser.values());
}

/** Map sheet row to LeaderboardEntry. Sheet columns: affiliate_name, campaign_code, user_name, wagered, rank, start_date_utc, end_date_utc */
function rowToEntry(
  headers: string[],
  values: string[]
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
  const campaign_code = g("campaign_code") ?? "metron";
  const leaderboard_type = campaign_code;
  const prize = PRIZE_BY_RANK[rank] ?? "";

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
    const type = searchParams.get("type") ?? "current";

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

    // Fetch spreadsheet metadata once so we can resolve titles for all target gids
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const entries: LeaderboardEntry[] = [];

    for (const gid of TARGET_SHEET_GIDS) {
      const sheet = meta.data.sheets?.find(
        (s) => (s.properties?.sheetId ?? 0) === gid
      );
      const sheetTitle =
        sheet?.properties?.title ?? meta.data.sheets?.[0]?.properties?.title ?? "Sheet1";
      const range = `'${sheetTitle}'!A:Z`;

      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range,
      });

      const rows = res.data.values as string[][] | undefined;
      if (!rows || rows.length < 2) {
        continue;
      }

      const headers = rows[0].map((h) => String(h ?? "").trim());
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i] ?? [];
        const entry = rowToEntry(headers, values);
        if (entry) entries.push(entry);
      }
    }

    if (!entries.length) {
      return NextResponse.json([]);
    }

    // Sort all combined rows purely by rank; do not de-duplicate by rank
    const sorted = entries.slice().sort((a, b) => a.rank - b.rank);

    // type "current" / "previous" → filter by campaign_code (e.g. "metron" = current)
    const filtered = sorted.filter(
      (entry) => entry.leaderboard_type.toLowerCase() === type.toLowerCase()
    );
    // Current tab: if no campaign match, show all (sheet only has "metron"). Previous: show only if campaign matches.
    const result =
      filtered.length > 0
        ? filtered
        : type === "current"
          ? sorted
          : [];

    // When combining multiple sheets, sum wagers per user across sheets,
    // then recalculate ranks and prizes based on the combined totals.
    if (TARGET_SHEET_GIDS.length > 1) {
      const merged = mergeByUserCombineWagered(result);

      const ranked = merged
        .slice()
        .sort((a, b) => b.wagered - a.wagered || a.masked_username.localeCompare(b.masked_username))
        .map((entry, index) => {
          const newRank = index + 1;
          return {
            ...entry,
            rank: newRank,
            prize: PRIZE_BY_RANK[newRank] ?? "",
          };
        });

      return NextResponse.json(ranked);
    }

    // Single-sheet mode: always return PRIZE_SLOT_COUNT entries so all prize slots are visible
    const resultByRank = new Map(result.map((e) => [e.rank, e]));
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
          prize: PRIZE_BY_RANK[r] ?? "",
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
