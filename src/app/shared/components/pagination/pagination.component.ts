import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-pagination',
    imports: [CommonModule],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
    @Input() totalItems: number = 0;
    @Input() currentPage: number = 1;
    @Input() limit: number = 10; // Số lượng mục trên mỗi trang
    @Input() maxPagesToShow: number = 5; // Số lượng nút trang tối đa hiển thị (ví dụ: 1 2 [3] 4 5)

    // Output để thông báo cho component cha khi trang thay đổi
    @Output() pageChange = new EventEmitter<number>();

    totalPages: number = 0;
    pages: number[] = []; // Mảng chứa các số trang để hiển thị trong template

    constructor(public translate: TranslateService) {} // Inject TranslateService nếu dùng ngx-translate

    ngOnInit(): void {
        this.calculatePagination();
    }

    // ngOnChanges được gọi khi có thay đổi ở bất kỳ Input nào
    ngOnChanges(changes: SimpleChanges): void {
        // Chỉ tính toán lại phân trang nếu các input chính thay đổi
        if (
            changes['totalItems'] ||
            changes['currentPage'] ||
            changes['limit'] ||
            changes['maxPagesToShow']
        ) {
            this.calculatePagination();
        }
    }

    private calculatePagination(): void {
        if (this.totalItems <= 0 || this.limit <= 0) {
            this.totalPages = 0;
            this.pages = [];
            return;
        }

        this.totalPages = Math.ceil(this.totalItems / this.limit);

        // Đảm bảo currentPage không vượt quá totalPages và không nhỏ hơn 1
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
        }
        if (this.currentPage < 1) {
            this.currentPage = 1;
        }

        // Tính toán các nút số trang để hiển thị
        this.pages = [];
        let startPage: number, endPage: number;

        if (this.totalPages <= this.maxPagesToShow) {
            // Hiển thị tất cả các trang nếu tổng số trang ít hơn hoặc bằng maxPagesToShow
            startPage = 1;
            endPage = this.totalPages;
        } else {
            // Tính toán các trang hiển thị xung quanh trang hiện tại
            const maxPagesBeforeCurrentPage = Math.floor(
                this.maxPagesToShow / 2
            );
            const maxPagesAfterCurrentPage =
                Math.ceil(this.maxPagesToShow / 2) - 1;

            if (this.currentPage <= maxPagesBeforeCurrentPage) {
                // Gần đầu, hiển thị từ trang 1
                startPage = 1;
                endPage = this.maxPagesToShow;
            } else if (
                this.currentPage + maxPagesAfterCurrentPage >=
                this.totalPages
            ) {
                // Gần cuối, hiển thị các trang cuối cùng
                startPage = this.totalPages - this.maxPagesToShow + 1;
                endPage = this.totalPages;
            } else {
                // Ở giữa, hiển thị xung quanh trang hiện tại
                startPage = this.currentPage - maxPagesBeforeCurrentPage;
                endPage = this.currentPage + maxPagesAfterCurrentPage;
            }
        }

        // Tạo mảng các số trang
        for (let i = startPage; i <= endPage; i++) {
            this.pages.push(i);
        }
    }

    // Xử lý sự kiện khi người dùng click vào một nút trang
    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.pageChange.emit(page); // Thông báo cho component cha về trang mới
        }
    }
}
