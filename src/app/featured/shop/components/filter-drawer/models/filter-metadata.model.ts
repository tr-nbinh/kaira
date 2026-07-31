import { AttributeValue } from '../../../../../../shared/models/attribute.model';

export interface ProductFilterMetadata {
    priceRange: { min: number; max: number };
    colors: AttributeValue[];
    sizes: AttributeValue[];
}
