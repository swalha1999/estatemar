'use client';

import { useActionState as useReactActionState } from 'react';

/**
 * A hook that wraps React's useActionState hook to provide toast notifications for action results
 * @param reactAction - The action function to be executed
 * @param initialState - The initial state value
 * @returns A tuple containing [state, action, isPending]
 * - state: The current state value
 * - action: The action function to be called
 * - isPending: Boolean indicating if the action is in progress
 */
export function useActionState<T>(
	reactAction: (state: Awaited<T>, formData: FormData) => Promise<T>,
	initialState: Awaited<T>
) {
	const [state, action, isPending] = useReactActionState(reactAction, initialState);
	return [state, action, isPending] as const;
}
