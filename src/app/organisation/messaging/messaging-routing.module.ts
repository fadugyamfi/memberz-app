import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';








const routes: Routes = [
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
    data: {
      title: 'Messaging Settings',
      breadcrumb: 'Settings'
    }
  },
  {
    path: 'history',
    loadComponent: () => import('./history/history.component').then(m => m.HistoryComponent),
    data: {
      title: 'Messaging History',
      breadcrumb: 'History'
    }
  },
  {
    path: 'broadcast',
    loadComponent: () => import('./broadcast/broadcast.component').then(m => m.BroadcastComponent),
    data: {
      title: 'Message Broadcasts',
      breadcrumb: 'Broadcast'
    }
  },
  {
    path: 'broadcast-lists',
    loadComponent: () => import('./broadcast-lists/broadcast-lists.component').then(m => m.BroadcastListsComponent),
    data: {
      title: 'Broadcast Lists',
      breadcrumb: 'Broadcast Lists'
    }
  },
  {
    path: 'broadcast-lists/:id/contacts',
    loadComponent: () => import('./broadcast-list-preview/broadcast-list-preview.component').then(m => m.BroadcastListPreviewComponent),
    data: {
      title: 'Broadcast List Contacts',
      breadcrumb: 'Broadcast List Contacts'
    }
  },
  {
    path: 'purchase-credits',
    loadComponent: () => import('./purchase-credits/purchase-credits.component').then(m => m.PurchaseCreditsComponent),
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
