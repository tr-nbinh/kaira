export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    statusCode?: number;
    timestamp?: string;
}

export interface ApiError<T = any> {
    message: string;
    status?: number;
    data?: T;
    raw?: any;
}
