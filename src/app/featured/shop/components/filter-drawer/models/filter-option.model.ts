import { Chip } from '../../../../../../shared/models/chip.modal';

export interface FilterChip extends Chip {
    attributeType: 'color' | 'size' | 'price';
}
