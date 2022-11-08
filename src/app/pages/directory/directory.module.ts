import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectoryRoutingModule } from './directory-routing.module';
import { PublicComponent } from './public/public.component';
import { AvatarModule, AvatarSource } from 'ngx-avatars';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

const avatarSourcesOrder = [AvatarSource.CUSTOM, AvatarSource.INITIALS];

@NgModule({
  declarations: [
    PublicComponent
  ],
  imports: [
    CommonModule,
    DirectoryRoutingModule,
    PaginationComponent,
    AvatarModule.forRoot({
      sourcePriorityOrder: avatarSourcesOrder
    })
  ]
})
export class DirectoryModule { }
