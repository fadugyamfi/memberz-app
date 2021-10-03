import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagingRoutingModule } from './messaging-routing.module';
import { HistoryComponent } from './history/history.component';
import { SharedModule } from '../../shared/shared.module';
import { SettingsComponent } from './settings/settings.component';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { SmsTransactionHistoryComponent } from './sms-transaction-history/sms-transaction-history.component';
import { MessageComposerComponent } from './broadcast/message-composer/message-composer.component';
import { BroadcastHistoryViewComponent } from './broadcast/broadcast-history-view/broadcast-history-view.component';


@NgModule({
  declarations: [
    HistoryComponent,
    SettingsComponent,
    BroadcastComponent,
    SmsTransactionHistoryComponent,
    MessageComposerComponent,
    BroadcastHistoryViewComponent
  ],
  imports: [
    CommonModule,
    MessagingRoutingModule,
    SharedModule
  ]
})
export class MessagingModule { }
