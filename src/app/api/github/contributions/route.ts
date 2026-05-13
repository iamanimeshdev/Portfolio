import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Deterministic pseudo-contribution grid when GraphQL is unavailable */
function buildSyntheticGrid(username: string): Day[][] {
  const cols = 53;
  const rows = 7;
  const seed = hashString(username);
  const weeks: Day[][] = [];
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - cols * 7);

  for (let w = 0; w < cols; w += 1) {
    const week: Day[] = [];
    for (let d = 0; d < rows; d += 1) {
      const day = new Date(start);
      day.setUTCDate(start.getUTCDate() + w * 7 + d);
      const noise =
        (Math.sin(w * 0.35 + d * 0.2 + seed * 0.001) + 1) / 2;
      const count = Math.floor(noise * noise * 14 + (seed + w * d) % 3);
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0) level = 1;
      if (count > 3) level = 2;
      if (count > 7) level = 3;
      if (count > 11) level = 4;
      week.push({
        date: day.toISOString().slice(0, 10),
        count,
        level,
      });
    }
    weeks.push(week);
  }
  return weeks;
}

async function fetchGraphContributions(
  username: string,
  token: string,
): Promise<Day[][] | null> {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  const json = (await res.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: {
            weeks?: {
              contributionDays: {
                date: string;
                contributionCount: number;
              }[];
            }[];
          };
        };
      };
    };
  };

  const weeks =
    json.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
  if (!weeks) return null;

  return weeks.map((week) =>
    week.contributionDays.map((day) => {
      const count = day.contributionCount;
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0) level = 1;
      if (count > 3) level = 2;
      if (count > 7) level = 3;
      if (count > 12) level = 4;
      return { date: day.date, count, level };
    }),
  );
}

export async function GET() {
  const username = siteConfig.githubUsername;
  const token = process.env.GITHUB_TOKEN;

  try {
    if (token) {
      const real = await fetchGraphContributions(username, token);
      if (real?.length) {
        return NextResponse.json({ username, weeks: real, source: "github" });
      }
    }
  } catch {
    /* fall through */
  }

  const weeks = buildSyntheticGrid(username);
  return NextResponse.json({ username, weeks, source: "synthetic" });
}
