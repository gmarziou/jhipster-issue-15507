import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OriginComponent } from '../list/origin.component';
import { OriginDetailComponent } from '../detail/origin-detail.component';
import { OriginUpdateComponent } from '../update/origin-update.component';
import { OriginRoutingResolveService } from './origin-routing-resolve.service';

const originRoute: Routes = [
  {
    path: '',
    component: OriginComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OriginDetailComponent,
    resolve: {
      origin: OriginRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OriginUpdateComponent,
    resolve: {
      origin: OriginRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OriginUpdateComponent,
    resolve: {
      origin: OriginRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(originRoute)],
  exports: [RouterModule],
})
export class OriginRoutingModule {}
