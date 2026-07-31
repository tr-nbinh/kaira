export interface ApiError<T = unknown> {
    message?: string;
    status?: number;
    data?: T;
    code?: string | number;
    raw?: unknown;
}

export interface ApiSuccess<T = unknown> {
    success: boolean;
    message: string;
    status: number;
    data: T;
}
