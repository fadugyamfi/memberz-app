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
import { BroadcastListsComponent } from './broadcast-lists/broadcast-lists.component';
import { BroadcastListPreviewComponent } from './broadcast-list-preview/broadcast-list-preview.component';
import { ListFilterComponent } from './broadcast-lists/list-filter/list-filter.component';
import { PurchaseCreditsComponent } from './purchase-credits/purchase-credits.component';


@NgModule({
    imports: [
        CommonModule,
        MessagingRoutingModule,
        SharedModule,
        HistoryComponent,
        SettingsComponent,
        BroadcastComponent,
        SmsTransactionHistoryComponent,
        MessageComposerComponent,
        BroadcastHistoryViewComponent,
        BroadcastListsComponent,
        BroadcastListPreviewComponent,
        ListFilterComponent,
        PurchaseCreditsComponent
    ]
})
export class MessagingModule { }
