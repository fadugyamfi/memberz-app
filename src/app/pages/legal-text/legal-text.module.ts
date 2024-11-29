import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LegalTextRoutingModule } from './legal-text-routing.module';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { DataUsePolicyComponent } from './data-use-policy/data-use-policy.component';
import { AboutModule } from '../about/about.module';


@NgModule({
    imports: [
        CommonModule,
        LegalTextRoutingModule,
        AboutModule,
        TermsAndConditionsComponent,
        DataUsePolicyComponent
    ]
})
export class LegalTextModule { }
