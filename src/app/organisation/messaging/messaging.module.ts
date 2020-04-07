import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagingRoutingModule } from './messaging-routing.module';
import { HistoryComponent } from './history/history.component';
import { SharedModule } from '../../shared/shared.module';
import { SettingsComponent } from './settings/settings.component';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { SmsTransactionHistoryComponent } from './sms-transaction-history/sms-transaction-history.component';


@NgModule({
  declarations: [
    HistoryComponent,
    SettingsComponent,
    BroadcastComponent,
    SmsTransactionHistoryComponent
  ],
  imports: [
    CommonModule,
    MessagingRoutingModule,
    SharedModule
  ]
})
export class MessagingModule { }
