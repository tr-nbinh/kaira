/**
 * Parses a comma-separated string value into an array of numbers.
 * Ignores non-numeric values.
 * @param value The string to parse (e.g., "1,2,3").
 * @returns An array of numbers, or undefined if the input is null/empty.
 */
export const parseNumberArray = (
    value: string | null
): number[] | undefined => {
    if (!value) {
        return undefined;
    }
    return value
        .split(',')
        .map((v) => Number(v)) // Sử dụng Number() thay vì +v để rõ ràng hơn
        .filter((v) => !isNaN(v));
};

/**
 * Parses a comma-separated string value into an array of decoded strings.
 * Decodes URI components (e.g., for spaces in names).
 * @param value The string to parse (e.g., "item1,item%202").
 * @returns An array of strings, or undefined if the input is null/empty.
 */
export const parseStringArray = (
    value: string | null
): string[] | undefined => {
    if (!value) {
        return undefined;
    }
    return value.split(',').map((v) => decodeURIComponent(v));
};

/**
 * Safely parses a string value to a number.
 * @param value The string to parse.
 * @param defaultValue The default value if parsing fails or input is null/undefined.
 * @returns The parsed number or the default value.
 */
export const parseNumberOrDefault = (
    value: string | null,
    defaultValue: number
): number => {
    if (!value) return defaultValue;
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Safely retrieves a string value from ParamMap, providing a default if null/undefined.
 * @param value The string to check.
 * @param defaultValue The default string value if the input is null/undefined.
 * @returns The original string value or the default value.
 */
export const parseStringOrDefault = (
    value: string | null,
    defaultValue: string
): string => {
    return value === null ? defaultValue : value;
};
