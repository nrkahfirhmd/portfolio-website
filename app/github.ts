// getGithubSnapshot runs only on the server (the index page): it reads GITHUB_TOKEN, which has no NEXT_PUBLIC_ prefix and so never reaches the browser.

/** Refetch once a day; the index page regenerates with it. */
const DAY = 86_400;
/** Days in the island's activity dot row: as many as fit the panel. */
export const DOT_DAYS = 11;

type GithubEvent = {
  id: string;
  type: string;
  public: boolean;
  repo: { name: string };
  created_at: string;
  payload?: {
    action?: string;
    ref_type?: string;
    pull_request?: { merged?: boolean };
  };
};

export type Activity = { time: string; label: string };
export type GithubSnapshot = { latest: Activity | null; activeDays: boolean[] };

const ACTION_VERB: Record<string, string> = {
  opened: "Opened",
  closed: "Closed",
  reopened: "Reopened",
};

/** One event as a headline, or null for noise (stars, follows, …). Private repos stay unnamed. */
function summarize(e: GithubEvent): Activity | null {
  const repo = e.public ? (e.repo.name.split("/").pop() ?? e.repo.name) : "a private repo";
  const time = e.created_at;
  switch (e.type) {
    case "PushEvent":
      // The events payload no longer carries commit counts.
      return { time, label: `Pushed to ${repo}` };
    case "PullRequestEvent": {
      const action = e.payload?.action;
      const merged = action === "closed" && e.payload?.pull_request?.merged;
      const verb = merged ? "Merged" : (ACTION_VERB[action ?? ""] ?? "Updated");
      return { time, label: `${verb} PR on ${repo}` };
    }
    case "IssuesEvent":
      return { time, label: `${ACTION_VERB[e.payload?.action ?? ""] ?? "Updated"} issue on ${repo}` };
    case "CreateEvent":
      return {
        time,
        label:
          e.payload?.ref_type === "repository"
            ? `Created repo ${repo}`
            : `Created ${e.payload?.ref_type ?? "ref"} on ${repo}`,
      };
    case "ReleaseEvent":
      return { time, label: `Published release on ${repo}` };
    case "ForkEvent":
      return { time, label: `Forked ${repo}` };
    default:
      return null;
  }
}

/** Fallback without a token: per day of the last DOT_DAYS, did any public event land. */
function activeDaysFrom(events: GithubEvent[]) {
  const stamped = new Set(events.map((e) => e.created_at.slice(0, 10)));
  const days: boolean[] = [];
  const today = new Date();
  for (let i = DOT_DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(stamped.has(d.toISOString().slice(0, 10)));
  }
  return days;
}

/** The contribution calendar's last DOT_DAYS days, private contributions included (if shown on the profile). */
async function calendarDays(username: string, token: string) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar { weeks { contributionDays { contributionCount } } }
          }
        }
      }`,
      variables: { login: username },
    }),
    next: { revalidate: DAY },
  });
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`);
  const json = await res.json();
  const weeks: { contributionDays: { contributionCount: number }[] }[] =
    json.data.user.contributionsCollection.contributionCalendar.weeks;
  return weeks
    .flatMap((w) => w.contributionDays)
    .slice(-DOT_DAYS)
    .map((d) => d.contributionCount > 0);
}

/**
 * Latest activity and recent active days. With GITHUB_TOKEN (the account's own token),
 * private events and contributions count too; without one, public only. Null when GitHub fails.
 */
// ponytail: a failed fetch shows "unavailable" until the next daily regeneration; retry sooner if that bites.
export async function getGithubSnapshot(username: string): Promise<GithubSnapshot | null> {
  const token = process.env.GITHUB_TOKEN;
  try {
    // Authenticated as the user, /users/:user/events includes their private events.
    const res = await fetch(`https://api.github.com/users/${username}/events?per_page=100`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: DAY },
    });
    if (!res.ok) throw new Error(`GitHub events ${res.status}`);
    const events: GithubEvent[] = await res.json();

    let latest: Activity | null = null;
    for (const e of events) {
      latest = summarize(e);
      if (latest) break;
    }
    const activeDays = token ? await calendarDays(username, token) : activeDaysFrom(events);
    return { latest, activeDays };
  } catch (err) {
    console.error(err);
    return null;
  }
}
