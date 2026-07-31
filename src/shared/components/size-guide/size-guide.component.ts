import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DRAWER_DATA } from '../drawer/models/drawer.model';
import { ModalConfig } from '../modal/modal.interface';

export type CategoryType = 'tops' | 'bottoms' | 'shoes';

export type GenderType = 'men' | 'women';

export interface SizeChartRow {
    size: string;
    // Cho Áo
    collarCm?: string;
    collarInch?: string;
    chestCm?: string;
    chestInch?: string;
    shoulderCm?: string;
    shoulderInch?: string;
    // Cho Quần & Áo
    waistCm?: string;
    waistInch?: string;
    hipCm?: string;
    hipInch?: string;
    // Cho Quần
    inseamCm?: string;
    inseamInch?: string;

    // Giày
    usSize?: string;
    ukSize?: string;
    footLengthCm?: string;
    footLengthInch?: string;
}

@Component({
    selector: 'app-size-guide',
    imports: [TranslatePipe],
    templateUrl: './size-guide.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SizeGuideComponent {
    private config = inject(DRAWER_DATA) as ModalConfig<{
        categoryType: CategoryType;
        gender: GenderType;
    }>;

    category = this.config.data?.categoryType || 'tops';
    gender = this.config.data?.gender || 'men';
    unit = signal<'cm' | 'inch'>('cm');

    // Map hình ảnh minh họa cách đo theo loại sản phẩm
    readonly measureImages: Record<string, string> = {
        'tops-men': 'assets/images/size_guide_rtw_man_upper.png',
        'bottoms-men': 'assets/images/size_guide_rtw_man_lower.png',
        'tops-women': 'assets/images/size_guide_rtw_woman_coat.png',
        'bottoms-women': 'assets/images/size_guide_rtw_woman_lower.png',
    };

    // Kho dữ liệu 4 bảng size chuẩn
    readonly allCharts: Record<
        CategoryType,
        Record<GenderType, SizeChartRow[]>
    > = {
        tops: {
            men: [
                {
                    size: 'XS',
                    collarCm: '36 - 37',
                    collarInch: '14.2 - 14.6',
                    chestCm: '82 - 87',
                    chestInch: '32.2 - 34.2',
                    shoulderCm: '41 - 42',
                    shoulderInch: '16.1 - 16.5',
                    waistCm: '70 - 74',
                    waistInch: '27.5 - 29.1',
                    hipCm: '84 - 88',
                    hipInch: '33.0 - 34.6',
                },
                {
                    size: 'S',
                    collarCm: '37 - 38',
                    collarInch: '14.6 - 15.0',
                    chestCm: '88 - 93',
                    chestInch: '34.6 - 36.6',
                    shoulderCm: '43 - 44',
                    shoulderInch: '16.9 - 17.3',
                    waistCm: '75 - 79',
                    waistInch: '29.5 - 31.1',
                    hipCm: '89 - 93',
                    hipInch: '35.0 - 36.6',
                },
                {
                    size: 'M',
                    collarCm: '39 - 40',
                    collarInch: '15.3 - 15.7',
                    chestCm: '94 - 99',
                    chestInch: '37.0 - 39.0',
                    shoulderCm: '45 - 46',
                    shoulderInch: '17.7 - 18.1',
                    waistCm: '80 - 84',
                    waistInch: '31.5 - 33.0',
                    hipCm: '94 - 98',
                    hipInch: '37.0 - 38.6',
                },
                {
                    size: 'L',
                    collarCm: '41 - 42',
                    collarInch: '16.1 - 16.5',
                    chestCm: '100 - 105',
                    chestInch: '39.3 - 41.3',
                    shoulderCm: '47 - 48',
                    shoulderInch: '18.5 - 18.9',
                    waistCm: '85 - 89',
                    waistInch: '33.4 - 35.0',
                    hipCm: '99 - 103',
                    hipInch: '39.0 - 40.5',
                },
                {
                    size: 'XL',
                    collarCm: '43 - 44',
                    collarInch: '16.9 - 17.3',
                    chestCm: '106 - 111',
                    chestInch: '41.7 - 43.7',
                    shoulderCm: '49 - 50',
                    shoulderInch: '19.3 - 19.7',
                    waistCm: '90 - 95',
                    waistInch: '35.4 - 37.4',
                    hipCm: '104 - 108',
                    hipInch: '41.0 - 42.5',
                },
                {
                    size: 'XXL',
                    collarCm: '45 - 46',
                    collarInch: '17.7 - 18.1',
                    chestCm: '112 - 117',
                    chestInch: '44.0 - 46.0',
                    shoulderCm: '51 - 52',
                    shoulderInch: '20.0 - 20.4',
                    waistCm: '96 - 101',
                    waistInch: '37.8 - 39.7',
                    hipCm: '109 - 114',
                    hipInch: '43.0 - 44.8',
                },
                {
                    size: 'XXXL',
                    collarCm: '47 - 48',
                    collarInch: '18.5 - 18.9',
                    chestCm: '118 - 123',
                    chestInch: '46.4 - 48.4',
                    shoulderCm: '53 - 54',
                    shoulderInch: '20.8 - 21.2',
                    waistCm: '102 - 107',
                    waistInch: '40.1 - 42.1',
                    hipCm: '115 - 120',
                    hipInch: '45.2 - 47.2',
                },
            ],
            women: [
                {
                    size: 'XS',
                    chestCm: '76 - 80',
                    chestInch: '29.9 - 31.5',
                    shoulderCm: '35 - 36',
                    shoulderInch: '13.7 - 14.1',
                    waistCm: '60 - 64',
                    waistInch: '23.6 - 25.2',
                    hipCm: '84 - 88',
                    hipInch: '33.0 - 34.6',
                },
                {
                    size: 'S',
                    chestCm: '81 - 85',
                    chestInch: '31.8 - 33.4',
                    shoulderCm: '37 - 38',
                    shoulderInch: '14.5 - 14.9',
                    waistCm: '65 - 69',
                    waistInch: '25.5 - 27.1',
                    hipCm: '89 - 93',
                    hipInch: '35.0 - 36.6',
                },
                {
                    size: 'M',
                    chestCm: '86 - 90',
                    chestInch: '33.8 - 35.4',
                    shoulderCm: '39 - 40',
                    shoulderInch: '15.3 - 15.7',
                    waistCm: '70 - 74',
                    waistInch: '27.5 - 29.1',
                    hipCm: '94 - 98',
                    hipInch: '37.0 - 38.6',
                },
                {
                    size: 'L',
                    chestCm: '91 - 95',
                    chestInch: '35.8 - 37.4',
                    shoulderCm: '41 - 42',
                    shoulderInch: '16.1 - 16.5',
                    waistCm: '75 - 79',
                    waistInch: '29.5 - 31.1',
                    hipCm: '99 - 103',
                    hipInch: '39.0 - 40.5',
                },
                {
                    size: 'XL',
                    chestCm: '96 - 101',
                    chestInch: '37.8 - 39.7',
                    shoulderCm: '43 - 44',
                    shoulderInch: '16.9 - 17.3',
                    waistCm: '80 - 85',
                    waistInch: '31.5 - 33.4',
                    hipCm: '104 - 108',
                    hipInch: '41.0 - 42.5',
                },
                {
                    size: 'XXL',
                    chestCm: '102 - 107',
                    chestInch: '40.1 - 42.1',
                    shoulderCm: '45 - 46',
                    shoulderInch: '17.7 - 18.1',
                    waistCm: '86 - 91',
                    waistInch: '33.8 - 35.8',
                    hipCm: '109 - 114',
                    hipInch: '43.0 - 44.8',
                },
                {
                    size: 'XXXL',
                    chestCm: '108 - 113',
                    chestInch: '42.5 - 44.4',
                    shoulderCm: '47 - 48',
                    shoulderInch: '18.5 - 18.9',
                    waistCm: '92 - 97',
                    waistInch: '36.2 - 38.1',
                    hipCm: '115 - 120',
                    hipInch: '45.2 - 47.2',
                },
            ],
        },
        bottoms: {
            men: [
                {
                    size: 'XS',
                    waistCm: '66 - 70',
                    waistInch: '26.0 - 27.5',
                    hipCm: '84 - 88',
                    hipInch: '33.0 - 34.6',
                    inseamCm: '77',
                    inseamInch: '30.3',
                },
                {
                    size: 'S',
                    waistCm: '71 - 75',
                    waistInch: '28.0 - 29.5',
                    hipCm: '89 - 93',
                    hipInch: '35.0 - 36.6',
                    inseamCm: '78',
                    inseamInch: '30.7',
                },
                {
                    size: 'M',
                    waistCm: '76 - 80',
                    waistInch: '30.0 - 31.5',
                    hipCm: '94 - 98',
                    hipInch: '37.0 - 38.6',
                    inseamCm: '80',
                    inseamInch: '31.5',
                },
                {
                    size: 'L',
                    waistCm: '81 - 85',
                    waistInch: '32.0 - 33.5',
                    hipCm: '99 - 103',
                    hipInch: '39.0 - 40.5',
                    inseamCm: '82',
                    inseamInch: '32.2',
                },
                {
                    size: 'XL',
                    waistCm: '86 - 90',
                    waistInch: '34.0 - 35.5',
                    hipCm: '104 - 108',
                    hipInch: '41.0 - 42.5',
                    inseamCm: '83',
                    inseamInch: '32.6',
                },
                {
                    size: 'XXL',
                    waistCm: '91 - 96',
                    waistInch: '36.0 - 37.8',
                    hipCm: '109 - 114',
                    hipInch: '43.0 - 44.8',
                    inseamCm: '84',
                    inseamInch: '33.0',
                },
                {
                    size: 'XXXL',
                    waistCm: '97 - 102',
                    waistInch: '38.2 - 40.1',
                    hipCm: '115 - 120',
                    hipInch: '45.2 - 47.2',
                    inseamCm: '85',
                    inseamInch: '33.5',
                },
            ],
            women: [
                {
                    size: 'XS',
                    waistCm: '60 - 64',
                    waistInch: '23.6 - 25.2',
                    hipCm: '84 - 88',
                    hipInch: '33.0 - 34.6',
                    inseamCm: '75',
                    inseamInch: '29.5',
                },
                {
                    size: 'S',
                    waistCm: '65 - 69',
                    waistInch: '25.5 - 27.1',
                    hipCm: '89 - 93',
                    hipInch: '35.0 - 36.6',
                    inseamCm: '76',
                    inseamInch: '29.9',
                },
                {
                    size: 'M',
                    waistCm: '70 - 74',
                    waistInch: '27.5 - 29.1',
                    hipCm: '94 - 98',
                    hipInch: '37.0 - 38.6',
                    inseamCm: '78',
                    inseamInch: '30.7',
                },
                {
                    size: 'L',
                    waistCm: '75 - 79',
                    waistInch: '29.5 - 31.1',
                    hipCm: '99 - 103',
                    hipInch: '39.0 - 40.5',
                    inseamCm: '80',
                    inseamInch: '31.5',
                },
                {
                    size: 'XL',
                    waistCm: '80 - 85',
                    waistInch: '31.5 - 33.4',
                    hipCm: '104 - 108',
                    hipInch: '41.0 - 42.5',
                    inseamCm: '81',
                    inseamInch: '31.8',
                },
                {
                    size: 'XXL',
                    waistCm: '86 - 91',
                    waistInch: '33.8 - 35.8',
                    hipCm: '109 - 114',
                    hipInch: '43.0 - 44.8',
                    inseamCm: '82',
                    inseamInch: '32.2',
                },
                {
                    size: 'XXXL',
                    waistCm: '92 - 97',
                    waistInch: '36.2 - 38.1',
                    hipCm: '115 - 120',
                    hipInch: '45.2 - 47.2',
                    inseamCm: '83',
                    inseamInch: '32.6',
                },
            ],
        },
        shoes: {
            men: [
                {
                    size: 'EU 39',
                    usSize: '6.5',
                    ukSize: '5.5',
                    footLengthCm: '24.5',
                    footLengthInch: '9.6',
                },
                {
                    size: 'EU 40',
                    usSize: '7.5',
                    ukSize: '6.5',
                    footLengthCm: '25.0',
                    footLengthInch: '9.8',
                },
                {
                    size: 'EU 41',
                    usSize: '8.5',
                    ukSize: '7.5',
                    footLengthCm: '25.5',
                    footLengthInch: '10.0',
                },
                {
                    size: 'EU 42',
                    usSize: '9.0',
                    ukSize: '8.0',
                    footLengthCm: '26.0',
                    footLengthInch: '10.2',
                },
                {
                    size: 'EU 43',
                    usSize: '10.0',
                    ukSize: '9.0',
                    footLengthCm: '27.0',
                    footLengthInch: '10.6',
                },
                {
                    size: 'EU 44',
                    usSize: '10.5',
                    ukSize: '9.5',
                    footLengthCm: '27.5',
                    footLengthInch: '10.8',
                },
                {
                    size: 'EU 45',
                    usSize: '11.5',
                    ukSize: '10.5',
                    footLengthCm: '28.5',
                    footLengthInch: '11.2',
                },
            ],
            women: [
                {
                    size: 'EU 35',
                    usSize: '5.0',
                    ukSize: '2.5',
                    footLengthCm: '22.0',
                    footLengthInch: '8.6',
                },
                {
                    size: 'EU 36',
                    usSize: '6.0',
                    ukSize: '3.5',
                    footLengthCm: '22.5',
                    footLengthInch: '8.8',
                },
                {
                    size: 'EU 37',
                    usSize: '6.5',
                    ukSize: '4.0',
                    footLengthCm: '23.5',
                    footLengthInch: '9.2',
                },
                {
                    size: 'EU 38',
                    usSize: '7.5',
                    ukSize: '5.0',
                    footLengthCm: '24.0',
                    footLengthInch: '9.4',
                },
                {
                    size: 'EU 39',
                    usSize: '8.5',
                    ukSize: '6.0',
                    footLengthCm: '25.0',
                    footLengthInch: '9.8',
                },
                {
                    size: 'EU 40',
                    usSize: '9.0',
                    ukSize: '6.5',
                    footLengthCm: '25.5',
                    footLengthInch: '10.0',
                },
                {
                    size: 'EU 41',
                    usSize: '10.0',
                    ukSize: '7.5',
                    footLengthCm: '26.5',
                    footLengthInch: '10.4',
                },
            ],
        },
    };

    get activeChart(): SizeChartRow[] {
        return this.allCharts[this.category][this.gender];
    }

    get currentMeasureImage(): string {
        return this.measureImages[`${this.category}-${this.gender}`];
    }
}
