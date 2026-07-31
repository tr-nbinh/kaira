import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'initials',
    standalone: true, // Nếu dùng Angular 14+ standalone
})
export class InitialsPipe implements PipeTransform {
    transform(fullName: string | null | undefined): string {
        if (!fullName) return '';

        // Tách các từ, lọc khoảng trắng thừa
        const words = fullName.trim().split(/\s+/);

        // Lấy chữ cái đầu của từ ĐẦU TIÊN (ví dụ: "Nguyen Van A" -> "N")
        return words[0].charAt(0).toUpperCase();

        /* 
       LƯU Ý: Nếu muốn lấy chữ cái đầu của cả TÊN GỌI (Từ cuối cùng):
       const lastWord = words[words.length - 1];
       return lastWord.charAt(0).toUpperCase(); // "Nguyen Van A" -> "A"
    */
    }
}
