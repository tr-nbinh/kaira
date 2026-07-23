export interface Option<T = string> {
    label: string;
    value: T;
    image?: string;
    selected?: boolean;
    checked?: boolean;
    disabled?: boolean;
}

export interface ColorOption<T = string> extends Option<T> {
    hex: string;
}
