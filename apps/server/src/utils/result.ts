import type { ServiceResult } from "../types/common";

export function createSuccessResult<T>(data: T): ServiceResult<T> {
	return {
		success: true,
		data,
	};
}

export function createErrorResult<T>(error: string): ServiceResult<T> {
	return {
		success: false,
		error,
	};
}

export function handleServiceError<T>(error: unknown): ServiceResult<T> {
	if (error instanceof Error) {
		return createErrorResult(error.message);
	}
	return createErrorResult("An unexpected error occurred");
}
