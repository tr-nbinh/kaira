export interface BaseSelectableItem {
    id: number;
    text?: string;
    checked?: boolean;
    disabled?: boolean;
    selected?: boolean; // for mutiple selection
}
