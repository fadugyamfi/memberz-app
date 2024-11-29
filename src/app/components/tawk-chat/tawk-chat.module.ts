import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TawkChatComponent } from './tawk-chat.component';

@NgModule({
    imports: [
        CommonModule,
        TawkChatComponent
    ],
    exports: [
        TawkChatComponent
    ]
})
export class TawkChatModule { }
