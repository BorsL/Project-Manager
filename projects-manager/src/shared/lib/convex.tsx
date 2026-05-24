import { ConvexProvider, ConvexReactClient, useMutation, useQuery } from 'convex/react';
import type { PropsWithChildren } from 'react';
import { useCallback } from 'react';

export const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
export const isConvexConfigured = Boolean(convexUrl);

const fallbackConvexUrl = 'https://placeholder.convex.cloud';
export const convexClient = new ConvexReactClient(convexUrl ?? fallbackConvexUrl);

export function ConvexProviderRoot({ children }: PropsWithChildren) {
  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}

export function useConfiguredQuery<QueryReference, QueryArgs>(
  queryReference: QueryReference,
  args: QueryArgs,
) {
  return useQuery(queryReference as never, isConvexConfigured ? (args as never) : 'skip');
}

export function useConfiguredMutation<MutationReference>(mutationReference: MutationReference) {
  const mutation = useMutation(mutationReference as never);

  return useCallback(
    async (args?: unknown) => {
      if (!isConvexConfigured) {
        throw new Error('Convex is not configured. Set EXPO_PUBLIC_CONVEX_URL in .env.local.');
      }

      return await mutation(args as never);
    },
    [mutation],
  );
}

export function getConvexSetupMessage() {
  return 'Set EXPO_PUBLIC_CONVEX_URL in .env.local, then run pnpm dev:backend and pnpm dev:app.';
}
