export interface BaseSelectableItem {
    id: number;
    text?: string;
    value?: any;
    checked?: boolean;
    disabled?: boolean;
    selected?: boolean; // for mutiple selection
}
