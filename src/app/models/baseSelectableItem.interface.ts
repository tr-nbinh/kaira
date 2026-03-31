export interface BaseSelectableItem {
    id: number;
    key: string;
    text?: string;
    value?: any;
    checked?: boolean;
    disabled?: boolean;
    selected?: boolean; // for mutiple selection
}
