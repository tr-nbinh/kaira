export function getChangedFields<T extends Record<string, any>>(
    oldObject: T,
    newObject: T
): Partial<T> {
    const changedFields: Partial<T> = {};

    for (const key in newObject) {
        if (Object.prototype.hasOwnProperty.call(newObject, key)) {
            const oldValue = (oldObject as any)[key];
            const newValue = newObject[key];

            // Sử dụng so sánh nghiêm ngặt (===)
            if (oldValue != newValue) {
                changedFields[key] = newValue;
            }
        }
    }

    return changedFields;
}
