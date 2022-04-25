import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { HistoryComponent } from './history/history.component';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { BroadcastListsComponent } from './broadcast-lists/broadcast-lists.component';
import { BroadcastListPreviewComponent } from './broadcast-list-preview/broadcast-list-preview.component';
import { PurchaseCreditsComponent } from './purchase-credits/purchase-credits.component';


const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    data: {
      title: 'Messaging Settings',
      breadcrumb: 'Settings'
    }
  },
  {
    path: 'history',
    component: HistoryComponent,
    data: {
      title: 'Messaging History',
      breadcrumb: 'History'
    }
  },
  {
    path: 'broadcast',
    component: BroadcastComponent,
    data: {
      title: 'Message Broadcasts',
      breadcrumb: 'Broadcast'
    }
  },
  {
    path: 'broadcast-lists',
    component: BroadcastListsComponent,
    data: {
      title: 'Broadcast Lists',
      breadcrumb: 'Broadcast Lists'
    }
  },
  {
    path: 'broadcast-lists/:id/contacts',
    component: BroadcastListPreviewComponent,
    data: {
      title: 'Broadcast List Contacts',
      breadcrumb: 'Broadcast List Contacts'
    }
  },
  {
    path: 'purchase-credits',
    component: PurchaseCreditsComponent,
    data: {
      title: 'Purchase SMS Credits',
      breadcrumb: 'Purchase Credits'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagingRoutingModule { }
