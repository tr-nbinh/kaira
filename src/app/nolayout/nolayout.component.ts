import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-nolayout',
    imports: [TranslatePipe, RouterModule],
    templateUrl: './nolayout.component.html',
    styleUrl: './nolayout.component.scss',
})
export class NolayoutComponent {
    pageContent: { title: string; desc: string } = {
        title: 'COMMON.COMING_SOON',
        desc: '',
    };

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe((data) => {
            if (data && Object.keys(data).length) {
                this.pageContent = data as { title: string; desc: string };
            }
        });
    }
}
