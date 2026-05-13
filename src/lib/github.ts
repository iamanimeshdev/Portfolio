export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

type GitHubRepoRaw = Omit<GitHubRepo, "topics"> & { topics?: string[] };

export async function fetchUserRepos(
  username: string,
  token?: string | null,
): Promise<GitHubRepo[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const repos: GitHubRepo[] = [];
  for (let page = 1; page <= 5; page += 1) {
    const url = new URL(`https://api.github.com/users/${username}/repos`);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));
    url.searchParams.set("sort", "pushed");

    const res = await fetch(url.toString(), {
      headers,
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error ${res.status}`);
    }

    const batch = (await res.json()) as GitHubRepoRaw[];
    if (!batch.length) break;
    repos.push(
      ...batch.map((r) => ({
        ...r,
        topics: Array.isArray(r.topics) ? r.topics : [],
      })),
    );
  }

  return repos.filter((r) => !r.fork && !r.archived);
}
