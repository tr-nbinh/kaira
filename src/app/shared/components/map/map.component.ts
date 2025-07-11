import { Component } from '@angular/core';
import * as L from 'leaflet'; // Import thư viện Leaflet

@Component({
    selector: 'app-map',
    imports: [],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss',
})
export class MapComponent {
    map: any; // Biến để lưu trữ đối tượng bản đồ Leaflet
    private currentMarker: L.Marker | null = null; // Biến để lưu trữ marker hiện tại

    constructor() {}

    private initMap(): void {
        // Khởi tạo bản đồ với ID 'map' (ID của div chứa bản đồ trong HTML)
        // Đặt vị trí trung tâm (ví dụ: TP. Hồ Chí Minh) và mức zoom ban đầu
        this.map = L.map('map', {
            center: [10.762622, 106.660172], // Vĩ độ, Kinh độ của TP. Hồ Chí Minh
            zoom: 13, // Mức zoom ban đầu
            scrollWheelZoom: false,
        });

        // Thêm lớp bản đồ (Tile Layer) từ OpenStreetMap
        // Đây là phần quan trọng để hiển thị dữ liệu bản đồ
        const tiles = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                maxZoom: 18, // Mức zoom tối đa
                minZoom: 3, // Mức zoom tối thiểu
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', // Thông tin bản quyền
            }
        );
        // Thêm lớp bản đồ vào đối tượng bản đồ Leaflet
        tiles.addTo(this.map);

        const tooltip = L.tooltip({
            permanent: false,
            direction: 'top',
            className: 'leaflet-tooltip-custom',
            offset: [0, -10],
        });

        this.map.getContainer().addEventListener('wheel', (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
                this.map.scrollWheelZoom.enable();
                this.map.closeTooltip(tooltip);
            } else {
                this.map.scrollWheelZoom.disable();
                tooltip
                    .setLatLng(this.map.getCenter())
                    .setContent('🛈 Giữ Ctrl và cuộn để thu phóng')
                    .addTo(this.map);
            }
        });

        const iconDefault = L.icon({
            iconRetinaUrl: 'assets/images/marker-icon-2x.png',
            iconUrl: 'assets/images/marker-icon.png',
            shadowUrl: 'assets/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41],
        });
        L.Marker.prototype.options.icon = iconDefault; // Dòng này quan trọng

        // Xử lý sự kiện click trên bản đồ
        this.map.on('click', (e: L.LeafletMouseEvent) => {
            // Bạn có thể thêm marker mới tại vị trí click ở đây
            console.log(e);
            this.clearMarkers();
            this.currentMarker = L.marker(e.latlng)
                .addTo(this.map)
                .bindPopup('Địa chỉ của tôi')
                .openPopup();
        });
    }

    addOrUpdateMarker(lat: number, lon: number, popupText: string): void {
        if (!this.map) {
            console.warn('Bản đồ chưa được khởi tạo.');
            return;
        }

        // Nếu đã có marker cũ, xóa nó đi
        if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
        }

        // Tạo marker mới tại vị trí đã cho
        this.currentMarker = L.marker([lat, lon])
            .addTo(this.map)
            .bindPopup(popupText)
            .openPopup(); // Mở popup ngay lập tức

        // Di chuyển bản đồ đến vị trí của marker
        this.map.flyTo(
            [lat, lon],
            this.map.getZoom() < 12 ? 12 : this.map.getZoom()
        ); // Đảm bảo zoom ít nhất là 12
    }

    // Phương thức để xóa tất cả các marker
    clearMarkers(): void {
        if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
            this.currentMarker = null;
        }
    }

    // Phương thức để đặt trung tâm bản đồ
    setCenter(lat: number, lon: number): void {
        if (this.map) {
            this.map.setView([lat, lon], this.map.getZoom());
        }
    }

    ngAfterViewInit(): void {
        this.initMap();
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
    }
}
