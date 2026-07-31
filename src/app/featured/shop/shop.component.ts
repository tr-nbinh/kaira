import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.componet';
import { DrawerService } from '../../../shared/components/drawer/drawer.service';
import { PaginationMeta } from '../../../shared/models/list-repsonse.model';
import { Product, ProductFilter } from '../../../shared/models/product.model';
import { ProductService } from '../../../shared/services/product.service';
import { ShopFilterDrawerComponent } from './components/filter-drawer/shop-filter-drawer.component';
import { ShopHeroComponent } from './components/hero/shop-hero.component';
import { ShopProductGridComponent } from './components/product-grid/shop-product-grid.component';
import {
    GridViewType,
    ShopToolbarComponent,
} from './components/toolbar/shop-toolbar.component';
import { FilterFacade } from './services/filter-facade.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    imports: [
        ReactiveFormsModule,
        BreadcrumbComponent,
        ShopHeroComponent,
        ShopToolbarComponent,
        ShopProductGridComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent {
    private readonly drawerService = inject(DrawerService);
    private readonly productService = inject(ProductService);
    private readonly title = inject(Title);
    private readonly meta = inject(Meta);
    private readonly filterFacade = inject(FilterFacade);
    private readonly translate = inject(TranslateService);

    // 1. Nhận cờ isCategoryPage từ route data
    isCategoryPage = input<boolean>(false);
    // 2. Nhận categoryPath từ posParams của matcher (VD: "women/top/shirt")
    categoryPath = input<string>('');

    readonly productResource = rxResource({
        request: () => ({
            filters: this.filterFacade.filters(),
            isCategoryPage: this.isCategoryPage(),
            categoryPath: this.categoryPath(),
        }),
        loader: ({ request, previous }) => {
            if (request.isCategoryPage) {
                return this.productService.getProductByCategory(
                    request.categoryPath,
                    request.filters,
                );
            }
            return this.productService.getProducts(request.filters);
        },
        defaultValue: { data: [], meta: { totalCount: 0 } as PaginationMeta },
    });

    readonly products = computed(() => this.productResource.value().data);
    readonly pagination = computed(() => this.productResource.value().meta);
    readonly gridView = signal<GridViewType>(4);

    breadcrumbItems = [
        {
            label: 'Home',
            url: '/',
        },
        {
            label: 'Shop',
        },
    ];

    constructor() {
        this.setSeo();
    }

    ngOnInit() {
        this.filterFacade.initFromQueryParams();
    }

    private setSeo() {
        this.title.setTitle('Shop | Fashion Store');
        this.meta.updateTag({
            name: 'description',
            content: 'Browse our latest fashion collection.',
        });
    }

    openFilterDrawer() {
        this.drawerService.open<ProductFilter>({
            title: this.translate.instant('COMMON.FILTER'),
            position: 'left',
            size: 'xl',
            content: ShopFilterDrawerComponent,
        });
    }

    loadMore() {
        console.log('Load more');
    }
}
