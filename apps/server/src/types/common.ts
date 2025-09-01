export interface ServiceResult<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface PaginationParams {
	limit: number;
	offset: number;
}

export interface BaseEntity {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface AuthContext {
	userId: string;
	userEmail: string;
}
