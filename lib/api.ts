import { cookies } from 'next/headers';

export async function fetchGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate: number = 60,
  skipCookies: boolean = false
): Promise<T> {
  const endpoint = process.env.GRAPHQL_ENDPOINT;

  if (!endpoint) {
    console.error('CRITICAL: Missing GRAPHQL_ENDPOINT environment variable.');
    throw new Error('Missing env variable: GRAPHQL_ENDPOINT');
  }

  if (!endpoint.startsWith('http')) {
    console.error('CRITICAL: GRAPHQL_ENDPOINT does not start with http/https:', endpoint);
  }

  let dealerToken: string | undefined;
  if (!skipCookies) {
    try {
      const cookieStore = await cookies();
      dealerToken = cookieStore.get('dealer_token')?.value;
    } catch (e) {
      // Silence build-time error
    }
  }

  let res: Response;
  try {
    res = await fetch(endpoint as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(dealerToken ? { Authorization: `Bearer ${dealerToken}` } : {}),
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Network error fetching GraphQL from ${endpoint}:`, message);
    throw new Error(`Network error fetching GraphQL: ${message}`);
  }

  if (!res.ok) {
    const statusText = res.statusText;
    console.error(`GraphQL fetch failed: ${res.status} ${statusText} – ${endpoint}`);
    throw new Error(
      `GraphQL fetch failed: ${res.status} ${statusText} – ${endpoint}`
    );
  }

  const json = await res.json();

  if (json.errors?.length) {
    const messages = (json.errors as Array<{ message: string }>)
      .map((e) => e.message)
      .join('\n');
    console.error(`GraphQL errors for query ${query.substring(0, 100)}...:\n${messages}`);
    throw new Error(`GraphQL errors:\n${messages}`);
  }

  return json.data as T;
}
