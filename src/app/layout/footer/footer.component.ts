import { AfterViewInit, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { jarallax } from 'jarallax';

@Component({
    selector: 'app-footer',
    imports: [TranslateModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent implements AfterViewInit {
    ngAfterViewInit() {
        var initJarallax = function () {
            jarallax(document.querySelectorAll('.jarallax'), {});

            jarallax(document.querySelectorAll('.jarallax-keep-img'), {
                keepImg: true,
            });
        };
    }
}
