import { cookies } from 'next/headers';

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;

if (!GRAPHQL_ENDPOINT) {
  throw new Error('Missing env variable: GRAPHQL_ENDPOINT');
}

export async function fetchGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate: number = 60
): Promise<T> {
  const cookieStore = await cookies();
  const dealerToken = cookieStore.get('dealer_token')?.value;

  const res = await fetch(GRAPHQL_ENDPOINT as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(dealerToken ? { Authorization: `Bearer ${dealerToken}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(
      `GraphQL fetch failed: ${res.status} ${res.statusText} – ${GRAPHQL_ENDPOINT}`
    );
  }

  const json = await res.json();

  if (json.errors?.length) {
    const messages = (json.errors as Array<{ message: string }>)
      .map((e) => e.message)
      .join('\n');
    throw new Error(`GraphQL errors:\n${messages}`);
  }

  return json.data as T;
}
