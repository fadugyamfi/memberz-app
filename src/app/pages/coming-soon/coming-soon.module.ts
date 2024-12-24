import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComingSoonRoutingModule } from './coming-soon-routing.module';
import { SimpleComponent } from './simple/simple.component';
import { PageWithImageComponent } from './page-with-image/page-with-image.component';
import { PageWithVideoComponent } from './page-with-video/page-with-video.component';

@NgModule({
    imports: [
        CommonModule,
        ComingSoonRoutingModule,
        SimpleComponent, PageWithImageComponent, PageWithVideoComponent
    ]
})
export class ComingSoonModule { }
