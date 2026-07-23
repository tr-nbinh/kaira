export interface ApiResponse<T = any> {
    success: boolean;
    statusCode?: number;
    message: string;
    data: T;
    timestamp?: string;
}

export interface ApiError<T = any> {
    message: string;
    status?: number;
    code?: string;
    data?: T;
    raw?: any;
}
