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
      breadcrumb: 'Settings'
    }
  },
  {
    path: 'history',
    component: HistoryComponent,
    data: {
      breadcrumb: 'History'
    }
  },
  {
    path: 'broadcast',
    component: BroadcastComponent,
    data: {
      breadcrumb: 'Broadcast'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagingRoutingModule { }
