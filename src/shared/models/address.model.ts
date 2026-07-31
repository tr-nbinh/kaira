export interface UserAddress {
    id: string;
    fullName: string;
    phone: string;
    provinceCode: number;
    provinceName: string;
    wardCode: number;
    wardName: string;
    addressLine: string;
    addressExtra?: string;
    isDefault: boolean;
}

export interface CreateAddress extends Omit<UserAddress, 'id'> {}
