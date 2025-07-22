export interface Address {
    id: number;
    receiverName: string;
    provinceCode: number;
    districtCode: number;
    wardCode: number;
    street: string;
    address: string;
    addressExtra?: string;
    phone: string;
    email: string;
    isDefault: boolean;
}