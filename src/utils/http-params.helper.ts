// src/app/utils/http-params.helper.ts

import { HttpParams } from '@angular/common/http';

// Giữ lại các hàm helper nhỏ nếu bạn vẫn muốn dùng chúng riêng lẻ hoặc để làm rõ
// Tuy nhiên, hàm objectToHttpParams sẽ bao gồm logic của chúng

/**
 * Tạo một đối tượng HttpParams từ một đối tượng JavaScript.
 * Hàm này sẽ tự động xử lý các giá trị đơn (string, number, boolean) bằng `set()`
 * và các giá trị mảng bằng cách lặp và dùng `append()` cho mỗi phần tử.
 *
 * @param obj Đối tượng chứa các tham số query (ví dụ: GetProductsOptions).
 * @param initialParams (Optional) Một HttpParams hiện có để bắt đầu thêm vào.
 * @returns HttpParams đã được xây dựng.
 */
export function createHttpParamsFromObject(
    obj: Record<string, any>,
    initialParams?: HttpParams
): HttpParams {
    let params = initialParams || new HttpParams();
    for (const key in obj) {
        // Đảm bảo thuộc tính thuộc về đối tượng và không phải từ prototype chain
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            // Bỏ qua các giá trị null hoặc undefined
            if (value === null || typeof value === 'undefined') {
                continue;
            }

            if (Array.isArray(value)) {
                // Xử lý mảng: lặp qua và append từng phần tử
                const filteredArray = value.filter(item => item !== null && typeof item !== 'undefined');
                if (filteredArray.length > 0) {
                    params = params.set(key, filteredArray.map(item => String(item)).join(','));
                }
            } else if (
                typeof value === 'boolean' ||
                typeof value === 'number'
            ) {
                // Xử lý boolean và number: chuyển thành chuỗi và dùng set
                params = params.set(key, value.toString());
            } else if (typeof value === 'string') {
                // Xử lý chuỗi: chỉ thêm nếu không rỗng
                if (value.length > 0) {
                    params = params.set(key, value);
                }
            }
            // Các kiểu dữ liệu khác có thể được thêm vào đây nếu cần xử lý đặc biệt
        }
    }

    return params;
}

// Bạn có thể xóa các hàm setStringParam, setNumberParam, setBooleanParam, appendArrayToParams
// nếu bạn chỉ muốn dùng createHttpParamsFromObject
