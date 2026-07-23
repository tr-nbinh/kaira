import { CdkAccordionItem } from '@angular/cdk/accordion';
import { Component } from '@angular/core';

@Component({
    selector: 'app-accordion',
    templateUrl: './accordion.component.html',
    imports: [CdkAccordionItem],
})
export class AccordionComponent {}
