import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { HistoryComponent } from './history/history.component';
import { BroadcastComponent } from './broadcast/broadcast.component';


const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    data: {
      title: 'Settings',
      breadcrumb: 'Settings'
    }
  },
  {
    path: 'history',
    component: HistoryComponent,
    data: {
      title: 'History',
      breadcrumb: 'History'
    }
  },
  {
    path: 'broadcast',
    component: BroadcastComponent,
    data: {
      title: 'Broadcast',
      breadcrumb: 'Broadcast'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagingRoutingModule { }
