import { AfterViewInit, Component } from '@angular/core';
import { jarallax } from 'jarallax';
import { RouterLink } from "@angular/router";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    imports: [RouterLink, TranslatePipe],
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
