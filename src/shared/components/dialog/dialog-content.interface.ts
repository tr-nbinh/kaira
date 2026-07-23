export interface IDialogContent {
    /**
     * Hàm này sẽ được kích hoạt khi bấm nút Lưu ở Dialog cha.
     * @returns `false` nếu dữ liệu lỗi (để chặn đóng dialog).
     * @returns `Dữ liệu bất kỳ` (Object, Array, String...) nếu hợp lệ để bắn ra ngoài.
     */
    onDialogSubmit(): boolean | any;
}
