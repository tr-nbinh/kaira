export interface Province {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    phone_code: number;
    districts: any[];
}

export interface District {
    code: number;
    name: string;
    codename: string;
    division_type: string;
    short_codename: string;
    wards: any[]; // Có thể mở rộng nếu cần lấy phường/xã
}

export interface Ward {
    code: number;
    name: string;
    codename: string;
    division_type: string;
    short_codename: string;
}
