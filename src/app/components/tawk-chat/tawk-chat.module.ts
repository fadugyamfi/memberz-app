import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TawkChatComponent } from './tawk-chat.component';

@NgModule({
  declarations: [
    TawkChatComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TawkChatComponent
  ]
})
export class TawkChatModule { }
