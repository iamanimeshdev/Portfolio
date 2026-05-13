import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";
import { fetchUserRepos } from "@/lib/github";

export async function GET() {
  const username = siteConfig.githubUsername;
  const token = process.env.GITHUB_TOKEN;

  try {
    const repos = await fetchUserRepos(username, token);
    return NextResponse.json({ username, repos });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: message, username, repos: [] as unknown[] },
      { status: 502 },
    );
  }
}
