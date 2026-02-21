import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const SPREADSHEET_ID = "1GPX7WKN9NkTfLqX847-0xt9gflTHiE84nW4ve_u8fCY";
/** Sheet tab with gid=235680015 from the share URL */
const TARGET_SHEET_GID = 235680015;

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

/** Prize by rank (e.g. $3k leaderboard). Sheet has no prize column, so we derive it. */
const PRIZE_BY_RANK: Record<number, string> = {
  1: "$1,500",
  2: "$750",
  3: "$250",
  4: "$125",
  5: "$100",
};

function get(key: string, headers: string[], values: string[]): string | undefined {
  const i = headers.findIndex(
    (h) => h?.toLowerCase().replace(/\s/g, "_") === key.toLowerCase()
  );
  if (i < 0) return undefined;
  return values[i]?.toString().trim();
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

    // Resolve sheet title for gid so we read the correct tab
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const sheet = meta.data.sheets?.find(
      (s) => (s.properties?.sheetId ?? 0) === TARGET_SHEET_GID
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
      return NextResponse.json([]);
    }

    const headers = rows[0].map((h) => String(h ?? "").trim());
    const entries: LeaderboardEntry[] = [];
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i] ?? [];
      const entry = rowToEntry(headers, values);
      if (entry) entries.push(entry);
    }
    entries.sort((a, b) => a.rank - b.rank);
    const byRank = new Map(entries.map((e) => [e.rank, e]));
    const sorted = Array.from(byRank.values()).sort((a, b) => a.rank - b.rank);

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
    return NextResponse.json(result);
  } catch (err) {
    console.error("[leaderboard] Google Sheets fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
